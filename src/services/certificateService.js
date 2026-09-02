/* ================================================================
   JUICETAP — Certificate Email Service
   ----------------------------------------------------------------
   Sends the generated certificate to the visitor's email through a
   Google Apps Script Web App (the same server-side style already used
   for Locations). All secrets live inside the Apps Script — nothing
   sensitive is ever exposed to the browser.

   Configure the endpoint in your .env:
       VITE_CERTIFICATE_API_URL=https://script.google.com/macros/s/XXXX/exec

   Honest delivery reporting: we only report `delivered: true` when the
   Apps Script's JSON response confirms `success`. The request is sent as
   a "simple" text/plain POST (no CORS pre-flight); Apps Script responses
   include an Access-Control-Allow-Origin header, so the JSON result can
   be read back. If the response can't be read or doesn't confirm success,
   we report `delivered: false` (never a false success) and the UI falls
   back to the guaranteed client-side download.
   ================================================================ */

const ENDPOINT = (import.meta.env && import.meta.env.VITE_CERTIFICATE_API_URL) || '';

export function isEmailConfigured() {
  return Boolean(ENDPOINT);
}

/**
 * Ask the Apps Script to email the certificate.
 * @returns {Promise<{ delivered: boolean, skipped?: boolean, error?: string }>}
 */
export async function sendCertificateEmail({ name, email, city, pdfBase64 }) {
  if (!ENDPOINT) return { delivered: false, skipped: true };

  const payload = JSON.stringify({
    type: 'champion_certificate',
    name,
    email,
    city: city || '',
    filename: 'JuiceTap-Champion-Certificate.pdf',
    pdfBase64,
  });

  try {
    const res = await fetch(ENDPOINT, {
      method: 'POST',
      headers: { 'Content-Type': 'text/plain;charset=utf-8' },
      body: payload,
      redirect: 'follow',
    });

    // Read the backend's confirmation. Apps Script returns JSON.
    let data = null;
    try {
      data = await res.json();
    } catch {
      const text = await res.text().catch(() => '');
      try {
        data = JSON.parse(text);
      } catch {
        data = null;
      }
    }

    if (data && data.success === true) return { delivered: true };
    return { delivered: false, error: (data && data.error) || 'Delivery not confirmed' };
  } catch (err) {
    return { delivered: false, error: err && err.message ? err.message : 'Network error' };
  }
}
