/* ================================================================
   JUICETAP — Champion Certificate
   ----------------------------------------------------------------
   Everything needed to turn a visitor's name into a personalised,
   print-quality JuiceTap Champion certificate — entirely in the
   browser, with zero extra dependencies.

     renderCertificateCanvas()  draws the branded certificate onto a
                                high-resolution <canvas>.
     canvasToJpegBase64()       exports it as a JPEG data string.
     jpegToPdfBlob()            wraps that JPEG in a real, single-page
                                PDF (A4 landscape) by hand — no libs.
     downloadBlob()             hands the finished PDF to the visitor.

   The design deliberately reuses the site's own tokens (orange
   #F08121, forest #0F381E, cream #FFF9F2) and fonts (Outfit / Plus
   Jakarta Sans) so the certificate feels like part of JuiceTap.
   ================================================================ */

import waveMascot from '../../assets/mascot-hero.png';

const LOGO_SRC = '/assets/logo.png';

/* Brand palette (mirrors the CSS design tokens). */
const C = {
  forest: '#0F381E',
  forestLight: '#1A542E',
  orange: '#F08121',
  orangeDark: '#D46A10',
  orangeLight: '#FF9B42',
  cream: '#FFF9F2',
  creamDeep: '#FFF1E2',
  white: '#FFFFFF',
  gold: '#E8A13C',
  text: '#1C2B20',
  textSoft: '#56645A',
  green: '#2E7D32',
};

/* Canvas resolution — A4 landscape ratio (√2) at a crisp ~170dpi. */
export const CERT_W = 2000;
export const CERT_H = 1414;

const BENEFITS = [
  '100% Natural',
  'No Added Sugar',
  'No Preservatives',
  'Hygienic',
  'Fresh Under 60s',
];

function loadImage(src) {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => resolve(img);
    img.onerror = reject;
    img.src = src;
  });
}

/* Cache decoded images so live-preview re-renders (per keystroke) stay cheap. */
const _imgCache = new Map();
function loadImageCached(src) {
  if (!_imgCache.has(src)) _imgCache.set(src, loadImage(src));
  return _imgCache.get(src);
}

async function ensureFonts() {
  if (typeof document === 'undefined' || !document.fonts || !document.fonts.load) return;
  try {
    await Promise.all([
      document.fonts.load('800 120px Outfit'),
      document.fonts.load('700 120px Outfit'),
      document.fonts.load('600 40px "Plus Jakarta Sans"'),
      document.fonts.load('500 40px "Plus Jakarta Sans"'),
    ]);
    if (document.fonts.ready) await document.fonts.ready;
  } catch {
    /* Fallback stacks below keep the certificate readable regardless. */
  }
}

const HEAD = "Outfit, 'Segoe UI', sans-serif";
const BODY = "'Plus Jakarta Sans', 'Segoe UI', sans-serif";

function roundRect(ctx, x, y, w, h, r) {
  const rr = Math.min(r, w / 2, h / 2);
  ctx.beginPath();
  ctx.moveTo(x + rr, y);
  ctx.arcTo(x + w, y, x + w, y + h, rr);
  ctx.arcTo(x + w, y + h, x, y + h, rr);
  ctx.arcTo(x, y + h, x, y, rr);
  ctx.arcTo(x, y, x + w, y, rr);
  ctx.closePath();
}

/* A small stylised orange slice used as a corner flourish. */
function orangeSlice(ctx, cx, cy, r) {
  ctx.save();
  ctx.translate(cx, cy);
  ctx.beginPath();
  ctx.arc(0, 0, r, 0, Math.PI * 2);
  ctx.fillStyle = C.orange;
  ctx.fill();
  ctx.beginPath();
  ctx.arc(0, 0, r * 0.82, 0, Math.PI * 2);
  ctx.fillStyle = '#FFB861';
  ctx.fill();
  ctx.beginPath();
  ctx.arc(0, 0, r * 0.72, 0, Math.PI * 2);
  ctx.fillStyle = '#FFE0B8';
  ctx.fill();
  for (let i = 0; i < 8; i++) {
    ctx.save();
    ctx.rotate((Math.PI * 2 * i) / 8);
    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.lineTo(r * 0.62, -r * 0.14);
    ctx.lineTo(r * 0.62, r * 0.14);
    ctx.closePath();
    ctx.fillStyle = '#FFC978';
    ctx.fill();
    ctx.restore();
  }
  ctx.beginPath();
  ctx.arc(0, 0, r * 0.1, 0, Math.PI * 2);
  ctx.fillStyle = '#FFE7C4';
  ctx.fill();
  ctx.restore();
}

