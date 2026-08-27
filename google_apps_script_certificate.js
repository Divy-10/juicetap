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

    var subject = 'Your JuiceTap Champion Certificate 🍊';
    var htmlBody = _certificateEmailHtml(name, city);

    MailApp.sendEmail({
      to: email,
      subject: subject,
      htmlBody: htmlBody,
      name: 'JuiceTap',
      attachments: [blob],
    });

    _logCertificate(name, email, city);

    return _json({ success: true });
  } catch (err) {
    return _json({ success: false, error: String(err) });
  }
}

function _certificateEmailHtml(name, city) {
  var safeName = _escape(name);
  var line = city ? (_escape(city) + ' &middot; ') : '';
  return (
    '<div style="font-family:Arial,Helvetica,sans-serif;max-width:560px;margin:0 auto;' +
    'background:#FFF9F2;border-radius:16px;overflow:hidden;border:1px solid #F0E4D6">' +
      '<div style="background:linear-gradient(135deg,#FF9B42,#D46A10);padding:28px 24px;text-align:center">' +
        '<div style="font-size:26px;font-weight:800;color:#ffffff;letter-spacing:-0.5px">JuiceTap</div>' +
        '<div style="font-size:13px;color:#FFE9D3;margin-top:4px;letter-spacing:1px">FRESH JUICE. ONE TAP AWAY.</div>' +
      '</div>' +
      '<div style="padding:30px 26px;color:#1C2B20">' +
        '<h1 style="font-size:22px;color:#0F381E;margin:0 0 10px">Congratulations, Champion! 🍊</h1>' +
        '<p style="font-size:15px;line-height:1.6;margin:0 0 14px">Hi ' + safeName + ',</p>' +
        '<p style="font-size:15px;line-height:1.6;margin:0 0 14px">' +
          'You’re officially a <strong>JuiceTap Champion</strong>. Your personalised ' +
          'certificate is attached to this email as a PDF — print it, share it, or keep it as ' +
          'a badge of fresh, natural goodness.' +
        '</p>' +
        '<p style="font-size:15px;line-height:1.6;margin:0 0 20px">' + line +
          'Thanks for meeting Champion and discovering why JuiceTap is different: 100% natural, ' +
          'no added sugar, no preservatives, hygienic, and fresh in under 60 seconds.' +
        '</p>' +
        '<a href="https://juicetap.in/meet-champion" ' +
          'style="display:inline-block;background:#F08121;color:#fff;text-decoration:none;' +
          'font-weight:700;padding:12px 22px;border-radius:999px;font-size:14px">Find a JuiceTap near you →</a>' +
      '</div>' +
      '<div style="padding:16px 24px;background:#0F381E;color:#C9D6CD;font-size:12px;text-align:center">' +
        'JUICETAP GLOBAL PVT. LTD. &middot; support@juicetap.in' +
      '</div>' +
    '</div>'
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
