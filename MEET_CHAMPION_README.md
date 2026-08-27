# Meet Champion — implementation notes

A new page (`/meet-champion`) where the existing JuiceTap mascot, **Champion**,
guides visitors through the benefits and awards a personalised, downloadable +
emailable **JuiceTap Champion certificate**. Built to match the existing design
system (tokens, fonts, motion primitives, Citrus visuals) — no existing page,
route, navbar, footer, colour or component was redesigned.

## What was added

**New files**
- `src/pages/MeetChampion/MeetChampion.jsx` — the page: hero, interactive
  benefits narrator, Champion's Promise, certificate form + success state.
- `src/pages/MeetChampion/certificate.js` — draws the branded certificate on a
  high-res canvas and wraps it in a **real PDF** (zero dependencies — a
  hand-rolled JPEG-in-PDF writer).
- `src/services/certificateService.js` — best-effort POST of the certificate to
  the email endpoint (no keys in the frontend).
- `google_apps_script_certificate.js` — the server-side `doPost` that emails the
  PDF (paste into your Apps Script; see below).

**Edited (surgically)**
- `src/App.jsx` — added the `/meet-champion` route.
- `src/pages/Home/Home.jsx` — added a "Meet Champion 🍊" link in the hero action
  area (near the mascot). Nothing else on Home changed.
- `src/styles/main.css` — appended a `.jt-page--champion` scoped block (plus the
  single `.hero__meet-champion` entry-link rule). Existing CSS untouched.
- `.env` — added `VITE_CERTIFICATE_API_URL` (blank by default).

## Certificate delivery

1. On submit the form validates name + email + consent, shows a loading state,
   and disables the button (duplicate-submit guarded).
2. The certificate is rendered client-side and **downloaded instantly** as a
   high-quality A4-landscape PDF — this always works, no backend needed.
3. If `VITE_CERTIFICATE_API_URL` is set, the same PDF is also POSTed to your
   Google Apps Script, which emails it as an attachment.
4. Success screen shows Champion celebrating, the success message, a live
   preview of the certificate, and a **Download Certificate** button.

**Email is optional.** Leave `VITE_CERTIFICATE_API_URL` blank and everything
still works (generate + download); the copy adapts automatically.

## Enabling email (5 minutes)

1. Open your existing **JuiceTap Locations** Google Sheet → *Extensions → Apps
   Script*.
2. Paste the contents of `google_apps_script_certificate.js` into `Code.gs`
   **below your existing `doGet`** (keep `doGet` as-is).
3. *Deploy → Manage deployments → (your Web app) → Edit → Version: New version →
   Deploy.* This keeps the same `/exec` URL. Execute as **Me**, access
   **Anyone**.
4. Put that `/exec` URL in `.env`:
   ```
   VITE_CERTIFICATE_API_URL=https://script.google.com/macros/s/XXXX/exec
   ```
5. `npm run build` (or restart `npm run dev`) so Vite picks up the new env var.

No SMTP credentials or API keys are ever exposed to the browser — Apps Script
runs server-side under your Google account.

## Testing checklist

- `npm run dev` → open `http://localhost:3005/meet-champion`.
- Hero: Champion floats in, waves, speech bubble appears; "Meet the Benefits →"
  smooth-scrolls to the benefits.
- Benefits: auto-advances through all five; tabs / dots / arrows work; Champion
  changes pose and speech per benefit.
- Promise: five ticks around Champion; "Become a Champion →" scrolls to the form.
- Certificate: try empty/invalid name + email (validation), then a valid one →
  PDF downloads, success animation shows, preview renders, re-download works.
- Resize to phone/tablet: no horizontal scroll, mascot fully visible (no clipped
  hands/feet/head), speech bubbles fit the viewport.
- Console: no errors; the Home page and all other routes are unchanged.
