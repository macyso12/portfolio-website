# Implementation Plan: Personal Portfolio Website — Fashion Artist

**Branch**: `001-portfolio-website` | **Date**: 2026-06-24 | **Spec**: `.specify/memory/spec.md`

---

## Summary

Build a 5-page static-first personal portfolio site for a fashion artist using **Vite + vanilla HTML/CSS/JS**. Project images live on disk (not uploaded to any CDN). Project metadata (title, category, description, client, year, etc.) is stored in a local **SQLite database** read at build time (or via a minimal local API server for dev). A single Three.js scene provides the 3D hero on the home page — loaded as a plain ES module, no React. Deployment target is a static host (Vercel/Netlify) with the SQLite read step happening at build time to emit static JSON data files consumed by the client.

---

## Technical Context

**Language/Version**: JavaScript (ES2022), HTML5, CSS3

**Primary Dependencies** (minimal, as required):
- `vite` — dev server, bundler, build tool
- `three` — 3D hero scene (vanilla Three.js, no React wrapper)
- `better-sqlite3` — read project metadata at build time via a Vite plugin/script
- `vite-plugin-static-copy` *(optional)* — copy image assets to dist
- No UI framework, no CSS framework, no component library

**Storage**: SQLite (`portfolio.db`) — local only, read at build time; emits `/data/*.json` static files consumed by the browser

**Testing**:
- Unit: `vitest` (logic helpers, data-access layer)
- Integration: Playwright (page-level acceptance scenarios from spec)
- Accessibility: `axe-core` via Playwright

**Target Platform**: Modern browsers — Chrome, Firefox, Safari (latest 2 versions); iOS Safari, Chrome Android

**Project Type**: Static web application (multi-page, vanilla)

**Performance Goals**: LCP ≤ 2.5 s (4G), CLS ≤ 0.1, INP ≤ 200 ms, 3D scene ≥ 30 fps on mid-range mobile

**Constraints**: No server runtime in production; no external image hosting; SQLite read happens only at build time; `prefers-reduced-motion` must suppress all animation

**Scale/Scope**: ~5 pages, ~50 projects max, 1 developer (Karen / solo)

---

## Constitution Check

| Gate | Status | Notes |
|---|---|---|
| Code quality: single-responsibility, no dead code | PASS | Each JS module has one job; enforced in review |
| Testing: unit coverage ≥ 80%, integration tests at boundaries | PASS | Vitest + Playwright cover all acceptance scenarios |
| UX consistency: shared design tokens, WCAG 2.1 AA | PASS | CSS custom properties as token layer; axe-core in CI |
| Performance budget checked in CI | PASS | Lighthouse CI step on every PR |
| 3D complexity justification | JUSTIFIED | Three.js is the sole non-trivial dep; fabric/particle scene is the core brand differentiator (spec US-6). No React-Three-Fiber wrapper — raw Three.js keeps bundle small |

---

## Project Structure

### Documentation

```text
.specify/memory/
├── constitution.md
├── spec.md
└── plan.md          ← this file
```

### Source Code

```text
my-project/
│
├── index.html                   # Home / Landing
├── industry-work.html           # Industry Work gallery
├── creative-direction.html      # Creative Direction gallery
├── photography.html             # Photography gallery
├── contact.html                 # Contact page
│
├── portfolio.db                 # SQLite — project metadata (local only, gitignored in CI)
│
├── data/                        # Build-time output — JSON files read by the browser
│   ├── industry-work.json
│   ├── creative-direction.json
│   └── photography.json
│
├── images/                      # Local project images (not uploaded anywhere)
│   ├── industry-work/
│   ├── creative-direction/
│   └── photography/
│
├── src/
│   ├── css/
│   │   ├── tokens.css           # CSS custom properties (colors, spacing, type scale)
│   │   ├── reset.css
│   │   ├── global.css           # Nav, footer, shared layout
│   │   ├── home.css
│   │   ├── gallery.css          # Shared gallery grid styles
│   │   ├── lightbox.css
│   │   └── contact.css
│   │
│   ├── js/
│   │   ├── nav.js               # Mobile nav toggle, active link state
│   │   ├── gallery.js           # Fetch JSON → render grid cards
│   │   ├── lightbox.js          # Lightbox open/close/prev/next
│   │   ├── contact.js           # Form validation + submission
│   │   ├── three-scene.js       # Three.js hero scene (home page only)
│   │   └── reduced-motion.js    # Detect prefers-reduced-motion, export flag
│   │
│   └── data/
│       └── seed.js              # CLI script: reads portfolio.db → writes data/*.json
│
├── tests/
│   ├── unit/
│   │   ├── gallery.test.js      # renderGallery(), filterProjects()
│   │   ├── lightbox.test.js     # open(), close(), navigate()
│   │   └── contact.test.js      # validateForm()
│   └── e2e/
│       ├── home.spec.js         # Hero loads, nav links work, 3D canvas present
│       ├── gallery.spec.js      # Grid renders, lightbox opens, lazy-load works
│       ├── contact.spec.js      # Form validation, success state, spam field
│       └── accessibility.spec.js # axe-core on all 5 pages
│
├── vite.config.js
├── package.json
└── .gitignore                   # portfolio.db NOT in .gitignore (it is the data source)
```

