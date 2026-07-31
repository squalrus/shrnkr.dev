# Contributing to SHRNKR

## Running locally

Open `index.html` directly in a browser. No server, no build step, no package manager required.

## Project structure

```text
shrnkr.dev/
├── index.html          # All content lives here
├── css/styles.css      # Styling via CSS custom properties; receipt/telegram theme
├── js/main.js          # Ticker, hero shrink animation, aggression slider, live shrinker demo
├── favicon.svg
├── robots.txt          # Crawler rules + sitemap pointer
├── sitemap.xml         # Sitemap for search engines
└── CHANGELOG.md        # Source of truth for version number
```

## Design system

- **Theme:** warm paper/receipt — `--paper` (#EFE9DB) / `--paper-dim` background; `--ink` / `--ink-soft` text
- **Accent:** `--red: #C0212B` (stamps, prices, "after" labels); `--green: #35633B` (terminal output, savings); `--amber: #C87F0A` (tags)
- **Type:** `Anton` for display headings; `Archivo Narrow` for body; `Courier Prime` for labels, stats, and code
- **Motifs:** dashed section borders, a scrolling ticker strip, a receipt-style demo box with a torn-paper edge

**Brand voice:** deadpan corporate-speak parody, in the same vein as [badgefor.me](https://badgefor.me). Don't over-explain jokes. Let the copy breathe.

## Deployment

No deployment pipeline yet. Phase 1 is structure only — an Azure Static Web Apps workflow (mirroring badgefor.me's) can be added once a hosting resource exists for this domain.

Version is derived from `CHANGELOG.md` — the latest `## [X.Y.Z]` heading is the current version.
