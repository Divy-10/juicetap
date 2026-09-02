/**
 * JuiceTap — Champion Certificate Email Endpoint (Google Apps Script)
 * ===================================================================
 *
 * This adds server-side email delivery for the "Meet Champion" page.
 * The browser generates the certificate PDF and POSTs it here; this
 * script emails it as an attachment. No SMTP passwords or API keys ever
 * touch the frontend — everything sensitive stays inside Apps Script,
 * which runs under your own Google account.
 *
 * ── SETUP (recommended: reuse your existing Locations script) ──────────
 * 1. Open your existing "JuiceTap Locations" Google Sheet.
 * 2. Extensions > Apps Script.
 * 3. Paste the doPost() + helpers below into the SAME Code.gs, keeping
 *    your existing doGet() untouched. (doGet handles Locations; doPost
 *    handles certificates — they can live side by side.)
 * 4. Deploy > Manage deployments > (your existing Web app) > Edit (pencil)
 *    > Version: "New version" > Deploy.  ⟵ keeps the SAME /exec URL.
 *      • Execute as: Me
 *      • Who has access: Anyone
 * 5. Copy the Web App /exec URL and put it in the JuiceTap project .env:
 *        VITE_CERTIFICATE_API_URL=https://script.google.com/macros/s/XXXX/exec
 *    Then rebuild/redeploy the site (npm run build).
 *
 *    Prefer a separate script? Create a new Apps Script project, paste
 *    everything, deploy as a new Web app, and use that URL instead.
 *
 * ── NOTES ──────────────────────────────────────────────────────────────
 * • The frontend sends the request as a "simple" text/plain POST and does
 *   not read the response (no-cors), so no CORS setup is required.
 * • Email quota: ~100 recipients/day on consumer Gmail, ~1,500/day on
 *   Google Workspace (MailApp). Plenty for this use case.
 * • Every certificate is also logged to a "Certificates" tab (created
 *   automatically) for your records + basic duplicate visibility.
 */

var CERT_LOG_SHEET = 'Certificates';

function doGet() {
  return ContentService
    .createTextOutput("JuiceTap Certificate API is running.")
    .setMimeType(ContentService.MimeType.TEXT);
}


