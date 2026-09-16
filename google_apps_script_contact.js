/**
 * JuiceTap - Contact Us Form Submission Handler (Google Apps Script)
 * 
 * Instructions:
 * 1. Open Google Sheets (https://sheets.google.com) and create/open your submissions spreadsheet.
 * 2. Go to Extensions -> Apps Script.
 * 3. Clear any existing code in Code.gs and paste this entire script.
 * 4. Select function "testSendEmail" in the top menu bar and click "Run" (▶).
 * 5. Authorize permissions when prompted (Review permissions -> Select Account -> Advanced -> Go to project -> Allow).
 * 6. Click Deploy -> New deployment (or Manage deployments -> Edit -> New version).
 * 7. Set Web App settings:
 *    - Execute as: Me
 *    - Who has access: Anyone
 * 8. Click Deploy.
 */

// Handle POST request from frontend
function doPost(e) {
  try {
    let payload = {};

    // 1. Parse incoming POST payload safely
    if (e && e.postData && e.postData.contents) {
      try {
        payload = JSON.parse(e.postData.contents);
      } catch (jsonErr) {
        // Fallback for form-encoded data
        payload = e.parameter || {};
      }
    } else if (e && e.parameter) {
      payload = e.parameter;
    }

    // Extract fields
    const name = sanitizeInput(payload.name || '');
    const email = sanitizeInput(payload.email || '');
    const phone = sanitizeInput(payload.phone || '');
    const enquiryType = sanitizeInput(payload.enquiryType || payload.subject || '');
    const message = sanitizeInput(payload.message || '');
    const websiteUrl = payload.website_url || payload.honeypot || '';

    // Basic Honeypot Check: If honeypot is filled, silently discard spam
    if (websiteUrl.trim() !== '') {
      return createJsonResponse({
        success: true,
        message: "Submission received successfully"
      });
    }

    // 2. Server-side validation
    if (!name || !email || !phone || !enquiryType || !message) {
      return createJsonResponse({
        success: false,
        error: "Missing required fields"
      });
    }

    // 3. Generate Asia/Kolkata server-side timestamps
    const now = new Date();
    const timeZone = "Asia/Kolkata";
    const formattedDate = Utilities.formatDate(now, timeZone, "dd/MM/yyyy");
    const formattedTime = Utilities.formatDate(now, timeZone, "hh:mm a");
    const fullTimestamp = Utilities.formatDate(now, timeZone, "dd/MM/yyyy hh:mm:ss a z");

    // 4. Append to active Google Sheet
    const sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();

    // Create headers if empty
    if (sheet.getLastRow() === 0) {
      sheet.appendRow([
        "Submission Date",
        "Submission Time",
        "Full Timestamp",
        "Full Name",
        "Email",
        "Phone Number",
        "Subject / Enquiry Type",
        "Message"
      ]);
    }

    // Append new row (never overwrites existing rows)
    sheet.appendRow([
      formattedDate,
      formattedTime,
      fullTimestamp,
      name,
      email,
      phone,
      enquiryType,
      message
    ]);

    // 5. Send automatic email notification to support@juicetap.in
    try {
      const recipient = "support@juicetap.in";
      const emailSubject = "New Contact Enquiry - JuiceTap Website (" + enquiryType + ")";

      const textBody =
        "Hello JuiceTap Team,\n\n" +
        "A new enquiry has been submitted through the Connect With Us form on the JuiceTap website.\n\n" +
        "Customer Details:\n" +
        "----------------------------------------\n" +
        "Full Name: " + name + "\n" +
        "Email: " + email + "\n" +
        "Phone Number: " + phone + "\n" +
        "Enquiry Type: " + enquiryType + "\n" +
        "Message: " + message + "\n" +
        "----------------------------------------\n" +
        "Submission Date: " + formattedDate + "\n" +
        "Submission Time: " + formattedTime + "\n" +
        "Full Timestamp: " + fullTimestamp + "\n" +
        "----------------------------------------\n\n" +
        "Please follow up with the customer accordingly.\n\n" +
        "Regards,\n" +
        "JuiceTap Website";

      const htmlBody =
        "<div style='font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #E0E0E0; border-radius: 8px; overflow: hidden; background-color: #FFFFFF;'>" +
          "<div style='background-color: #E65100; color: #FFFFFF; padding: 20px; text-align: center;'>" +
            "<h2 style='margin: 0; font-size: 22px; font-weight: bold;'>JuiceTap Website Enquiry</h2>" +
            "<p style='margin: 5px 0 0 0; font-size: 14px; opacity: 0.9;'>New Customer Contact Notification</p>" +
          "</div>" +
          "<div style='padding: 24px; color: #333333; line-height: 1.6;'>" +
            "<p style='margin-top: 0;'>Hello JuiceTap Team,</p>" +
            "<p>A new enquiry has been submitted through the <b>Connect With Us</b> form on the website.</p>" +
            "<table style='width: 100%; border-collapse: collapse; margin: 20px 0; background-color: #F9F9F9; border-radius: 6px; overflow: hidden;'>" +
              "<tr style='border-bottom: 1px solid #EEEEEE;'><td style='padding: 12px; font-weight: bold; width: 35%; color: #E65100;'>Full Name:</td><td style='padding: 12px;'>" + escapeHtml(name) + "</td></tr>" +
              "<tr style='border-bottom: 1px solid #EEEEEE;'><td style='padding: 12px; font-weight: bold; color: #E65100;'>Email:</td><td style='padding: 12px;'><a href='mailto:" + escapeHtml(email) + "' style='color: #0277BD; text-decoration: none;'>" + escapeHtml(email) + "</a></td></tr>" +
              "<tr style='border-bottom: 1px solid #EEEEEE;'><td style='padding: 12px; font-weight: bold; color: #E65100;'>Phone Number:</td><td style='padding: 12px;'><a href='tel:" + escapeHtml(phone) + "' style='color: #0277BD; text-decoration: none;'>" + escapeHtml(phone) + "</a></td></tr>" +
              "<tr style='border-bottom: 1px solid #EEEEEE;'><td style='padding: 12px; font-weight: bold; color: #E65100;'>Enquiry Type:</td><td style='padding: 12px;'>" + escapeHtml(enquiryType) + "</td></tr>" +
              "<tr><td style='padding: 12px; font-weight: bold; color: #E65100; vertical-align: top;'>Message:</td><td style='padding: 12px; white-space: pre-wrap;'>" + escapeHtml(message) + "</td></tr>" +
            "</table>" +
            "<p style='font-size: 13px; color: #757575; border-top: 1px solid #EEEEEE; padding-top: 12px;'>" +
              "<b>Submitted On:</b> " + formattedDate + " at " + formattedTime + " (" + fullTimestamp + ")" +
            "</p>" +
            "<p style='margin-bottom: 0;'>Regards,<br><b>JuiceTap Website</b></p>" +
          "</div>" +
        "</div>";

      sendNotificationEmail(recipient, emailSubject, textBody, htmlBody, email);
    } catch (emailError) {
      Logger.log("Email notification failed: " + (emailError && emailError.toString ? emailError.toString() : emailError));
    }

    // 6. Return success response
    return createJsonResponse({
      success: true,
      message: "Submission received successfully"
    });

  } catch (error) {
    return createJsonResponse({
      success: false,
      error: "Internal server error"
    });
  }
}

