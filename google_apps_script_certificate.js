/**
 * JuiceTap — Champion Certificate Email Endpoint (Google Apps Script)
 * ===================================================================
 * Clean, production-ready backend script for sending JuiceTap Champion Certificates.
 */

var CERT_LOG_SHEET = 'Certificates';

/**
 * Diagnostic helper — Run this function manually in Apps Script Editor to grant permissions!
 */
function testMailAppPermission() {
  var quota = MailApp.getRemainingDailyQuota();
  Logger.log('[JuiceTap Test] Remaining Daily Mail Quota: ' + quota);
  if (quota <= 0) {
    throw new Error('Daily email quota exceeded or zero.');
  }
  var recipient = Session.getActiveUser().getEmail() || Session.getEffectiveUser().getEmail();
  Logger.log('[JuiceTap Test] Sending test email to: ' + recipient);
  GmailApp.sendEmail(recipient, 'JuiceTap Permission Test 🍊', 'If you receive this email, your Apps Script Gmail permissions and account quota are fully functional.', {
    name: 'JuiceTap'
  });
  Logger.log('[JuiceTap Test] Test email sent successfully via GmailApp!');
}

/**
 * GET Handler — Provides health check endpoint for testing in browser.
 */
function doGet(e) {
  return _json({
    success: true,
    message: 'JuiceTap Certificate Email API is running'
  });
}

/**
 * POST Handler — Receives PDF payload, decodes, and sends email via GmailApp / MailApp.
 */
