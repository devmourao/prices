# INITIAL ROADMAP + MILESTONES — prices

**Status:** Active (calculator v1.0 + list v1.1 + receipt v1.2 track; R2 release)
**Date:** 2026-09-08 (list 2026-11-13; receipt 2026-11-13)
**Related:** `project-brief.md`, `shopping-list-brief.md`, `receipt-brief.md`, architecture reviews

---

# 1. Roadmap (High-Level Phases)

| # | Phase | Objective | Expected Outcome | Depends On |
| - | ----- | --------- | ---------------- | ---------- |
| 0 | Foundation (Sprint Zero) | Prepare repo, tooling, docs, deploy target | Clean template removed; lint+typecheck green; PWA/internationalization/theme shells; preview URL live | Kickoff approval |
| 1 | MVP — Calculator Core | Ship 2+ product comparison with unit normalization | Usable on mobile: add → tap unit → see winner | Foundation |
| 2 | Experience — Theme + internationalization + History | Bilingual themed polished UX | English default + PT-BR toggle; dark/light fluid; local history | MVP |
| 3 | Hardening — PWA + accessibility + Tests | Offline-first, accessible, tested | Airplane-mode pass; Lighthouse targets; unit tests for `lib/units` | Experience |
| 4 | Release — Portfolio Deploy | Public demo + README + v1.0 | Installable PWA URL; screenshots; Release Notes | Hardening |
| 5 | List track kickoff | Approve shopping-list brief / architecture / backlog | M-06 signed; CB-29 promoted | Calculator release |
| 6 | List shell + checklist MVP | Router, bottom nav, local list CRUD, buy+price | Usable checklist offline | List kickoff |
| 7 | Compare handoff + list release | Item → Compare → apply winner price; a11y/PWA pass | v1.1 list module | Checklist MVP |
| 8 | Receipt track kickoff | Approve receipt brief / architecture / backlog (model B) | M-11 signed | List v1.1 |
| 9 | Receipt foundation + cupom | purchaseStore, `/receipt`, confirm → snapshot lines | Open cupom + total | Receipt kickoff |
| 10 | Receipt history + v1.2 | Archive trips, hardening, release notes | v1.2.0 tag | Cupom usable |

**Prioritization logic:** value first (core math), then list, then receipt as the “cupom” act after confirm. Handoff and snapshot accounting beat multi-list / cart metaphors.

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
| M-06 | List Track Approved | Freeze list vision | Shopping-list brief + architecture + backlog approved | Docs + Owner sign-off | Owner |
| M-07 | List Shell Ready | Router + list store | `/` + `/compare` nav; persisted empty-capable list | Preview + SL-01–SL-04 | Owner |
| M-08 | Checklist Usable | Buy flow without compare | Add/check/price/progress on phone | Screenshots + SL-05–SL-10 | Owner |
| M-09 | Handoff Complete | List ↔ Compare loop | Seed + apply winner price | Demo + SL-11–SL-14 | Owner |
| M-10 | List MVP Released | Public v1.1 | Offline/a11y/docs for both modes; tag | Release notes + URL | Owner |
| M-11 | Receipt Track Approved | Freeze receipt vision | Receipt brief + architecture + backlog approved | Docs + Owner sign-off | Owner |
| M-12 | Purchase Foundation | Store + route + migration | Open purchase persist; `/receipt` nav; v1.1 migration | RC-01–RC-04 | Owner |
| M-13 | Cupom Usable | Confirm → receipt total | Pending list + cupom + end purchase | RC-05–RC-10 | Owner |
| M-14 | Receipt Released | Public v1.2 | History + offline/a11y + tag | RC-11–RC-14 | Owner |

Each milestone is gated: if criteria fail, the project stays in the milestone until fixed.

---

# 4. Milestone × Gate Map

- M-01 → Gate: all 4 kickoff docs present and approved.
- M-02 → Gate: Sprint Zero checklist (repo/tooling/docs/standards/preview).
- M-03 → Gate: MVP acceptance (BRL cases: 2 L @ 10.00 vs 1.5 L @ 7.50 → cheaper per liter wins).
- M-04 → Gate: theme/internationalization/history acceptance + keyboard accessibility pass.
- M-05 → Gate: Definition of Done + offline airplane test + Lighthouse + README.
- M-06 → Gate: `shopping-list-brief.md` + `shopping-list-architecture.md` + `shopping-list-backlog.md` approved.
- M-07 → Gate: bottom nav + persisted list store (SL-01–SL-04).
- M-08 → Gate: checklist buy/price flow (SL-05–SL-10).
- M-09 → Gate: handoff apply-winner (SL-11–SL-14).
- M-10 → Gate: list DoD + offline + README module section + tag.
- M-11 → Gate: `receipt-brief.md` + `receipt-architecture.md` + `receipt-backlog.md` approved.
- M-12 → Gate: purchaseStore + `/receipt` + migration (RC-01–RC-04).
- M-13 → Gate: confirm → cupom + end purchase (RC-05–RC-10).
- M-14 → Gate: history + hardening + v1.2 tag (RC-11–RC-14).

---

*Calculator: `initial-backlog.md`. List: `shopping-list-backlog.md`. Receipt: `receipt-backlog.md`.*
