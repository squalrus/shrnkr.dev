# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

SHRNKR is a satirical static website posing as token-compression middleware for AI agents — it "sits between you and your AI agent" and shrinks prompts/responses into fewer, uglier tokens (Wehadababyitsaboy-style word-merging), parodying LLM-cost-optimization tooling. Pure HTML/CSS/JS, no build step, no package manager, no framework. A sibling production of [badgefor.me](https://badgefor.me), same repo conventions.

The name is itself a squish joke: run "Shrinker" through the site's own level-5 algorithm (keep each word's first letter, strip the rest of its vowels) and you get "shrnkr".

**Brand voice:** deadpan corporate-speak parody. Don't over-explain jokes. Let the copy breathe.

**Status:** Phase 1 — structure is established but the name and copy are still expected to change. Don't treat current brand name/copy as final.

## Running Locally

Open `index.html` directly in a browser — no server required. There are no build, lint, or test commands.

## Deployment

No deployment pipeline yet. When one is added, follow badgefor.me's pattern (Azure Static Web Apps via GitHub Actions).

## Architecture

Single-page static site. All content lives in [index.html](index.html).

- [css/styles.css](css/styles.css) — all styling via CSS custom properties; no preprocessor
- [js/main.js](js/main.js) — ticker strip message rotation, hero headline shrink-in animation, aggression slider label, and the live shrinker demo (`shrinkText()`: strips punctuation, elides vowels, merges N adjacent words per aggression level, then types the result out character-by-character)
- Fonts loaded from Google Fonts (Anton, Archivo Narrow, Courier Prime) — no local font files

The live demo's "stats" (tokens saved, $ saved, readability remaining) are cosmetic — derived from string-length deltas, not any real tokenizer.

## Version tracking

Version is derived from CHANGELOG.md — the latest `## [X.Y.Z]` heading is the current version. No separate version file is maintained.

The footer in `index.html` displays the version as a `<span>` in `footer p` (e.g. `<span>v0.1.0</span>`). **Update this span on every release** to match the new version.

## Design System

- **Theme:** warm paper/receipt — `--paper: #EFE9DB` / `--paper-dim: #E4DCC8` backgrounds; `--ink: #1C1B18` / `--ink-soft: #4A463D` text
- **Accent:** `--red: #C0212B` (stamps, prices, "after" state); `--green: #35633B` (terminal/output text, savings); `--amber: #C87F0A` (tags)
- **Type:** `Anton` for display headings (h1/h2/brand/prices); `Archivo Narrow` for body copy; `Courier Prime` (`.mono`) for labels, nav, stats, and code blocks
- **Motifs:** dashed `1px` section dividers; scrolling ticker strip at the top; receipt-style `.receipt` demo box with a perforated-edge illusion via radial-gradient pseudo-elements
- **Responsive breakpoints:** 760px (testimonials 3→1 col), 640px (examples/features 2→1 col)