function doPost(e) {
  try {
    if (!e || !e.postData || !e.postData.contents) {
      return _json({ success: false, error: 'No data' });
    }

    var data = JSON.parse(e.postData.contents);
    if (data.type !== 'champion_certificate') {
      return _json({ success: false, error: 'Unknown request type' });
    }

    var name = String(data.name || '').trim();
    var email = String(data.email || '').trim();
    var city = String(data.city || '').trim();
    var pdfB64 = String(data.pdfBase64 || '');
    var filename = String(data.filename || 'JuiceTap-Champion-Certificate.pdf');

    // Server-side validation (never trust the client alone)
    var emailOk = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    var nameOk = name.length >= 2 && name.length <= 60;
    if (!nameOk || !emailOk || !pdfB64) {
      return _json({ success: false, error: 'Invalid name, email or certificate' });
    }

    // Rebuild the PDF the browser produced and attach it.
    var bytes = Utilities.base64Decode(pdfB64);
    var blob = Utilities.newBlob(bytes, 'application/pdf', filename);

    var subject = 'Your JuiceTap Champion Certificate 🍊🏆';
    var htmlBody = _certificateEmailHtml(name, city);

    
    // Decode inline logo blob for email client CID embedding
    MailApp.sendEmail({
      to: email,
      subject: subject,
      htmlBody: htmlBody,
      name: 'JuiceTap',
      attachments: [blob]
    });

    _logCertificate(name, email, city);

    return _json({ success: true });
  } catch (err) {
    return _json({ success: false, error: String(err) });
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
    '<meta name="viewport" content="width=device-width, initial-scale=1.0">' +
    '<title>Your JuiceTap Champion Certificate</title>' +
    '</head>' +
    '<body style="margin:0;padding:0;background-color:#FFFDF9;font-family:-apple-system,BlinkMacSystemFont,\'Segoe UI\',Roboto,Helvetica,Arial,sans-serif;-webkit-font-smoothing:antialiased;">' +
    '<table role="presentation" width="100%" border="0" cellspacing="0" cellpadding="0" style="background-color:#FFFDF9;padding:30px 10px 40px;">' +
    '<tr>' +
    '<td align="center">' +
    '<!-- Main Container -->' +
    '<table role="presentation" width="100%" border="0" cellspacing="0" cellpadding="0" style="max-width:580px;background-color:#ffffff;border-radius:24px;overflow:hidden;border:1px solid #F3E8D8;box-shadow:0 12px 36px rgba(240,129,33,0.08);">' +

    '<!-- Header -->' +
    '<tr>' +
    '<td align="center" style="background-color:#ffffff;padding:28px 24px 20px;border-bottom:3px solid #F08121;">' +
    '<div style="font-size:28px;font-weight:900;color:#F08121;letter-spacing:1px;font-family:sans-serif;">Juice<span style="color:#0F381E;">Tap</span>™</div>' +
    '<div style="font-size:11px;font-weight:800;color:#F08121;margin-top:6px;letter-spacing:2px;text-transform:uppercase;">FRESH JUICE. ONE TAP AWAY.</div>' +
    '</td>' +
    '</tr>' +

    '<!-- Body Content -->' +
    '<tr>' +
    '<td style="padding:40px 32px 28px;color:#1C2B20;">' +
    '<h1 style="font-size:24px;font-weight:800;color:#0F381E;margin:0 0 8px;line-height:1.3;">Congratulations, ' + safeName + '! 🍊🏆</h1>' +
    '<p style="font-size:16px;line-height:1.6;color:#3A4A3F;margin:0 0 20px;font-weight:500;">You are officially a <strong style="color:#F08121;">JuiceTap Champion</strong>.</p>' +

    locationLine +

    '<p style="font-size:15px;line-height:1.65;color:#55665A;margin:0 0 28px;">' +
    'Congratulations on completing the Champion journey! You&rsquo;ve officially discovered what makes JuiceTap fresh, natural, hygienic, and different.' +
    '</p>' +

    '<!-- Certificate Highlight Box -->' +
    '<table role="presentation" width="100%" border="0" cellspacing="0" cellpadding="0" style="background-color:#FFF7EE;border-radius:16px;border:1.5px dashed #F5C69D;margin-bottom:32px;">' +
    '<tr>' +
    '<td style="padding:22px 24px;text-align:center;">' +
    '<div style="font-size:28px;margin-bottom:6px;">🏆</div>' +
    '<div style="font-size:15px;font-weight:800;color:#D46A10;letter-spacing:0.5px;margin-bottom:4px;text-transform:uppercase;">YOUR CHAMPION CERTIFICATE</div>' +
    '<div style="font-size:14px;color:#665445;line-height:1.5;">Your personalized certificate is attached to this email as a PDF.</div>' +
    '</td>' +
    '</tr>' +
    '</table>' +

    '<!-- Personal Note -->' +
    '<p style="font-size:15px;line-height:1.6;color:#3A4A3F;margin:0 0 28px;">' +
    'Keep spreading the goodness! 🍊<br>' +
    '<strong style="color:#0F381E;">— Team JuiceTap</strong>' +
    '</p>' +

    '<!-- CTA Button -->' +
    '<table role="presentation" width="100%" border="0" cellspacing="0" cellpadding="0" style="margin-bottom:12px;">' +
    '<tr>' +
    '<td align="center">' +
    '<a href="https://juicetap.in/meet-champion" target="_blank" style="display:inline-block;background-color:#F08121;color:#ffffff;text-decoration:none;font-size:15px;font-weight:700;padding:15px 32px;border-radius:50px;box-shadow:0 6px 18px rgba(240,129,33,0.3);letter-spacing:0.2px;">Find a JuiceTap Near You &rarr;</a>' +
    '</td>' +
    '</tr>' +
    '</table>' +

    '</td>' +
    '</tr>' +

    '<!-- Footer -->' +
    '<tr>' +
    '<td style="background-color:#0F381E;padding:24px 32px;text-align:center;color:#BCCBC0;font-size:13px;line-height:1.6;border-top:1px solid #164C2A;">' +
    '<div style="font-weight:700;color:#FFFFFF;margin-bottom:4px;letter-spacing:0.5px;">JUICETAP GLOBAL PVT. LTD.</div>' +
    '<div>Support: <a href="mailto:support@juicetap.in" style="color:#FFB775;text-decoration:none;font-weight:600;">support@juicetap.in</a></div>' +
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
    // Logging is best-effort; never block the email on it.
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
