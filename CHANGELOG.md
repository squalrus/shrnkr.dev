# Changelog

User-visible changes, newest first. Follows [Keep a Changelog](https://keepachangelog.com/en/1.1.0/) format and [semver](https://semver.org/) versioning.

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
