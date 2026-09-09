# INITIAL BACKLOG — prices (Cost-Benefit Calculator)

**Status:** Proposed — Pending Owner Approval
**Date:** 2026-09-08
**Related:** `project-brief.md` v0.2.1, `docs/02-architecture/architecture-review.md`, `roadmap.md`
**Convention:** `CB-NN` = backlog item. Priority: P0 (must) / P1 (should) / P2 (nice). Categories: Functionality, Configuration, Documentation, Infrastructure, Tests, Improvement, Automation, Research.

> Step-by-step order: work top-down. Sprint Zero first (CB-01–CB-07; CB-08 deferred to Hardening), then MVP, Experience, Hardening, Release. No code was written during kickoff — coding starts at Sprint Zero after M-01 approval.

---

## SPRINT ZERO — Foundation (Milestone M-02)

| ID | Title | Category | Priority | Milestone | Description | Acceptance Criteria |
| -- | ----- | -------- | -------- | --------- | ----------- | ------------------- |
| CB-01 | Clean template baseline | Configuration | P0 | M-02 | Remove Vite starter hero (`App.tsx`, `App.css`, assets); create target folder skeleton (`app/`, `features/calculator/`, `components/ui/`, `lib/`, `i18n/`, `styles/`). | `npm run dev` renders blank shell; no dead assets |
| CB-02 | Lock standards (branches, commits, PRs) | Documentation | P0 | M-02 | Record team conventions: branches `feat/CB-xx-desc`, Conventional Commits, PR checklist with review. | Standards noted in README or `docs/`; first PR follows them |
| CB-03 | Install core deps | Configuration | P0 | M-02 | Add `zustand`, `i18next`, `react-i18next`, browser language detector, Workbox-based PWA plugin, `lucide-react`, `clsx`, `tailwind-merge`. | `npm run build` green; versions pinned |
| CB-04 | Tailwind dark-mode + theme tokens | Infrastructure | P0 | M-02 | Configure `dark:` class strategy, CSS vars, fluid transitions, `theme-color` meta. | Toggling `<html>` class flips theme with transition, no flash of unstyled content |
| CB-05 | Internationalization skeleton (en + pt-BR) | Infrastructure | P0 | M-02 | Set up `i18n/index.ts` + `locales/en.json`, `pt-BR.json`; English default; detector + persist. | Switching locale changes sample string; no hardcoded strings in new code |
| CB-06 | PWA scaffold (manifest + icons + service worker) | Infrastructure | P0 | M-02 | Configure PWA plugin: manifest (name, icons 192/512 maskable), precache app shell, offline fallback. | DevTools → Application shows manifest + service worker; install prompt available |
| CB-07 | Decide deploy target + preview | Infrastructure | P0 | M-02 | Vercel selected as static host (HTTPS included); publish preview URL. | ✅ Done 2026-09-08 — preview live at https://prices-mauve.vercel.app (shell + manifest verified over HTTPS) |
| CB-08 | Test + quality baseline | Tests | P2 (deferred to Hardening) | M-05 | Add Vitest + Testing Library; scripts `lint`, `typecheck`; first smoke test (renders shell). Owner decision 2026-09-08: moved out of Sprint Zero to keep it lean. | `lint` + `tsc --noEmit` + `vitest` green |

**Sprint Zero exit gate:** CB-01–CB-07 done; preview live; ready for MVP.

---

## MVP — Calculator Core (Milestone M-03)

| ID | Title | Category | Priority | Milestone | Description | Acceptance Criteria |
| -- | ----- | -------- | -------- | --------- | ----------- | ------------------- |
| CB-09 | `lib/units` — normalization + ranking | Functionality | P0 | M-03 | Pure functions: `toBaseUnit(qty, unit)`, `pricePerBase()`, `rank()`, `savingsPct()`; families Volume(L)/Mass(kg,g)/Count(un); g→kg. | Unit tests pass incl. 2 L @ 10.00 (5.00/L) vs 1.5 L @ 7.50 (5.00/L tie) and winner case |
| CB-10 | `lib/currency` — Intl formatting | Functionality | P0 | M-03 | `formatPrice`/`formatUnitPrice` via `Intl.NumberFormat` keyed by locale (en→USD, pt-BR→BRL). | R$ 5,00/L in pt-BR; $5.00/L in en |
| CB-11 | Calculator store (Zustand) | Functionality | P0 | M-03 | `products[]`, `add/update/remove/clear`; derived selectors (`ranked`, `winnerId`); persist inputs (aisle-interruption safe). | Add 3 products, reload, state survives (if persisted) |
| CB-12 | `UnitSelector` one-tap buttons | Functionality | P0 | M-03 | Segmented L/kg/g/un buttons, ≥44px targets, `aria-pressed`, no keyboard needed. | Tap changes unit without opening keyboard; keyboard operable |
| CB-13 | `ProductCard` inputs | Functionality | P0 | M-03 | Price + quantity numeric inputs (`inputmode="decimal"`), optional label, remove button, inline validation. | Invalid (≤0, empty) shows localized error; valid computes instantly |
| CB-14 | `ResultsList` + `WinnerBadge` | Functionality | P0 | M-03 | Ranked list with unit price, best-value highlight, savings %; cross-family guard message. | Best entry badged; L vs kg shows "cannot compare" message |
| CB-15 | Mobile-first calculator layout | Functionality | P0 | M-03 | Single-view responsive layout, sticky results, minimal taps. | Usable at 360px width; ≤3 taps from input to result |
| CB-15b | mL unit support (promoted from follow-ups) | Functionality | P1 | M-03 | Extend `lib/units` with mL→L conversion, labels, and checks (essential for beverages in BR). Owner decision 2026-09-09: portfolio calculator must be robust. | 250 mL @ 2.50 (10.00/L) ranks correctly; checks green |
| CB-15c | Evaluate global family selector UX alternative | Research | P2 | M-04 | Prototype assessment: single top-level family selector (Volume/Mass/Count) that prevents cross-family errors by construction, vs per-product units. Decide before Experience polish. | Decision recorded with rationale; no dead prototype left behind |