function doPost(e) {
  console.log('[JuiceTap Certificate] doPost received request');

  try {
    if (!e || !e.postData || !e.postData.contents) {
      console.error('[JuiceTap Certificate] Error: Missing postData contents');
      return _json({ success: false, error: 'No data provided in request' });
    }

    var data;
    try {
      data = JSON.parse(e.postData.contents);
    } catch (parseErr) {
      console.error('[JuiceTap Certificate] JSON Parse Error:', parseErr);
      return _json({ success: false, error: 'Invalid JSON payload format' });
    }

    // Action validation (supports action: "sendCertificate" or legacy type: "champion_certificate")
    var action = data.action || data.type;
    if (action !== 'sendCertificate' && action !== 'champion_certificate') {
      console.error('[JuiceTap Certificate] Error: Invalid action/type:', action);
      return _json({ success: false, error: 'Invalid or unsupported action' });
    }

    var name = String(data.name || '').trim();
    var email = String(data.email || '').trim();
    var city = String(data.city || '').trim();
    var pdfB64 = String(data.pdfBase64 || data.pdfData || '').trim();
    var fileName = String(data.fileName || data.filename || 'Meet-Champion-Certificate.pdf').trim();

    if (!fileName.toLowerCase().endsWith('.pdf')) {
      fileName += '.pdf';
    }

    // Strip Data URL prefix if present (e.g. data:application/pdf;base64,)
    if (pdfB64.indexOf(',') !== -1) {
      pdfB64 = pdfB64.split(',')[1];
    }

    console.log('[JuiceTap Certificate] Recipient Email:', email);
    console.log('[JuiceTap Certificate] Recipient Name:', name);
    console.log('[JuiceTap Certificate] Base64 PDF Length:', pdfB64.length);

    // Validation
    var emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email || !emailRegex.test(email)) {
      console.error('[JuiceTap Certificate] Validation error: Invalid email format');
      return _json({ success: false, error: 'Invalid recipient email address' });
    }

    if (!name) {
      console.error('[JuiceTap Certificate] Validation error: Name is required');
      return _json({ success: false, error: 'Name is required' });
    }

    if (!pdfB64) {
      console.error('[JuiceTap Certificate] Validation error: PDF Base64 string is missing');
      return _json({ success: false, error: 'Certificate PDF data is missing' });
    }

    // Check remaining daily email quota
    var remainingQuota = MailApp.getRemainingDailyQuota();
    console.log('[JuiceTap Certificate] Remaining Daily Mail Quota:', remainingQuota);
    if (remainingQuota <= 0) {
      console.error('[JuiceTap Certificate] Mail quota exceeded (0 remaining)');
      return _json({ success: false, error: 'Email service quota limit reached for today' });
    }

    // Decode Base64 bytes
    var bytes;
    try {
      bytes = Utilities.base64Decode(pdfB64);
    } catch (decodeErr) {
      console.error('[JuiceTap Certificate] Base64 decoding failed:', decodeErr);
      return _json({ success: false, error: 'Failed to decode certificate PDF data' });
    }

    if (!bytes || bytes.length === 0) {
      console.error('[JuiceTap Certificate] Decoded byte buffer is 0 bytes');
      return _json({ success: false, error: 'Certificate PDF data corrupted or empty' });
    }

    // Create PDF Blob
    var blob = Utilities.newBlob(bytes, 'application/pdf', fileName);
    console.log('[JuiceTap Certificate] Created PDF Blob:', fileName, '(' + blob.getBytes().length + ' bytes)');

    var subject = 'JuiceTap Meet Champion Certificate 🍊🏆';
    var plainTextBody = 'Congratulations!\n\n' +
      'Your Meet Champion certificate has been successfully generated.\n\n' +
      'Please find your certificate attached to this email.\n\n' +
      'Thank you for participating in JuiceTap Meet Champion.\n\n' +
      'Regards,\nJuiceTap Team';

    var htmlBody = _certificateEmailHtml(name, city);

    console.log('[JuiceTap Certificate] Sending email to:', email);

    // Send Email using GmailApp or MailApp
    try {
      GmailApp.sendEmail(email, subject, plainTextBody, {
        htmlBody: htmlBody,
        name: 'JuiceTap',
        replyTo: 'support@juicetap.in',
        attachments: [blob]
      });
      console.log('[JuiceTap Certificate] GmailApp sent email successfully to:', email);
    } catch (gmailErr) {
      console.warn('[JuiceTap Certificate] GmailApp notice, trying MailApp:', gmailErr);
      MailApp.sendEmail({
        to: email,
        subject: subject,
        body: plainTextBody,
        htmlBody: htmlBody,
        name: 'JuiceTap',
        replyTo: 'support@juicetap.in',
        attachments: [blob]
      });
      console.log('[JuiceTap Certificate] MailApp sent email successfully to:', email);
    }

    // Log to Google Sheet (optional/best-effort)
    _logCertificate(name, email, city);

    return _json({
      success: true,
      message: 'Certificate email sent successfully'
    });

  } catch (err) {
    var errMsg = err && err.message ? err.message : String(err);
    console.error('[JuiceTap Certificate] Error in doPost:', errMsg);
    return _json({
      success: false,
      message: 'Failed to send certificate email',
      error: errMsg
    });
  }
}

