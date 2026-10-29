# Audrae Vincent's website

A responsive, buildless personal portfolio. Public files live in `dist/`.

## Hosting

The primary address is `https://audraevincent.com/`. GitHub Pages publishes `dist/` automatically from `main` using `.github/workflows/deploy-pages.yml`. See [GITHUB-PAGES.md](GITHUB-PAGES.md) for GitHub settings, Namecheap DNS records, and HTTPS verification.

## Preview

Run `node preview.mjs` and open http://127.0.0.1:4173.

## Content

- `dist/index.html`: introduction, project cards, employer names and dates.
- `dist/app.js`: project walkthrough slides, detail notes, GitHub links, filters and navigation.
- `dist/style.css`: responsive styling and print layout.
- `dist/gallery.css`: responsive screenshot gallery and project-dialog styling.
- `dist/assets/projects/`: seven actual project screenshots captured from isolated local previews with browser scrollbars hidden, saved as JPEGs. Most are 1280 × 800; the complete IoT workspace is framed at 1127 × 890.

Project descriptions were checked against the fetched GitHub `origin/main` sources on October 28, 2026. The walkthrough screenshots show Fitness Vault at `c262e9d73b63bac515dc8dda642c5a7ee06c97ae` and ARTHEON at `60cde26fc967f048402f688b7e15d803c045e893`. Existing project working files were not modified. The landing-page project illustrations remain interface studies; the popup galleries contain actual screenshots with sample or fictional development data. Professional responsibilities beyond the supplied role descriptions have not been assumed. The experience overview can be printed or saved as PDF using the browser print dialog.

Project galleries support previous/next controls, thumbnail selection, Home/End and left/right keys, and touch swipes. They do not advance automatically. The native project dialog supports Escape, focus restoration, and a sticky close control. Run `node qa.mjs` with the preview server running to check these interactions.

The website has no build dependencies. Google Fonts are optional; system font fallbacks are provided. Hosting identity lives in `.openai/hosting.json`.
