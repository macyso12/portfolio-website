# Tasks: Personal Portfolio Website — Fashion Artist

**Input**: `.specify/memory/spec.md` + `.specify/memory/plan.md`

**Stack**: Vite · Vanilla HTML/CSS/JS · Three.js · SQLite (`better-sqlite3`) · Vitest · Playwright

---

## Phase 1: Setup & Foundation ⚠️ BLOCKS EVERYTHING

**Purpose**: Project scaffold, design tokens, data pipeline. Nothing else can start until T007 is done.

- [ ] T001 Init Vite project (`npm create vite@latest . -- --template vanilla`), install deps: `three`, `better-sqlite3`, `vitest`, `@playwright/test` — `package.json`, `vite.config.js`
- [ ] T002 Configure Vite MPA: add all 5 HTML entry points to `vite.config.js` `build.rollupOptions.input`
- [ ] T003 [P] Create all 5 HTML files with shared `<nav>` and `<footer>` markup, correct `<title>` and meta charset/viewport — `index.html`, `industry-work.html`, `creative-direction.html`, `photography.html`, `contact.html`
- [ ] T004 [P] Write `src/css/tokens.css` — CSS custom properties: color palette (dark editorial base), type scale, spacing scale, motion tokens (`--duration-fast`, `--duration-slow`, `--easing-standard`)
- [ ] T005 [P] Write `src/css/reset.css` (box-sizing, margin, list, image resets) and `src/css/global.css` (body font, nav shell, footer shell)
- [ ] T006 Create `portfolio.db` SQLite schema: `projects` table with columns `id`, `title`, `category` (industry-work|creative-direction|photography), `cover_image`, `images` (JSON array), `description`, `client`, `role`, `year`, `tags` (JSON array) — `src/data/schema.sql`
- [ ] T007 Write `src/data/seed.js`: open `portfolio.db` with `better-sqlite3`, query by category, write `data/industry-work.json`, `data/creative-direction.json`, `data/photography.json`; add `"prebuild": "node src/data/seed.js"` and `"predev": "node src/data/seed.js"` to `package.json`
- [ ] T008 [P] Insert 3–5 placeholder project rows into `portfolio.db` (placeholder image paths, lorem text) to verify pipeline end-to-end
- [ ] T009 [P] Configure Vitest (`vitest.config.js`), add `"test": "vitest"` script; configure Playwright (`playwright.config.js`), add `"test:e2e": "playwright test"` script

**Checkpoint**: `npm run dev` serves all 5 pages; `data/*.json` files are emitted; `npm test` and `npm run test:e2e` run (zero tests yet, but runners work).

---

## Phase 2: Navigation & Layout Shell (US1 prerequisite, all pages)

**Purpose**: Persistent nav, responsive layout, footer — shared across all stories.

- [ ] T010 Write `src/js/nav.js`: hamburger toggle (add/remove `.nav-open` on `<body>`), close on outside click, close on Escape, set `aria-expanded` on toggle button
- [ ] T011 Write `src/css/global.css` nav styles: desktop horizontal bar, mobile drawer (slide-in), active page link highlight using `data-page` attribute matched against current `location.pathname`
- [ ] T012 [P] Write `src/js/reduced-motion.js`: export `const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches` — used by animation modules
- [ ] T013 [P] Add footer markup to all 5 HTML files: social links (Instagram, LinkedIn, email `mailto:`), copyright line
- [ ] T014 Write Playwright test `tests/e2e/nav.spec.js`: nav links navigate correctly, hamburger opens/closes, active link is highlighted on each page, keyboard Escape closes mobile menu

**Checkpoint**: Navigate between all 5 pages via nav on desktop and mobile; keyboard-accessible; Lighthouse Accessibility ≥ 90.

---

## Phase 3: US1 — Home / Landing Page

**Goal**: Hero section + artist intro + section preview cards → visitor understands Karen's identity in ≤ 5 s.

**Independent Test**: Deploy only `index.html`. A stranger reads Karen's name, title, and discipline without clicking anything.

### Tests (write first, verify they FAIL before implementation)

- [ ] T015 [P] [US1] Playwright `tests/e2e/home.spec.js`: hero text visible above fold on load; section preview cards for Industry Work, Creative Direction, Photography each link to correct page; page title correct
- [ ] T016 [P] [US1] Playwright accessibility check: `axe-core` scan of `index.html` returns zero critical/serious violations

### Implementation

- [ ] T017 [US1] Write hero section HTML in `index.html`: `<h1>` name, `<p>` title/tagline, CTA button "View Work", `<div id="hero-canvas">` placeholder for 3D (Phase 5)
- [ ] T018 [US1] Write `src/css/home.css`: hero full-viewport layout, type sizing, hero canvas placeholder (static dark background until Three.js), scroll-reveal utility class `.reveal` (CSS `@keyframes` fade-up)
- [ ] T019 [US1] Write artist intro section in `index.html`: 2–3 sentence statement, portrait image (`<img loading="lazy">`)
- [ ] T020 [US1] Write section preview cards in `index.html`: 3 cards (Industry Work, Creative Direction, Photography), each with cover image, label, arrow link — hardcoded HTML (no JS needed)
- [ ] T021 [US1] Write `src/js/home.js`: Intersection Observer to add `.reveal` class when sections enter viewport; skip observer if `prefersReducedMotion` is true (import from `reduced-motion.js`)

