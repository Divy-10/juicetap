/**
 * JuiceTap - Contact Us Form Submission Handler (Google Apps Script)
 * 
 * Instructions:
 * 1. Open Google Sheets (https://sheets.google.com) and create a new blank spreadsheet.
 * 2. Rename Sheet1 or ensure line 1 has these exact headers:
 *    Submission Date | Submission Time | Full Timestamp | Full Name | Email | Phone Number | Subject / Enquiry Type | Message
 * 
 * 3. Go to Extensions -> Apps Script.
 * 4. Clear any code in Code.gs and paste this entire script.
 * 5. Click Save (floppy disk icon or Ctrl+S).
 * 6. Click Deploy -> New deployment.
 * 7. Click Select type (gear icon) -> Web app.
 * 8. Set Configuration:
 *    - Description: JuiceTap Contact Form Submissions API
 *    - Execute as: Me (your Google Account)
 *    - Who has access: Anyone (allows frontend submissions while keeping sheet private)
 * 9. Click Deploy, authorize access if prompted.
 * 10. Copy the Web App URL and add it as VITE_GOOGLE_APPS_SCRIPT_URL in your .env file.
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

    // 5. Return success response
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

// Helper: Sanitize inputs
function sanitizeInput(str) {
  if (typeof str !== 'string') return '';
  return str.trim();
}

// Helper: Create JSON Output with CORS headers
function createJsonResponse(data) {
  return ContentService.createTextOutput(JSON.stringify(data))
    .setMimeType(ContentService.MimeType.JSON);
}