/* The circular "Champion Seal" stamp. */
function drawSeal(ctx, cx, cy, r) {
  ctx.save();
  // Ribbon tails
  ctx.fillStyle = C.orangeDark;
  ctx.beginPath();
  ctx.moveTo(cx - r * 0.5, cy + r * 0.55);
  ctx.lineTo(cx - r * 0.18, cy + r * 0.9);
  ctx.lineTo(cx - r * 0.05, cy + r * 1.5);
  ctx.lineTo(cx - r * 0.42, cy + r * 1.15);
  ctx.closePath();
  ctx.fill();
  ctx.beginPath();
  ctx.moveTo(cx + r * 0.5, cy + r * 0.55);
  ctx.lineTo(cx + r * 0.18, cy + r * 0.9);
  ctx.lineTo(cx + r * 0.05, cy + r * 1.5);
  ctx.lineTo(cx + r * 0.42, cy + r * 1.15);
  ctx.closePath();
  ctx.fill();

  // Scalloped outer edge
  ctx.beginPath();
  const teeth = 28;
  for (let i = 0; i <= teeth; i++) {
    const a = (Math.PI * 2 * i) / teeth;
    const rad = r * (i % 2 === 0 ? 1 : 0.94);
    const px = cx + Math.cos(a) * rad;
    const py = cy + Math.sin(a) * rad;
    if (i === 0) ctx.moveTo(px, py);
    else ctx.lineTo(px, py);
  }
  ctx.closePath();
  const g = ctx.createLinearGradient(cx - r, cy - r, cx + r, cy + r);
  g.addColorStop(0, C.orangeLight);
  g.addColorStop(1, C.orangeDark);
  ctx.fillStyle = g;
  ctx.fill();

  ctx.beginPath();
  ctx.arc(cx, cy, r * 0.82, 0, Math.PI * 2);
  ctx.fillStyle = C.white;
  ctx.fill();
  ctx.beginPath();
  ctx.arc(cx, cy, r * 0.82, 0, Math.PI * 2);
  ctx.lineWidth = 3;
  ctx.strokeStyle = C.orange;
  ctx.stroke();
  // Inner dotted ring
  ctx.beginPath();
  ctx.setLineDash([2, 7]);
  ctx.arc(cx, cy, r * 0.72, 0, Math.PI * 2);
  ctx.lineWidth = 2;
  ctx.strokeStyle = 'rgba(240,129,33,0.6)';
  ctx.stroke();
  ctx.setLineDash([]);

  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';

  // Top wordmark
  ctx.fillStyle = C.orange;
  ctx.font = `700 ${r * 0.13}px ${HEAD}`;
  ctx.fillText('JUICETAP', cx, cy - r * 0.45);

  // Center check
  ctx.strokeStyle = C.orange;
  ctx.lineWidth = r * 0.12;
  ctx.lineCap = 'round';
  ctx.lineJoin = 'round';
  ctx.beginPath();
  ctx.moveTo(cx - r * 0.26, cy - r * 0.02);
  ctx.lineTo(cx - r * 0.06, cy + r * 0.2);
  ctx.lineTo(cx + r * 0.3, cy - r * 0.26);
  ctx.stroke();

  // Bottom label
  ctx.fillStyle = C.forest;
  ctx.font = `800 ${r * 0.19}px ${HEAD}`;
  ctx.fillText('CHAMPION', cx, cy + r * 0.5);
  ctx.restore();
}

function fmtDate(d) {
  return d.toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' });
}

/**
 * Draw the personalised certificate onto a fresh high-res canvas.
 * @returns {Promise<HTMLCanvasElement>}
 */