**Structure Decision**: Single-project, multi-page MPA. Each HTML file is a Vite entry point. No SPA router — native browser navigation. SQLite is local-only; `src/data/seed.js` is run as a pre-build step (`"prebuild": "node src/data/seed.js"`) to emit static JSON into `data/`. The browser fetches these JSON files at runtime to populate galleries.

---

## Phase Breakdown

### Phase 0 — Foundation
1. `npm create vite@latest` (vanilla template), configure multi-page in `vite.config.js`
2. Create all 5 HTML entry points with shared `<nav>` and `<footer>` markup
3. Establish `tokens.css` (color palette, type scale, spacing scale, motion tokens)
4. Write `reset.css` and `global.css`
5. Create `portfolio.db` schema and seed with placeholder data
6. Write `src/data/seed.js` — query SQLite, write `data/*.json`
7. Wire `prebuild` npm script

**Exit criterion**: `npm run dev` serves all 5 pages; `npm run build` emits `data/*.json` and static HTML.

### Phase 1 — Navigation & Layout Shell
1. `nav.js` — hamburger toggle, active page highlight, keyboard focus trap in mobile menu
2. Responsive nav CSS (desktop horizontal, mobile drawer)
3. Footer with social links
4. Page-level hero sections (static, no 3D yet)

**Exit criterion**: All 5 pages navigable; nav is keyboard-accessible; Lighthouse Accessibility ≥ 90.

### Phase 2 — Gallery Pages (Industry Work, Creative Direction, Photography)
1. `gallery.js` — `fetch('/data/<category>.json')` → render masonry/grid cards
2. `lightbox.js` — open on card click, keyboard nav (arrow keys, Escape), focus trap, `aria-modal`
3. `gallery.css` + `lightbox.css`
4. Lazy-load images via `loading="lazy"` + Intersection Observer fallback
5. Placeholder image on load error

**Exit criterion**: All three gallery pages render from JSON; lightbox works; images lazy-load; no CLS.

### Phase 3 — Contact Page
1. `contact.js` — client-side validation (required fields, email format), inline error messages
2. Form submission — `fetch` POST to Formspree endpoint (zero backend infra)
3. Success / error states
4. Honeypot field for spam
5. `contact.css`

**Exit criterion**: Form validates, submits, Karen receives email; bot honeypot works.

### Phase 4 — 3D Hero Scene
1. `three-scene.js` — Three.js scene (fabric-like geometry or abstract particle field)
2. Canvas injected into home page hero; text renders above canvas via CSS z-index
3. `reduced-motion.js` — if `prefers-reduced-motion: reduce`, skip scene init entirely; render static image fallback
4. Performance guard: detect WebGL support + device memory API; use static fallback on low-end devices
5. Scene does NOT block LCP (hero text in DOM before canvas initialises)

**Exit criterion**: 3D scene plays on capable devices; static fallback on reduced-motion/low-end; LCP ≤ 2.5 s.

### Phase 5 — Polish & CI
1. Open Graph / meta tags on all pages
2. `robots.txt`, `sitemap.xml`
3. Lighthouse CI GitHub Action (blocks PR on LCP, CLS, Accessibility regressions)
4. Playwright E2E suite passes on all 5 pages
5. Final visual QA pass across Chrome, Firefox, Safari, iOS, Android

**Exit criterion**: All constitution gates pass in CI; Lighthouse scores meet targets; no broken images or nav links.

---

## Complexity Tracking

| Decision | Why | Simpler Alternative Rejected Because |
|---|---|---|
| SQLite for metadata | Structured querying, Karen can edit via DB browser app, supports future CMS migration | Plain JSON files — SQLite gives typed fields, easier bulk edits, and `seed.js` still emits JSON so the browser never touches SQLite |
| Three.js (bare) | 3D hero is a spec requirement and core brand expression | CSS-only animation — cannot produce the fabric/sculptural 3D effect required |
| Formspree for contact | Zero backend, free tier, delivers to email | Building an API server — violates "minimal libraries" constraint and requires a runtime |
| Vite MPA (multiple HTML entries) | Native browser navigation, no router overhead | SPA with hash routing — adds complexity with no benefit for a portfolio of 5 static pages |
