# PROJECT BRIEF — prices

**Version:** 0.2.1
**Status:** Approved — Pending Owner sign-off on scope
**Date:** 2026-09-08
**Owner:** Marcos Ferreira Mourão (https://github.com/devmourao/)
**Author:** Tech Lead / Frontend Architect

---

# 1. Project Identification

| Field | Information |
| ----- | ----------- |
| Project Name | prices |
| Project Code | prices |
| Version | 0.2.1 |
| Date | 2026-09-08 |
| Owner | Marcos Ferreira Mourão |
| Repository | Local Git repository — React + Vite + TypeScript template |
| Status | Draft |

---

# 2. Overview

## Summary

`prices` is an isolated web application (SPA + PWA) that works as a portfolio showcase for a Frontend Developer position. The product is a **Cost-Benefit Calculator for supermarket use**: the user compares two or more products with different prices and measures (e.g. 2 L for BRL 10.00 vs 1.5 L for BRL 7.50) and instantly discovers which is the most advantageous.

The app is mobile-first, minimalist, elegant, and intuitive, with offline support (supermarket connectivity is unstable), light/dark theming, and internationalization with English as default plus a PT-BR toggle.

## Elevator Pitch

> In the supermarket aisle, with weak signal, open `prices`, type two prices, tap the unit buttons, and instantly see which product is cheaper per liter, kilo, gram, or unit — in English or Portuguese, light or dark mode, even offline.

---

# 3. Problem or Opportunity

## Problem

- Shoppers cannot mentally compute unit prices fast (2 L @ R$10 vs 1.5 L @ R$7.50) under time pressure and poor connectivity.
- Opening the virtual keyboard repeatedly to type units is slow and error-prone on mobile.
- Most calculator demos are desktop-only, online-only, single-language, single-theme — weak as portfolio pieces.

## Opportunity

- Deliver a fast, offline-capable, mobile-first calculator with minimal interactions (visual unit buttons: Liter, Kilo, Gram, Unit).
- Demonstrate industry-grade frontend skills: Hooks, efficient state management, PWA, internationalization, theming, accessibility, clean componentization, quality README.
- Create a memorable portfolio asset recruiters can install and test on a phone inside a real supermarket.

---

# 4. Objectives

## General Objective

Build and deploy an installable, offline-capable, bilingual, themed Cost-Benefit Calculator SPA/PWA that proves frontend craft at hiring-bar quality.

## Specific Objectives

- Compare 2+ products by normalized unit price with instant best-value highlight.
- Minimize interactions: numeric inputs + one-tap visual unit selectors (no keyboard for units).
- Work offline via PWA (app shell + cache-first) after first load.
- Ship Light/Dark mode with fluid transitions and persisted preference.
- Ship internationalization with English default and PT-BR toggle, persisted.
- Meet an accessibility baseline (semantic HTML, keyboard navigation, visible focus, contrast, ARIA for results).
- Publish clean code + quality README + live demo URL.

---

# 5. Initial Scope

## Included in Scope

- Product comparison core: add/edit/remove products (name optional, price, quantity, unit); automatic price-per-base-unit; best-value badge + savings %.
- Units v1: Liter (L), Kilo (kg), Gram (g), Unit (un). Normalization: L base, kg base, g→kg, mL→L if added later.
- Mobile-first minimalist UI; quick unit buttons; numeric `inputmode="decimal"`.
- State with Hooks + Zustand (persisted theme/locale/history).
- PWA: manifest, icons, service worker (Workbox-based), offline fallback.
- Theming (light/dark toggle + `prefers-color-scheme` default) and internationalization (English default, PT-BR toggle).
- Currency formatting via `Intl.NumberFormat` (USD default for English, BRL for PT-BR).
- Planning documentation: Brief, Architecture Review, Roadmap, Backlog, README rewrite.
- Deploy static build (hosting provider TBD).

## Out of Scope

- Backend, accounts, database, sync across devices.
- Barcode scanning, OCR from photos, store APIs.
- Multi-currency conversion / live FX rates.
- Complex unit families v1 (mL, oz, lb) — may enter as follow-up.
- Push notifications, analytics, ads.
- Full design system — only a minimal reusable UI kit.

---

# 6. Stakeholders

| Stakeholder | Role |
| ----------- | ---- |
| Marcos Ferreira Mourão | Project Owner / Developer / Portfolio author |
| Recruiters / Hiring managers | Audience — evaluate code, UX, PWA, README, demo |
| Supermarket shoppers | End users — fast in-aisle comparison |

---

# 7. Technologies

Proposed stack — subject to Architecture Review approval. See `docs/02-architecture/architecture-review.md`.

## Languages

- TypeScript (strict)

## Frameworks

- React 19 + Vite 8 (already in repo)

## Tools / Libraries (proposed)

- Tailwind CSS 4 (already in repo) for mobile-first styling + dark variant
- Zustand (state) + `persist` middleware
- i18next + react-i18next + browser language detection
- Workbox-based PWA plugin for Vite (manifest + offline precache)
- lucide-react (icons), clsx + tailwind-merge (class composition)
- zod (input validation schema, lightweight) — optional
- Vitest + Testing Library (unit), Lighthouse CI / manual airplane test (PWA) — phased

## Database

- None. `localStorage` (via persisted store) for theme, locale, and comparison history.

## Platforms

- Web SPA + PWA (installable, offline). Static hosting.

---

# 8. Constraints

- No source-code changes during kickoff (planning phase only).
- Must reuse the existing repo baseline (React 19, Vite 8, TypeScript, Tailwind 4) unless the Architecture Review justifies removal.
- Mobile-first; minimal taps; avoid unnecessary virtual-keyboard opens.
- Offline-first after first visit; fast cached load.
- English default, PT-BR toggle; all UI strings externalized.
- Portfolio-grade: clean components, accessibility, README with demo + screenshots + Lighthouse scores.
- Engineering standards: English documentation; branch convention `feat/<item>-<description>`; Conventional Commits; PR checklist with review; Definition of Done per milestone.

---

# 9. Assumptions

| ID | Assumption |
| -- | ---------- |
| A-01 | Static hosting suffices (no backend). |
| A-02 | 4 units (L, kg, g, un) cover the MVP; mixed-unit comparison across families is blocked with a clear message. |
| A-03 | Currency is display-only via Intl; no conversion. |
| A-04 | Single developer; English-first documentation. |
| A-05 | GitHub is the remote; deploy target decided in Sprint Zero. |

---

# 10. Initial Risks

| Risk | Impact | Mitigation |
| ---- | ------ | ---------- |
| Scope creep (scanner, backend, accounts) | High | Enforce Out of Scope; gate via milestones |
| PWA caching bugs (stale UI) | Medium | Versioned precache + runtime cache; manual offline test |
| Translation string drift | Medium | Single `locales/en,pt-BR` source; lint for hardcoded strings |
| Unit-conversion errors | High | Pure `lib/units.ts` + unit tests; block cross-family compare |
| Accessibility gaps on mobile | Medium | Semantic HTML + native controls first; Lighthouse/axe audit |

---

# 11. Success Criteria

- User compares 2+ products and sees best value in < 3 taps after typing prices.
- App loads offline after first visit (airplane-mode test passes).
- Light/dark toggle persists with fluid transition; no flash of unstyled content.
- English default, PT-BR toggle persists; no hardcoded UI strings.
- Lighthouse (mobile): Performance ≥ 90, Accessibility ≥ 95, Best Practices ≥ 90, PWA installable.
- README documents setup, scripts, architecture, PWA, internationalization, theming, decisions, demo link.
- Clean Git history (Conventional Commits) + review-based merges.

---

# 12. High-Level Roadmap

| Phase | Objective |
| ----- | --------- |
| Kickoff | Approve Brief (this document) |
| Foundation (Sprint Zero) | Tooling, PWA scaffold, internationalization + theme shells, standards, deploy target |
| MVP | Calculator core + unit normalization + best-value result |
| Experience | Polish UX, animations, history, accessibility pass |
| Hardening | Offline audit, Lighthouse, tests, README, portfolio deploy |
| Release | v1.0 tag + Release Notes + Closure |

See `docs/04-management/roadmap.md` for details and `initial-backlog.md` for actionable items.

---

# 13. Initial Milestones

| Milestone | Objective |
| --------- | --------- |
| M-01: Kickoff Approved | Brief + Architecture + Roadmap + Backlog approved |
| M-02: Foundation Ready | Sprint Zero done; CI lint/typecheck green; deploy preview live |
| M-03: MVP Usable | 2+ product comparison works on mobile |
| M-04: Experience Complete | Theme + internationalization + history + accessibility pass |
| M-05: Portfolio Release | PWA installable offline; Lighthouse targets met; v1.0 released |

---

# 14. Dependencies

- Deploy target account (static hosting with HTTPS, required for PWA).
- App icons (maskable 192/512) + theme-color meta.
- No external APIs.

---

# 15. Approval Criteria

- Scope defined; objectives clear; stakeholders identified; stack proposed; risks recorded.

---

# 16. Approval

| Role | Name | Date |
| ---- | ---- | ---- |
| Author | Tech Lead / Frontend Architect | 2026-09-08 |
| Reviewer | TBD | TBD |
| Approver | Marcos Ferreira Mourão | TBD — Pending |

---

# 17. Revision History

| Version | Date | Change | Author |
| ------- | ---- | ------ | ------ |
| 0.1.0 | 2026-09-08 | Generic baseline (template repo only) | Tech Lead |
| 0.2.0 | 2026-09-08 | Re-scoped to Cost-Benefit Calculator SPA+PWA per Owner requirements | Tech Lead / Frontend Architect |
| 0.2.1 | 2026-09-08 | Documentation polish: standardized on industry terminology | Tech Lead / Frontend Architect |

---

*End of Project Brief — prices v0.2.1 (Draft).*
