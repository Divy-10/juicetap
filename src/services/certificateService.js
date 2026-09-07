/* ================================================================
   JUICETAP — Certificate Email Service
   ----------------------------------------------------------------
   Communicates with Google Apps Script Web App backend to deliver
   Meet Champion certificates via email.
   Secrets are strictly kept on Apps Script backend.
   ================================================================ */

const API_URL = import.meta.env.VITE_CERTIFICATE_API_URL || '';

/**
 * Check if the Certificate API URL environment variable is set.
 * @returns {boolean}
 */
export function isEmailConfigured() {
  return Boolean(API_URL && API_URL.trim().length > 0);
}

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/**
 * Send certificate by email via Google Apps Script Web App endpoint.
 *
 * @param {Object} params
 * @param {string} params.email - Recipient email address
 * @param {string} params.name - Recipient name
 * @param {string} [params.city] - Recipient city (optional)
 * @param {string} params.certificatePdfBase64 - Raw Base64 string of the PDF
 * @param {string} [params.fileName] - Name of the attachment file
 * @returns {Promise<{ success: boolean, message: string, error?: string }>}
 */
export async function sendCertificateByEmail({
  email,
  name,
  city = '',
  certificatePdfBase64,
  fileName = 'Meet-Champion-Certificate.pdf',
}) {
  console.log('[Certificate] sendCertificateByEmail initiated');

  if (!isEmailConfigured()) {
    console.warn('[Certificate] API URL is not configured in VITE_CERTIFICATE_API_URL');
    return {
      success: false,
      message: 'Certificate Email Service is not configured',
      error: 'VITE_CERTIFICATE_API_URL environment variable is missing',
    };
  }

  // Frontend validations
  const trimmedEmail = (email || '').trim();
  const trimmedName = (name || '').trim();

  if (!trimmedEmail) {
    return {
      success: false,
      message: 'Validation failed',
      error: 'Email address is required',
    };
  }

  if (!EMAIL_REGEX.test(trimmedEmail)) {
    return {
      success: false,
      message: 'Validation failed',
      error: 'Invalid email address format',
    };
  }

  if (!trimmedName) {
    return {
      success: false,
      message: 'Validation failed',
      error: 'Recipient name is required',
    };
  }

  if (!certificatePdfBase64) {
    return {
      success: false,
      message: 'Validation failed',
      error: 'Certificate PDF data is missing',
    };
  }

  // Ensure Base64 string has no Data URL prefix
  let pdfBase64Data = String(certificatePdfBase64).trim();
  if (pdfBase64Data.includes(',')) {
    pdfBase64Data = pdfBase64Data.split(',')[1];
  }

  // Ensure fileName ends with .pdf
  let pdfFileName = String(fileName || 'Meet-Champion-Certificate.pdf').trim();
  if (!pdfFileName.toLowerCase().endsWith('.pdf')) {
    pdfFileName += '.pdf';
  }

  const payload = {
    action: 'sendCertificate',
    email: trimmedEmail,
    name: trimmedName,
    city: city.trim(),
    fileName: pdfFileName,
    pdfBase64: pdfBase64Data,
  };

  try {
    console.log('[Certificate] Sending email payload to Apps Script endpoint...');

    // Use text/plain header to avoid CORS preflight options request on Google Apps Script
    const response = await fetch(API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'text/plain;charset=utf-8',
      },
      body: JSON.stringify(payload),
      redirect: 'follow',
    });

    console.log('[Certificate] HTTP Response status:', response.status, response.statusText);

    let result = null;
    const responseText = await response.text();

    try {
      result = JSON.parse(responseText);
    } catch (jsonErr) {
      console.warn('[Certificate] Could not parse JSON directly from response text:', jsonErr);
    }

    console.log('[Certificate] Parsed API Response:', result);

    if (result && typeof result === 'object' && result.success === true) {
      console.log('[Certificate] Email sent successfully');
      return {
        success: true,
        message: result.message || 'Certificate email sent successfully',
      };
    }

    const failureReason =
      (result && result.error) ||
      (result && result.message) ||
      `HTTP Error ${response.status}: ${response.statusText}`;

    console.error('[Certificate] API returned error response:', failureReason);
    return {
      success: false,
      message: 'Failed to send certificate email',
      error: failureReason,
    };
  } catch (err) {
    const errorMsg = err && err.message ? err.message : 'Network error';
    console.error('[Certificate] Fetch exception encountered:', err);
    return {
      success: false,
      message: 'Failed to communicate with certificate email service',
      error: errorMsg,
    };
  }
}

/**
 * Legacy wrapper function to maintain backwards compatibility if referenced elsewhere.
 */
export async function sendCertificateEmail(params) {
  const res = await sendCertificateByEmail({
    email: params.email,
    name: params.name,
    city: params.city,
    certificatePdfBase64: params.pdfBase64 || params.certificatePdfBase64,
    fileName: params.filename || params.fileName,
  });

  return {
    delivered: res.success === true,
    error: res.error || res.message,
  };
}
