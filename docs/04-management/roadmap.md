# INITIAL ROADMAP + MILESTONES — prices

**Status:** Proposed — Pending Owner Approval
**Date:** 2026-09-08
**Related:** `project-brief.md` v0.2.1, `docs/02-architecture/architecture-review.md`

---

# 1. Roadmap (High-Level Phases)

| # | Phase | Objective | Expected Outcome | Depends On |
| - | ----- | --------- | ---------------- | ---------- |
| 0 | Foundation (Sprint Zero) | Prepare repo, tooling, docs, deploy target | Clean template removed; lint+typecheck green; PWA/internationalization/theme shells; preview URL live | Kickoff approval |
| 1 | MVP — Calculator Core | Ship 2+ product comparison with unit normalization | Usable on mobile: add → tap unit → see winner | Foundation |
| 2 | Experience — Theme + internationalization + History | Bilingual themed polished UX | English default + PT-BR toggle; dark/light fluid; local history | MVP |
| 3 | Hardening — PWA + accessibility + Tests | Offline-first, accessible, tested | Airplane-mode pass; Lighthouse targets; unit tests for `lib/units` | Experience |
| 4 | Release — Portfolio Deploy | Public demo + README + v1.0 | Installable PWA URL; screenshots; Release Notes | Hardening |

**Prioritization logic:** value first (core math), then differentiation (offline/theme/internationalization), then proof (scores/tests/README). Risks (conversion errors, stale PWA) are attacked earliest via pure `lib/units` + tests and versioned precaching.

**Constraints:** single developer; static hosting only; no backend. Roadmap is directional, not a rigid schedule — revised at each milestone.

**Evolution criteria per phase:** lint + `tsc --noEmit` green; manual mobile check (touch targets ≥ 44px); docs updated alongside code changes.

---

# 2. Strategic Deliverables per Phase

- Foundation: clean `src/` structure, Tailwind dark setup, internationalization skeleton (en/pt-BR), PWA manifest + icons, deploy preview, branch/CI conventions.
- MVP: `ProductCard`, `UnitSelector`, `ResultsList`+`WinnerBadge`, `lib/units` + `currency`, Zustand store, cross-family guard.
- Experience: ThemeToggle, LanguageToggle, HistoryPanel, empty/error states, transitions, `prefers-color-scheme` default.
- Hardening: offline audit, `OfflineBadge`, `InstallPrompt`, accessibility/Lighthouse pass, Vitest suite, keyboard navigation pass.
- Release: README rewrite (demo, stack, PWA, internationalization, screenshots, scores), v1.0 tag, Release Notes, retrospective notes.

---

# 3. Milestones (Formal Control Points)

| ID | Milestone | Objective | Completion Criteria | Evidence | Approver |
| -- | --------- | --------- | ------------------- | -------- | -------- |
| M-01 | Kickoff Approved | Freeze vision + architecture + plan | Brief + Architecture Review + Roadmap + Backlog reviewed | Docs in `docs/` | Owner |
| M-02 | Foundation Ready | Sprint Zero done | Repo clean; `npm run dev/build/lint` green; preview URL live; standards recorded | Preview URL + checklist | Owner |
| M-03 | MVP Usable | Core comparison works on phone | 2–3 products; L/kg/g/un; winner + savings %; cross-family blocked | Demo video/screenshots + unit tests | Owner |
| M-04 | Experience Complete | Theme + internationalization + history polished | Toggles persist; no hardcoded strings; history capped + clearable; transitions smooth | Persist + locale audit | Owner |
| M-05 | Portfolio Release | Public v1.0 | PWA installable offline; Lighthouse targets met; README + demo link; tag v1.0 | Lighthouse report + URL + tag | Owner |

Each milestone is gated: if criteria fail, the project stays in the milestone until fixed.

---

# 4. Milestone × Gate Map

- M-01 → Gate: all 4 kickoff docs present and approved.
- M-02 → Gate: Sprint Zero checklist (repo/tooling/docs/standards/preview).
- M-03 → Gate: MVP acceptance (BRL cases: 2 L @ 10.00 vs 1.5 L @ 7.50 → cheaper per liter wins).
- M-04 → Gate: theme/internationalization/history acceptance + keyboard accessibility pass.
- M-05 → Gate: Definition of Done + offline airplane test + Lighthouse + README.

---

*Next: Initial Backlog (`initial-backlog.md`) → Sprint Zero → milestone gate → Sprint Planning.*
