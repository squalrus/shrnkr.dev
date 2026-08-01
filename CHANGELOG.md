# Changelog

User-visible changes, newest first. Follows [Keep a Changelog](https://keepachangelog.com/en/1.1.0/) format and [semver](https://semver.org/) versioning.

## [0.2.0] — 2026-07-31

### Added

- **Full visual redesign.** New "modern SaaS" design system — light theme, Space Grotesk/IBM Plex Sans/JetBrains Mono, sticky blurred header, rounded card surfaces, dark terminal-style output blocks — replacing the warm paper/receipt theme. (`index.html`, `css/styles.css`)
- **Interactive pricing.** A monthly-spend slider recomputes the per-level reduction/fee/keep table and worked example live instead of showing a fixed $4,000/mo example. (`index.html`, `js/main.js`)
- **Named compression levels.** Garlic Press, Panini Press, Vacuum Sealer, Pressure Cooker, and Meat Grinder replace plain "Level N" everywhere a level is shown, alongside its number (e.g. "Vacuum Sealer (lvl 3)"). (`index.html`, `js/main.js`)
- **Two new compression passes.** Redundant Phrase Detection (deletes filler like "to be honest"; shortens phrases like "in order to" → "to") and Symbol Substitution ("move" → "→", "and" → "&", and ~25 more). The "How it works" feature grid grew from four cards to six to cover both, plus JDSL below. (`js/shrink.js`, `index.html`)
- **JDSL ("Just Drop Some Letters").** A level-5-exclusive pass that deletes every 4th character of the final merged string outright — the fix for level 5 and level 4 output previously landing ~96% similar on typical input. (`js/shrink.js`)
- **Test suite.** `node --test tests/shrink.test.js` (correctness assertions against a seeded RNG), `tests/results-copy.test.js` (pins the Results section and testimonial's hand-placed "shrunk" copy to real algorithm output so a future algorithm change can't leave stale marketing copy on the page unnoticed), and `tests/compare-levels.js` (diagnostic level-comparison report). (`tests/`)
- **New favicon and Open Graph image.** Dark rounded favicon with mint converging chevrons; `assets/og-template.html` renders to `assets/images/og-image.png` (1200×630) via headless Chrome screenshot, following badgefor.me's pattern, wired into `index.html`'s meta tags. (`favicon.svg`, `assets/`, `index.html`)

### Changed

- **Results section and the Dana R. testimonial now show real `shrinkText()` output** instead of hand-authored approximations of what the algorithm might produce. (`index.html`)
- **Long single-word compressed output now wraps** inside the demo output box and case-study snippets instead of overflowing its container. (`css/styles.css`)

### Removed

- **Hero headline shrink-in animation** and the **"0ms added latency*" hero stat** (with its footnote) — both read as tacky/unnecessary in the new design. (`index.html`, `js/main.js`, `css/styles.css`)

### Fixed

- **README's pricing table described a dead flat-plan model** (Free/Starter/Growth/Enterprise) that hadn't matched the live site since the 1%-of-savings pricing rework. Rewritten to match. (`README.md`)
- **CLAUDE.md and CONTRIBUTING.md both claimed no deployment pipeline existed**, but a working Azure Static Web Apps GitHub Action has been live since an earlier commit. (`CLAUDE.md`, `CONTRIBUTING.md`)
- **CLAUDE.md's brand-origin claim** ("Shrinker" through level 5 → "shrnkr") no longer holds now that JDSL exists; reworded as historical rather than a live guarantee. (`CLAUDE.md`)

## [0.1.2] — 2026-07-31

### Changed

- **Copy rewritten around token savings as a straightforward win.** Hero, examples, features, and testimonials no longer joke about output quality suffering ("engineer now has questions," "on-call engineer is worried," confused clients) — the pitch is now squarely about removing unneeded words to cut token cost, with the compression gimmick kept as proof rather than a punchline about harming readers. "Four proprietary degradations" renamed to "Four proprietary compression passes"; "Confidence Padding" feature replaced with "Redundant Phrase Detection." (`index.html`, `js/main.js`)
- **Pricing rebuilt as a 1%-of-savings model.** Replaced the flat per-plan pricing table with a scaled fee structure: SHRNKR takes 1% of the token spend it removes, illustrated with a per-level reduction/savings/fee table plus a horizontal bar chart (green = kept savings, red = fee sliver) modeled on a $4,000/mo spend across aggression levels 1–5. (`index.html`, `css/styles.css`)
- **Removed the scrolling ticker strip.** Dropped the top-of-page ticker (markup, animation, and rotating message list) to simplify the page header. (`index.html`, `css/styles.css`, `js/main.js`)

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