// Handle GET request (Safety block: returns status only, NEVER exposes sheet data)
function doGet(e) {
  return createJsonResponse({
    status: "online",
    service: "JuiceTap Contact Submissions API",
    note: "GET method does not expose submission data for privacy."
  });
}

/**
 * Universal email helper combining GmailApp & MailApp fallback
 */
function sendNotificationEmail(recipient, subject, textBody, htmlBody, replyTo) {
  const options = {
    name: "JuiceTap Website",
    htmlBody: htmlBody
  };
  if (replyTo) {
    options.replyTo = replyTo;
  }

  // 1. Primary: GmailApp
  try {
    GmailApp.sendEmail(recipient, subject, textBody, options);
    Logger.log("Email sent via GmailApp to: " + recipient);
    return true;
  } catch (gmailErr) {
    Logger.log("GmailApp notice: " + gmailErr.toString() + ". Trying MailApp...");
  }

  // 2. Fallback: MailApp
  try {
    MailApp.sendEmail({
      to: recipient,
      subject: subject,
      body: textBody,
      htmlBody: htmlBody,
      replyTo: replyTo || undefined
    });
    Logger.log("Email sent via MailApp to: " + recipient);
    return true;
  } catch (mailErr) {
    Logger.log("MailApp error: " + mailErr.toString());
    throw mailErr;
  }
}

// Helper: Sanitize inputs
function sanitizeInput(str) {
  if (typeof str !== 'string') return '';
  return str.trim();
}

// Helper: Escape HTML special characters for safe email rendering
function escapeHtml(str) {
  if (typeof str !== 'string') return '';
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

// Helper: Create JSON Output with CORS headers
function createJsonResponse(data) {
  return ContentService.createTextOutput(JSON.stringify(data))
    .setMimeType(ContentService.MimeType.JSON);
}

/**
 * Run this function ONCE inside Google Apps Script editor to trigger
 * and test email permissions cleanly. Check Executions log for output.
 */
function testSendEmail() {
  const testRecipient = "support@juicetap.in";
  Logger.log("Attempting to send test email to: " + testRecipient);

  const htmlMessage =
    "<div style='font-family: Arial, sans-serif; padding: 20px; color: #333; max-width: 500px; border: 1px solid #E65100; border-radius: 8px;'>" +
    "<h3 style='color: #E65100; margin-top: 0;'>JuiceTap Email Test</h3>" +
    "<p>If you receive this email, your Google Apps Script email permissions are authorized correctly!</p>" +
    "<p><b>Target Recipient:</b> " + testRecipient + "</p>" +
    "</div>";

  try {
    sendNotificationEmail(
      testRecipient,
      "Test Email Authorization - JuiceTap",
      "If you receive this email, your Apps Script permissions are authorized correctly!",
      htmlMessage
    );
    Logger.log("SUCCESS: Test email sent cleanly to " + testRecipient);
  } catch (err) {
    Logger.log("ERROR sending test email: " + err.toString());
    throw new Error("Email sending failed: " + err.toString());
  }
}
