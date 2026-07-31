# Changelog

User-visible changes, newest first. Follows [Keep a Changelog](https://keepachangelog.com/en/1.1.0/) format and [semver](https://semver.org/) versioning.

## [0.1.1] — 2026-07-31

### Changed

- **Rebranded SQUISH to SHRNKR.** New name is a squish joke on itself: running "Shrinker" through the site's own level-5 algorithm (keep each word's first letter, strip the rest of its vowels) produces "shrnkr" — chosen after "SQSH" turned out to collide with existing SquashFS compression tools. Brand name, domain (`squish.dev` → `shrnkr.dev`), and the "squish" verb (now "shrink") updated throughout copy, UI text, and code: `squishText()` → `shrinkText()`, `squishBtn`/`runSquish` → `shrinkBtn`/`runShrink`, `.squishword` → `.shrinkword`, install snippet now `npm install shrnkr` / `import { shrink } from 'shrnkr'`. (`index.html`, `css/styles.css`, `js/main.js`, `robots.txt`, `sitemap.xml`, `README.md`, `CONTRIBUTING.md`, `CLAUDE.md`)
- **Git remote renamed.** `origin` now points at `github.com/squalrus/shrnkr.dev` to match the new name.

## [0.1.0] — 2026-07-31

### Added

- **Initial project structure.** Reorganized the single-file browser export into a proper repo, matching [badgefor.me](https://badgefor.me)'s conventions: `css/styles.css` and `js/main.js` split out of the page, `favicon.svg`, `robots.txt`, `sitemap.xml`, `.gitignore`, `README.md`, `CONTRIBUTING.md`, and `CLAUDE.md`. (repo root)
- **SEO and social meta tags.** Added `<meta name="description">`, canonical link, Open Graph, and Twitter Card tags. (`index.html`)
- **Footer version.** Version number now displayed in the site footer and kept in sync with each release. (`index.html`)

### Changed

- **Google Fonts loaded properly.** Replaced the browser-saved local font stylesheet (`index_files/css2`) with a direct Google Fonts `<link>` for Anton, Archivo Narrow, and Courier Prime. (`index.html`)
- **Internal links fixed.** Nav, CTA, and footer links no longer point at a local `file:///` path from the original export; they use in-page anchors and the real badgefor.me URL. (`index.html`)

### Notes

- Name and copy are expected to change in a later pass — this release is structural only.
