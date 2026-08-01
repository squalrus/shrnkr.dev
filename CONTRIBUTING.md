# Contributing to SHRNKR

## Running locally

Open `index.html` directly in a browser. No server, no build step, no package manager required.

## Project structure

```text
shrnkr.dev/
├── index.html              # All content lives here
├── css/styles.css          # Styling via CSS custom properties
├── js/
│   ├── shrink.js           # shrinkText() — DOM-free, requireable from Node for tests
│   └── main.js             # Demo wiring, pricing slider, aggression slider label
├── tests/                  # node --test suite + diagnostic scripts (see CLAUDE.md)
├── assets/
│   ├── images/og-image.png # Open Graph image (1200×630)
│   └── og-template.html    # Source HTML for regenerating og-image.png
├── favicon.svg
├── robots.txt              # Crawler rules + sitemap pointer
├── sitemap.xml             # Sitemap for search engines
└── CHANGELOG.md            # Source of truth for version number
```

## Design system

- **Theme:** light modern SaaS — `--bg: #FAFAF8` background, `--surface: #FFFFFF` cards; `--ink: #14161A` / `--ink-soft: #5A5F68` / `--ink-faint: #9AA0A6` text; `--border: #E6E4DF` hairlines
- **Accent:** `--green: #0E9A73` (primary CTA, links, savings) with `--green-dark: #0B7D5E` hover and `--green-tint: #E9F6F0` fills; `--rust: #D2543F` (fee portion of pricing bars); `--dark: #14161A` / `--dark-2: #0C0E11` (terminal/output surfaces) with `--mint: #7FE3BC` output text and `--amber: #E3B77F` code accents
- **Type:** `Space Grotesk` for display headings; `IBM Plex Sans` for body copy and buttons; `JetBrains Mono` (`.mono`) for labels, nav eyebrows, stats, and code blocks
- **Motifs:** sticky blurred header; rounded (`12–24px`) card surfaces with soft shadows; dark terminal-style output/code blocks with mint text; numbered feature cards

**Brand voice:** deadpan corporate-speak parody, in the same vein as [badgefor.me](https://badgefor.me). Don't over-explain jokes. Let the copy breathe.

## Deployment

Pushes to `main` auto-deploy to Azure Static Web Apps via GitHub Actions (`.github/workflows/azure-static-web-apps-agreeable-cliff-03e64ea1e.yml`), mirroring badgefor.me's pattern. PRs get preview environments; closing a PR tears the preview down.

Version is derived from `CHANGELOG.md` — the latest `## [X.Y.Z]` heading is the current version.

## Regenerating the OG image

Edit `assets/og-template.html`, then re-run the headless screenshot:

```shell
"C:\Program Files\Google\Chrome\Application\chrome.exe" --headless=new --screenshot="assets/images/og-image.png" --window-size=1200,630 --hide-scrollbars assets/og-template.html
```