**Checkpoint**: Home page fully functional and independently testable. Hero text, intro, and preview cards render. Scroll animation works and respects reduced-motion.

---

## Phase 4: US2 + US3 + US4 — Gallery Pages (Industry Work, Creative Direction, Photography)

**Goal**: Each gallery page fetches its JSON, renders a grid, opens a lightbox. Each is independently testable.

**Independent Test**: Visit `/industry-work.html` with `data/industry-work.json` present — grid renders, lightbox opens, keyboard nav works.

### Tests (write first, verify they FAIL before implementation)

- [ ] T022 [P] [US2] Vitest `tests/unit/gallery.test.js`: `renderGrid(projects, container)` renders correct number of cards; `filterByCategory(projects, cat)` returns correct subset; broken-image fallback applied when `src` is missing
- [ ] T023 [P] [US2] Vitest `tests/unit/lightbox.test.js`: `openLightbox(index)` sets correct `src`; `navigateLightbox(+1)` advances index with wrap-around; `closeLightbox()` hides overlay and returns focus to trigger element
- [ ] T024 [P] [US2] Playwright `tests/e2e/gallery.spec.js`: grid renders on all 3 gallery pages; clicking a card opens lightbox; Escape closes lightbox; arrow keys navigate; `aria-modal` present on lightbox; images have `alt` text

### Implementation

- [ ] T025 [US2] Write `src/js/gallery.js`: `async function initGallery(jsonPath)` — fetch JSON, call `renderGrid`, attach click listeners; export `renderGrid(projects, container)` (pure, testable); attach Intersection Observer for lazy-load reveal
- [ ] T026 [US2] Write `src/css/gallery.css`: CSS grid layout (auto-fill, minmax for responsive masonry-like grid), card hover state (overlay with title), `aspect-ratio` on card images to prevent CLS
- [ ] T027 [US2] Write `src/js/lightbox.js`: `openLightbox(projects, index)`, `closeLightbox()`, `navigateLightbox(delta)`; keyboard listener (ArrowLeft, ArrowRight, Escape); focus trap; `aria-modal="true"`, `role="dialog"`; restore focus on close
- [ ] T028 [US2] Write `src/css/lightbox.css`: full-viewport overlay, centered image, prev/next buttons, close button, `transition` respects `prefers-reduced-motion`
- [ ] T029 [US2] Wire `industry-work.html`: import `gallery.js`, call `initGallery('/data/industry-work.json')`; add page-specific hero (`<h1>Industry Work</h1>`, subheading)
- [ ] T030 [US3] Wire `creative-direction.html`: import `gallery.js`, call `initGallery('/data/creative-direction.json')`; add concept-emphasis layout (card shows one-line concept description below title) — extend `renderGrid` with optional `showConcept` flag
- [ ] T031 [US4] Wire `photography.html`: import `gallery.js`, call `initGallery('/data/photography.json')`; photography-specific CSS override in `src/css/photography.css` — full-bleed grid, minimal chrome, no card text overlays (title appears in lightbox only)

**Checkpoint**: All 3 gallery pages independently render from JSON, lightbox works keyboard-only, no CLS from images, Vitest unit tests green, Playwright e2e green.

---

## Phase 5: US5 — Contact Page

**Goal**: Validated form → Formspree delivery → Karen receives email.

**Independent Test**: Fill and submit the form on `/contact.html`; Karen's inbox receives the message within 30 s.

### Tests (write first, verify they FAIL before implementation)

- [ ] T032 [P] [US5] Vitest `tests/unit/contact.test.js`: `validateForm({name, email, subject, message})` returns errors for blank fields; returns error for invalid email format; returns empty errors for valid input
- [ ] T033 [P] [US5] Playwright `tests/e2e/contact.spec.js`: empty submit shows inline errors; invalid email shows error; valid submit shows success message; honeypot field is present and hidden; social links point to correct URLs

### Implementation

- [ ] T034 [US5] Write `contact.html` form: fields `name`, `email`, `subject`, `message`; hidden honeypot field `<input name="_gotcha" tabindex="-1" autocomplete="off">`; submit button; social links section (Instagram, LinkedIn, email)
- [ ] T035 [US5] Write `src/js/contact.js`: `validateForm()` (export for unit tests); submit handler — if honeypot filled, silently drop; `fetch` POST to Formspree action URL; show `.success-message` on 200, `.error-message` on failure with mailto fallback link; inline error display per field
- [ ] T036 [US5] Write `src/css/contact.css`: form layout, field focus styles using token colors, inline error style (red, below field), success/error message states
- [ ] T037 [US5] Register Formspree form, set action URL in `contact.html` (or env variable read at build time)

**Checkpoint**: Contact form validates, submits, Karen receives email. Bot honeypot works. Success and error states display correctly.

---