export async function renderCertificateCanvas({ name, city }) {
  await ensureFonts();

  const canvas = document.createElement('canvas');
  canvas.width = CERT_W;
  canvas.height = CERT_H;
  const ctx = canvas.getContext('2d');

  const cx = CERT_W / 2;

  // Background
  ctx.fillStyle = C.cream;
  ctx.fillRect(0, 0, CERT_W, CERT_H);
  const glow = ctx.createRadialGradient(cx, 260, 80, cx, 480, 1200);
  glow.addColorStop(0, 'rgba(240,129,33,0.12)');
  glow.addColorStop(1, 'rgba(255,249,242,0)');
  ctx.fillStyle = glow;
  ctx.fillRect(0, 0, CERT_W, CERT_H);

  // Faint corner slices
  ctx.globalAlpha = 0.10;
  orangeSlice(ctx, 40, 40, 200);
  orangeSlice(ctx, CERT_W - 40, CERT_H - 40, 220);
  ctx.globalAlpha = 1;

  // Double frame
  const m = 60;
  const frameGrad = ctx.createLinearGradient(m, m, CERT_W - m, CERT_H - m);
  frameGrad.addColorStop(0, C.orangeLight);
  frameGrad.addColorStop(0.5, C.orange);
  frameGrad.addColorStop(1, C.orangeDark);
  ctx.lineWidth = 16;
  ctx.strokeStyle = frameGrad;
  roundRect(ctx, m, m, CERT_W - m * 2, CERT_H - m * 2, 40);
  ctx.stroke();

  ctx.lineWidth = 3;
  ctx.strokeStyle = 'rgba(15,56,30,0.45)';
  roundRect(ctx, m + 26, m + 26, CERT_W - (m + 26) * 2, CERT_H - (m + 26) * 2, 26);
  ctx.stroke();

  // Corner slice accents — the bottom-left corner is intentionally left to
  // Champion (who anchors that corner), so its accent is grounded beside the
  // mascot below instead of colliding with it.
  orangeSlice(ctx, m + 74, m + 74, 34);
  orangeSlice(ctx, CERT_W - m - 74, m + 74, 34);
  orangeSlice(ctx, CERT_W - m - 74, CERT_H - m - 74, 34);

  // Logo
  try {
    const logo = await loadImageCached(LOGO_SRC);
    const lw = 360;
    const lh = (logo.height / logo.width) * lw;
    ctx.drawImage(logo, cx - lw / 2, 150, lw, lh);
  } catch {
    ctx.fillStyle = C.forest;
    ctx.font = `800 74px ${HEAD}`;
    ctx.textAlign = 'center';
    ctx.fillText('JuiceTap', cx, 210);
  }

  ctx.textAlign = 'center';

  // Kicker
  ctx.fillStyle = C.orange;
  ctx.font = `700 30px ${HEAD}`;
  ctx.save();
  ctx.letterSpacing = '8px';
  ctx.fillText('• OFFICIAL CERTIFICATE •', cx, 320);
  ctx.restore();

  // Title
  ctx.fillStyle = C.forest;
  ctx.font = `800 96px ${HEAD}`;
  ctx.fillText('Certificate of Championship', cx, 415);

  // Presented-to line
  ctx.fillStyle = C.textSoft;
  ctx.font = `500 34px ${BODY}`;
  ctx.fillText('This certificate is proudly presented to', cx, 500);

  // Name
  const name_ = (name || 'Champion').trim();
  ctx.fillStyle = C.orangeDark;
  let nameSize = 132;
  ctx.font = `700 ${nameSize}px ${HEAD}`;
  while (ctx.measureText(name_).width > CERT_W - 520 && nameSize > 52) {
    nameSize -= 4;
    ctx.font = `700 ${nameSize}px ${HEAD}`;
  }
  ctx.fillText(name_, cx, 640);

  // Underline flourish
  const uw = Math.min(ctx.measureText(name_).width + 120, CERT_W - 440);
  const ug = ctx.createLinearGradient(cx - uw / 2, 0, cx + uw / 2, 0);
  ug.addColorStop(0, 'rgba(240,129,33,0)');
  ug.addColorStop(0.5, C.orange);
  ug.addColorStop(1, 'rgba(240,129,33,0)');
  ctx.fillStyle = ug;
  ctx.fillRect(cx - uw / 2, 672, uw, 5);

  // Citation
  ctx.fillStyle = C.text;
  ctx.font = `500 36px ${BODY}`;
  ctx.fillText('for completing the Champion journey and becoming a', cx, 742);
  ctx.fillStyle = C.forest;
  ctx.font = `700 46px ${HEAD}`;
  ctx.fillText('JuiceTap Champion 🍊', cx, 800);

  if (city && city.trim()) {
    ctx.fillStyle = C.textSoft;
    ctx.font = `500 30px ${BODY}`;
    ctx.fillText(city.trim(), cx, 852);
  }

  // Benefits pill row
  const pillY = 910;
  ctx.font = `600 28px ${BODY}`;
  const gap = 26;
  const padX = 34;
  const widths = BENEFITS.map((b) => ctx.measureText(b).width + padX * 2 + 40);
  const totalW = widths.reduce((a, b) => a + b, 0) + gap * (BENEFITS.length - 1);
  let bx = cx - totalW / 2;
  BENEFITS.forEach((b, i) => {
    const w = widths[i];
    roundRect(ctx, bx, pillY, w, 60, 30);
    ctx.fillStyle = C.creamDeep;
    ctx.fill();
    ctx.lineWidth = 2;
    ctx.strokeStyle = 'rgba(240,129,33,0.4)';
    ctx.stroke();
    // check
    ctx.strokeStyle = C.orange;
    ctx.lineWidth = 5;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.beginPath();
    ctx.moveTo(bx + 24, pillY + 30);
    ctx.lineTo(bx + 34, pillY + 40);
    ctx.lineTo(bx + 52, pillY + 20);
    ctx.stroke();
    ctx.fillStyle = C.forest;
    ctx.textAlign = 'left';
    ctx.textBaseline = 'middle';
    ctx.fillText(b, bx + 66, pillY + 31);
    ctx.textAlign = 'center';
    ctx.textBaseline = 'alphabetic';
    bx += w + gap;
  });

  // Champion mascot — a supporting element, not the focus (kept fully inside)
  try {
    const mascot = await loadImageCached(waveMascot);
    const mh = 300; // ~30% smaller than before; aspect ratio preserved
    const mw = (mascot.width / mascot.height) * mh;
    const mx = m + 40;
    const my = CERT_H - m - mh - 26;
    ctx.drawImage(mascot, mx, my, mw, mh);
    // Grounded orange-slice accent beside Champion: aligned to the mascot's
    // baseline with a consistent gap, never overlapping its body.
    const groundY = my + mh - 30;
    orangeSlice(ctx, mx + mw + 30, groundY, 24);
  } catch {
    /* mascot optional */
  }

  // Seal — reduced ~35% so it supports, never competes with, the name
  drawSeal(ctx, CERT_W - m - 178, CERT_H - m - 198, 84);

  // Footer: date + signature
  const footY = CERT_H - 200;
  ctx.textAlign = 'center';
  ctx.fillStyle = C.forest;
  ctx.font = `700 34px ${HEAD}`;
  ctx.fillText('JuiceTap', cx, footY);
  ctx.strokeStyle = 'rgba(15,56,30,0.35)';
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(cx - 190, footY + 28);
  ctx.lineTo(cx + 190, footY + 28);
  ctx.stroke();
  ctx.fillStyle = C.textSoft;
  ctx.font = `500 26px ${BODY}`;
  ctx.fillText('JUICETAP GLOBAL PVT. LTD.', cx, footY + 62);

  ctx.fillStyle = C.textSoft;
  ctx.font = `500 26px ${BODY}`;
  ctx.fillText(`Awarded on ${fmtDate(new Date())}`, cx, footY + 108);

  return canvas;
}