---

## EXPERIENCE — Theme + internationalization + History (Milestone M-04)

| ID | Title | Category | Priority | Milestone | Description | Acceptance Criteria |
| -- | ----- | -------- | -------- | --------- | ----------- | ------------------- |
| CB-16 | `ThemeToggle` + persistence | Functionality | P0 | M-04 | Light/dark toggle, `prefers-color-scheme` initial, `localStorage` persist, fluid transition. | Reload keeps theme; system default respected on first run |
| CB-17 | `LanguageToggle` EN ⇄ PT-BR | Functionality | P0 | M-04 | Segmented toggle, persists, full UI + units + currency re-render. | 100% strings translated; no hardcoded text (grep audit) |
| CB-18 | `HistoryPanel` (local) | Functionality | P1 | M-04 | Capped (20) snapshots of comparisons, restore/clear-all. | History survives reload; clear works |
| CB-19 | Empty / error / tie states | Improvement | P1 | M-04 | Friendly empty state, tie message ("same unit price"), validation hints. | Each state reachable and localized |
| CB-20 | Motion + polish | Improvement | P2 | M-04 | Subtle transitions (winner highlight, toggle), reduced-motion respect. | `prefers-reduced-motion` disables animation |

---

## HARDENING — PWA + accessibility + Tests (Milestone M-05, part 1)

| ID | Title | Category | Priority | Milestone | Description | Acceptance Criteria |
| -- | ----- | -------- | -------- | --------- | ----------- | ------------------- |
| CB-21 | Offline audit + `OfflineBadge` | Tests | P0 | M-05 | Airplane-mode test after first load; online/offline indicator; update-available toast. | Full flow works offline; stale service-worker update path verified |
| CB-22 | Accessibility keyboard + screen-reader pass | Tests | P0 | M-05 | Landmarks, labels, visible focus, contrast, live region for results (`aria-live="polite"`). | Tab-only full flow; Lighthouse Accessibility ≥ 95 |
| CB-23 | Unit-test suite for `lib/` + store | Tests | P0 | M-05 | Cover conversions, ranking, savings, currency, edge cases (0, negative, huge qty). | `vitest` green; conversion bugs have regression tests |
| CB-24 | Lighthouse + performance pass | Automation | P1 | M-05 | Optimize bundle, icons, fonts; measure mobile Performance ≥ 90, Best Practices ≥ 90. | Report saved; installable PWA badge |

---

## RELEASE — Portfolio Deploy (Milestone M-05, part 2)

| ID | Title | Category | Priority | Milestone | Description | Acceptance Criteria |
| -- | ----- | -------- | -------- | --------- | ----------- | ------------------- |
| CB-25 | README rewrite (portfolio-grade) | Documentation | P0 | M-05 | Demo link, screenshots/GIF, features, stack, scripts, PWA/internationalization/theme notes, architecture map, decisions, roadmap. | Reviewer can run + install in <5 min from README |
| CB-26 | Production deploy | Automation | P0 | M-05 | Deploy static build over HTTPS; verify manifest + service worker in prod. | Public URL installable on Android + iOS guidance |
| CB-27 | v1.0 tag + Release Notes | Documentation | P0 | M-05 | Tag `v1.0.0` (SemVer); Release Notes; Definition of Done check. | Tag + notes published; DoD signed |
| CB-28 | Follow-ups (deferred, not v1.0) | Research | P2 | — | oz/lb units, barcode/OCR, price history charts, share-link. (mL promoted to MVP scope.) | Recorded as future epics, not in v1.0 scope |
| CB-29 | Smart shopping list (future product track) | Research | P2 | — | Product vision for the mature product at prices.mourao.info (organize purchases, prioritize items). Explicitly OUT of this portfolio scope; to be analyzed in a future conversation. Portfolio track stays calculator-only. | Vision recorded; no portfolio commitment |

---

## Traceability

- Brief objectives → CB-09–CB-15 (core), CB-16–CB-17 (theme/internationalization), CB-21 (offline), CB-22 (accessibility), CB-25 (README).
- Architecture decisions → AD-01: CB-11; AD-02: CB-09+CB-23; AD-03: CB-14; AD-04: CB-06+CB-21; AD-05: CB-04+CB-16.
- Risks → conversion errors: CB-09+CB-23; stale PWA: CB-21; translation drift: CB-17; scope creep: CB-28 gate.

---

*Ready for: M-01 approval → Sprint Zero (CB-01–CB-08) → Sprint Planning.*