## Phase 6: US6 — 3D Hero Scene

**Goal**: Three.js WebGL scene in home page hero; static fallback for reduced-motion and low-end devices.

**Independent Test**: Open home page on a capable desktop browser — 3D scene plays. Enable "Reduce Motion" in OS — static image renders. Open browser DevTools → Performance → throttle CPU 6× — static fallback activates.

### Tests (write first, verify they FAIL before implementation)

- [ ] T038 [US6] Playwright `tests/e2e/home.spec.js` (extend T015): `#hero-canvas canvas` element is present when WebGL is available; hero `<h1>` text is visible BEFORE canvas load (LCP not blocked); with `--force-prefers-reduced-motion` flag, canvas is absent and static fallback image is visible

### Implementation

- [ ] T039 [US6] Write `src/js/three-scene.js`:
  - Import `{ Scene, PerspectiveCamera, WebGLRenderer, ... }` from `three`
  - `export function initScene(canvasContainer)`: create renderer, mount canvas into `canvasContainer`, animate loop
  - Scene concept: floating fabric-like plane geometry with subtle vertex displacement shader (or particle field if shader complexity is too high for v1)
  - `export function destroyScene()`: dispose renderer, cancel animation frame
- [ ] T040 [US6] Write `src/js/home.js` update: import `prefersReducedMotion` from `reduced-motion.js`; detect WebGL support (`!!document.createElement('canvas').getContext('webgl2')`); detect low-end device (`navigator.deviceMemory < 4` if available); if any condition true → show `<img id="hero-fallback">` static image, skip `initScene`; else call `initScene(document.getElementById('hero-canvas'))`
- [ ] T041 [US6] Add `<img id="hero-fallback" src="/images/hero-fallback.jpg" alt="Karen — Fashion Artist">` to `index.html` hero section (hidden by default via CSS `display:none`); add `#hero-canvas` div
- [ ] T042 [US6] Write `src/css/home.css` additions: `#hero-canvas canvas` positioned absolute, fills hero, `z-index: 0`; hero text `z-index: 1` (above canvas); `#hero-fallback` styled identical to canvas placeholder

**Checkpoint**: 3D scene plays on capable devices. LCP (hero `<h1>`) ≤ 2.5 s (canvas does not block text). Static fallback activates on reduced-motion. Playwright test green.

---

## Phase 7: Polish, SEO & CI

**Purpose**: Cross-cutting quality — gates from constitution must all pass.

- [ ] T043 [P] Add Open Graph + Twitter Card meta tags to all 5 HTML files: `og:title`, `og:description`, `og:image`, `og:url`, `twitter:card`
- [ ] T044 [P] Add `robots.txt` and `sitemap.xml` to project root (static files, copied to `dist/` by Vite)
- [ ] T045 [P] Add `<html lang="en">` and correct `<meta name="description">` to all 5 HTML files
- [ ] T046 [P] Run `axe-core` Playwright scan on all 5 pages in `tests/e2e/accessibility.spec.js`; fix any violations found
- [ ] T047 Write `.github/workflows/ci.yml` (or equivalent): steps — `npm ci` → `node src/data/seed.js` → `npm test` (Vitest) → `npm run build` → `npx playwright test` → Lighthouse CI (`lhci autorun`) against built `dist/`
- [ ] T048 Add `lighthouserc.json`: assert LCP ≤ 2500 ms, CLS ≤ 0.1, performance score ≥ 80, accessibility score ≥ 90 — blocks PR on regression
- [ ] T049 [P] Add `loading="lazy"` and explicit `width`/`height` attributes to every `<img>` in all HTML files (prevents CLS)
- [ ] T050 Final cross-browser QA: open each page in Chrome, Firefox, Safari; open on iOS Safari and Chrome Android; verify no broken images, no nav regressions, no layout shift

---

## Dependencies & Execution Order

```
T001–T009 (Phase 1, Foundation)
    ↓
T010–T014 (Phase 2, Nav Shell)  ← must precede Phase 3+
    ↓
T015–T021 (Phase 3, Home / US1)     ← P1, do first
    ↓
T022–T031 (Phase 4, Galleries / US2–4)   ← can follow US1 or run alongside
    ↓
T032–T037 (Phase 5, Contact / US5)   ← independent, can run parallel with Phase 4
    ↓
T038–T042 (Phase 6, 3D / US6)    ← depends on Phase 3 home page shell
    ↓
T043–T050 (Phase 7, Polish)
```

### Parallel opportunities within phases
- **Phase 1**: T003, T004, T005, T008, T009 can all run in parallel after T001
- **Phase 4 vs Phase 5**: Gallery pages and Contact page are independent — can run in parallel
- **Phase 7**: T043–T046, T048, T049 are all parallel

---

## Notes

- `[P]` = safe to run in parallel (touches different files, no shared dependency)
- `[USn]` = traceability back to user story in `spec.md`
- Write tests first (TDD per constitution) — verify RED before implementing
- Commit after each task or logical group
- Stop at each phase checkpoint to validate independently before proceeding
- `portfolio.db` is the source of truth for project data — never edit JSON files by hand
