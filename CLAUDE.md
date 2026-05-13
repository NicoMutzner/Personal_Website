# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Overview

This is a static personal academic website for Nico Mutzner, a PhD researcher in Sociology at the University of Zurich. There is no build system, package manager, or framework — it's plain HTML, CSS, and JavaScript deployed to GitHub Pages.

## Deployment

Pushes to `main` automatically trigger deployment via the GitHub Actions workflow in [.github/workflows/static.yml](.github/workflows/static.yml). The live site is at https://www.nicomutzner.com/.

To preview locally, open [index.html](index.html) directly in a browser or use any static file server (e.g., `python -m http.server`).

## Structure

The entire site is a single page ([index.html](index.html)) with:
- [styles.css](styles.css) — all styles, including CSS custom properties (design tokens), layout, and component styles
- [script.js](script.js) — minimal vanilla JS: count animation on hero stats, active nav link highlight on scroll, timeline date-range label splitting, back-to-top button
- [images/](images/) — photos for publications (`pubs/`), working papers (`wp/`), projects (`projects/`), and posters (`posters/`)

## Design System

All colors and spacing are defined as CSS custom properties on `:root` in [styles.css](styles.css). The palette is warm parchment-toned:
- `--ink`, `--ink-soft`, `--muted` — text hierarchy
- `--paper`, `--paper-soft`, `--paper-warm`, `--card` — background levels
- `--brass`, `--ochre`, `--olive`, `--sage`, `--blue` — accent colors
- `--walnut` — darkest tone for headings/brand

The primary typeface for body text is Inter (system-ui fallback); `Fraunces` (variable serif) is used for the nav brand and section headings.

## Content Sections

Sections in order: hero → about → featured article → publications → working papers → projects → teaching → conference talks → contact. Section IDs match the nav anchors.

### Publications & Working Papers

Publication cards use `.card` inside `.grid.cols-3`. Linked publications wrap the `<article class="card">` in `<a class="card-link-wrapper">`. Cards without a DOI/URL are plain `<article>` elements (no wrapper link).

Working paper status badges use `<span class="chip status review">` for under-review/in-preparation states.

### Teaching & Talks timelines

Both use `.timeline > .t-item[data-date="YYYY"]`. The `data-date` attribute drives the year label rendered in CSS via `::before`/`::after` pseudo-elements. For multi-year ranges (e.g. `2022–2024`), `script.js` splits the value into `data-from` and `data-to` and adds class `.range`.

### Hero stats

The counters in `.stats .stat .num[data-target]` are animated by `script.js` on intersection. To update citation or publication counts, change both the `data-target` attribute value and the fallback text content of the element.
