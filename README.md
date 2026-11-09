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
- `dist/assets/projects/`: ten actual project screenshots captured from isolated local previews with browser scrollbars hidden, saved as JPEGs. Most are 1280 × 800; the complete IoT workspace is framed at 1127 × 890. Fitness Vault has six screens covering the tracker, workout timer, session logging, monthly calendar, exercise targets, and overview.

Fitness Vault descriptions and six screenshots were refreshed on November 8, 2026 against the current local working files, including changes not yet committed to its source repository. They show weekly and monthly training tracking, exercise targets and progress, draft and confirmed logs, the persistent workout timer, and the updated overview. Screenshots were captured from an isolated copy of the React interface with fictional in-memory API fixtures; no live training database or personal records were accessed. The application source implements FastAPI/PostgreSQL persistence, but these screenshots do not verify database operation. ARTHEON descriptions and screenshots remain checked against `origin/main` at `60cde26fc967f048402f688b7e15d803c045e893` on October 28, 2026. The Fitness Vault card now uses an actual development screenshot; the ARTHEON card remains an interface study. Existing project working files were not modified. Professional responsibilities beyond the supplied role descriptions have not been assumed. The experience overview can be printed or saved as PDF using the browser print dialog.

Project galleries support previous/next controls, thumbnail selection, Home/End and left/right keys, and touch swipes. They do not advance automatically. The native project dialog supports Escape, focus restoration, and a sticky close control. Run `node qa.mjs` with the preview server running to check these interactions.

The website has no build dependencies. Google Fonts are optional; system font fallbacks are provided. Hosting identity lives in `.openai/hosting.json`.