function _certificateEmailHtml(name, city) {
  var safeName = _escape(name);
  var safeCity = _escape(city);
  var locationLine = safeCity ? '<div style="font-size:14px;color:#F08121;font-weight:700;letter-spacing:0.5px;margin-bottom:16px;text-transform:uppercase;">📍 CHAMPION FROM ' + safeCity + '</div>' : '';

  return (
    '<!DOCTYPE html>' +
    '<html lang="en">' +
    '<head>' +
    '<meta charset="UTF-8">' +
    '<title>Your JuiceTap Champion Certificate</title>' +
    '</head>' +
    '<body style="margin:0;padding:0;background-color:#FFFDF9;font-family:-apple-system,BlinkMacSystemFont,\'Segoe UI\',Roboto,Helvetica,Arial,sans-serif;">' +
    '<table role="presentation" width="100%" border="0" cellspacing="0" cellpadding="0" style="background-color:#FFFDF9;padding:30px 10px 40px;">' +
    '<tr>' +
    '<td align="center">' +
    '<table role="presentation" width="100%" border="0" cellspacing="0" cellpadding="0" style="max-width:580px;background-color:#ffffff;border-radius:24px;overflow:hidden;border:1px solid #F3E8D8;box-shadow:0 12px 36px rgba(240,129,33,0.08);">' +
    '<tr>' +
    '<td align="center" style="background-color:#ffffff;padding:28px 24px 20px;border-bottom:3px solid #F08121;">' +
    '<div style="font-size:28px;font-weight:900;color:#F08121;letter-spacing:1px;">Juice<span style="color:#0F381E;">Tap</span>™</div>' +
    '<div style="font-size:11px;font-weight:800;color:#F08121;margin-top:6px;letter-spacing:2px;text-transform:uppercase;">FRESH JUICE. ONE TAP AWAY.</div>' +
    '</td>' +
    '</tr>' +
    '<tr>' +
    '<td style="padding:40px 32px 28px;color:#1C2B20;">' +
    '<h1 style="font-size:24px;font-weight:800;color:#0F381E;margin:0 0 8px;line-height:1.3;">Congratulations, ' + safeName + '! 🍊🏆</h1>' +
    '<p style="font-size:16px;line-height:1.6;color:#3A4A3F;margin:0 0 20px;font-weight:500;">You are officially a <strong style="color:#F08121;">JuiceTap Champion</strong>.</p>' +
    locationLine +
    '<p style="font-size:15px;line-height:1.65;color:#55665A;margin:0 0 28px;">' +
    'Your Meet Champion certificate has been successfully generated. Please find your certificate attached to this email.' +
    '</p>' +
    '<table role="presentation" width="100%" border="0" cellspacing="0" cellpadding="0" style="background-color:#FFF7EE;border-radius:16px;border:1.5px dashed #F5C69D;margin-bottom:32px;">' +
    '<tr>' +
    '<td style="padding:22px 24px;text-align:center;">' +
    '<div style="font-size:28px;margin-bottom:6px;">🏆</div>' +
    '<div style="font-size:15px;font-weight:800;color:#D46A10;letter-spacing:0.5px;margin-bottom:4px;text-transform:uppercase;">YOUR CHAMPION CERTIFICATE</div>' +
    '<div style="font-size:14px;color:#665445;line-height:1.5;">Attached as Meet-Champion-Certificate.pdf</div>' +
    '</td>' +
    '</tr>' +
    '</table>' +
    '<p style="font-size:15px;line-height:1.6;color:#3A4A3F;margin:0 0 28px;">' +
    'Thank you for participating in JuiceTap Meet Champion.<br>' +
    '<strong style="color:#0F381E;">Regards,<br>JuiceTap Team</strong>' +
    '</p>' +
    '</td>' +
    '</tr>' +
    '<tr>' +
    '<td style="background-color:#0F381E;padding:24px 32px;text-align:center;color:#BCCBC0;font-size:13px;line-height:1.6;">' +
    '<div style="font-weight:700;color:#FFFFFF;margin-bottom:4px;">JUICETAP GLOBAL PVT. LTD.</div>' +
    '<div>Support: <a href="mailto:support@juicetap.in" style="color:#FFB775;text-decoration:none;">support@juicetap.in</a></div>' +
    '</td>' +
    '</tr>' +
    '</table>' +
    '</td>' +
    '</tr>' +
    '</table>' +
    '</body>' +
    '</html>'
  );
}

function _logCertificate(name, email, city) {
  try {
    var ss = SpreadsheetApp.getActiveSpreadsheet();
    if (!ss) return;
    var sheet = ss.getSheetByName(CERT_LOG_SHEET);
    if (!sheet) {
      sheet = ss.insertSheet(CERT_LOG_SHEET);
      sheet.appendRow(['timestamp', 'name', 'email', 'city']);
    }
    sheet.appendRow([new Date(), name, email, city]);
  } catch (err) {
    console.warn('[JuiceTap Certificate] Sheet logging skipped/failed:', err);
  }
}

function _json(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj)).setMimeType(
    ContentService.MimeType.JSON
  );
}

function _escape(s) {
  return String(s)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}