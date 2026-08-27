/* ================================================================
   JUICETAP — Certificate Email Service
   ----------------------------------------------------------------
   Sends the generated certificate to the visitor's email through a
   Google Apps Script Web App (the same server-side style already used
   for Locations). All secrets live inside the Apps Script — nothing
   sensitive is ever exposed to the browser.

   Configure the endpoint in your .env:
       VITE_CERTIFICATE_API_URL=https://script.google.com/macros/s/XXXX/exec

   If it is not set, certificate generation + download still work; the
   email step is simply skipped (see isEmailConfigured()).

   The request is sent as a "simple" text/plain POST so the browser
   does not fire a CORS pre-flight (Apps Script cannot answer one).
   The Apps Script does the real work: decode the PDF, email it as an
   attachment. Because Apps Script responses are not CORS-readable, we
   treat the send as best-effort and let the guaranteed client-side
   download be the visitor's certified copy.
   ================================================================ */

const ENDPOINT =
  (import.meta.env && import.meta.env.VITE_CERTIFICATE_API_URL) || '';

export function isEmailConfigured() {
  return Boolean(ENDPOINT);
}

/**
 * Ask the Apps Script to email the certificate.
 * @returns {Promise<{ ok: boolean, skipped?: boolean, error?: string }>}
 */
export async function sendCertificateEmail({ name, email, city, pdfBase64 }) {
  if (!ENDPOINT) return { ok: false, skipped: true };

  const payload = JSON.stringify({
    type: 'champion_certificate',
    name,
    email,
    city: city || '',
    filename: 'JuiceTap-Champion-Certificate.pdf',
    pdfBase64,
  });

  try {
    await fetch(ENDPOINT, {
      method: 'POST',
      mode: 'no-cors',
      headers: { 'Content-Type': 'text/plain;charset=utf-8' },
      body: payload,
    });
    // no-cors responses are opaque; a resolved fetch means the request left.
    return { ok: true };
  } catch (err) {
    return { ok: false, error: err && err.message ? err.message : 'Network error' };
  }
}