export function canvasToJpegBase64(canvas, quality = 0.94) {
  return canvas.toDataURL('image/jpeg', quality).split(',')[1];
}

/**
 * Render the certificate to a JPEG data URL — used for the live, in-page
 * preview (images are cached, so re-rendering on each keystroke is cheap).
 * @returns {Promise<string>}
 */
export async function renderCertificateDataUrl({ name, city }, quality = 0.82) {
  const canvas = await renderCertificateCanvas({ name, city });
  return canvas.toDataURL('image/jpeg', quality);
}

/* ---------- Hand-rolled JPEG → PDF (single page, no dependencies) ---------- */

function strBytes(str) {
  const a = new Uint8Array(str.length);
  for (let i = 0; i < str.length; i++) a[i] = str.charCodeAt(i) & 0xff;
  return a;
}

function base64Bytes(b64) {
  const bin = atob(b64);
  const a = new Uint8Array(bin.length);
  for (let i = 0; i < bin.length; i++) a[i] = bin.charCodeAt(i);
  return a;
}

/**
 * Wrap a JPEG (base64, no data-url prefix) in a valid single-page PDF.
 * Page defaults to A4 landscape (842×595 pt); the image fills the page.
 * @returns {Blob}
 */
export function jpegToPdfBlob(jpegBase64, imgW, imgH, pageW = 842, pageH = 595) {
  const jpeg = base64Bytes(jpegBase64);
  const chunks = [];
  const offsets = [];
  let pos = 0;
  const push = (part) => {
    const bytes = typeof part === 'string' ? strBytes(part) : part;
    chunks.push(bytes);
    pos += bytes.length;
  };
  const startObj = (n) => {
    offsets[n] = pos;
  };

  push('%PDF-1.3\n%\xE2\xE3\xCF\xD3\n');

  startObj(1);
  push('1 0 obj\n<< /Type /Catalog /Pages 2 0 R >>\nendobj\n');

  startObj(2);
  push('2 0 obj\n<< /Type /Pages /Kids [3 0 R] /Count 1 >>\nendobj\n');

  startObj(3);
  push(
    `3 0 obj\n<< /Type /Page /Parent 2 0 R /MediaBox [0 0 ${pageW} ${pageH}] ` +
      `/Resources << /XObject << /Im0 4 0 R >> >> /Contents 5 0 R >>\nendobj\n`
  );

  startObj(4);
  push(
    `4 0 obj\n<< /Type /XObject /Subtype /Image /Width ${imgW} /Height ${imgH} ` +
      `/ColorSpace /DeviceRGB /BitsPerComponent 8 /Filter /DCTDecode /Length ${jpeg.length} >>\nstream\n`
  );
  push(jpeg);
  push('\nendstream\nendobj\n');

  const content = `q\n${pageW} 0 0 ${pageH} 0 0 cm\n/Im0 Do\nQ\n`;
  startObj(5);
  push(`5 0 obj\n<< /Length ${content.length} >>\nstream\n${content}endstream\nendobj\n`);

  const xrefStart = pos;
  let xref = 'xref\n0 6\n0000000000 65535 f \n';
  for (let i = 1; i <= 5; i++) {
    xref += String(offsets[i]).padStart(10, '0') + ' 00000 n \n';
  }
  push(xref);
  push(`trailer\n<< /Size 6 /Root 1 0 R >>\nstartxref\n${xrefStart}\n%%EOF\n`);

  let total = 0;
  chunks.forEach((c) => (total += c.length));
  const out = new Uint8Array(total);
  let o = 0;
  chunks.forEach((c) => {
    out.set(c, o);
    o += c.length;
  });
  return new Blob([out], { type: 'application/pdf' });
}

export function slugifyName(name) {
  return (name || 'champion')
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 40) || 'champion';
}

/** Build the finished certificate PDF from the visitor's details. */
export async function buildCertificatePdf({ name, city }) {
  const canvas = await renderCertificateCanvas({ name, city });
  const jpeg = canvasToJpegBase64(canvas);
  const blob = jpegToPdfBlob(jpeg, CERT_W, CERT_H);
  return { canvas, blob, jpegBase64: jpeg };
}

export function downloadBlob(blob, filename) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  setTimeout(() => URL.revokeObjectURL(url), 4000);
}
