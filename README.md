# GELD Webinar Landing Page (`lp.geldwealth.com`)

Standalone Next.js landing page focused on the GELD weekly webinar. Same dark / gold theme as geldwealth.com.

## Run locally

```bash
cd LP-GELD-WEBSITE
npm install
npm run dev
```

Open [http://localhost:3003](http://localhost:3003).

## Deploy for subdomain

1. Deploy this folder as its own Hostinger/Node site (or static export if you prefer).
2. Point DNS: `lp` CNAME (or A record) → your hosting for this app.
3. Ensure assets exist in `public/`:
   - `webinar_poster.jpg`
   - `new_geld_g_logo.png`
   - `new_geld_eld_logo.png`
   - `favicon.ico`

Copy them from the main site if missing:

```powershell
Copy-Item ..\GELD-website\public\webinar_poster.jpg,..\GELD-website\public\new_geld_g_logo.png,..\GELD-website\public\new_geld_eld_logo.png,..\GELD-website\public\favicon.ico -Destination .\public\ -Force
```

## CTA

Register button opens the Zoom registration URL used on the main site webinar section.
