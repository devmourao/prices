# BACKLOG — Shopping List module

**Status:** Active — M-06–M-09 done; Sprint L3 (hardening / v1.1 docs)  
**Date:** 2026-11-13  
**Related:** `shopping-list-brief.md` v0.1.0, `shopping-list-architecture.md`, `initial-backlog.md` (CB-29)  
**Convention:** `SL-NN` = shopping-list backlog item. Priority: P0 / P1 / P2.  
**Traceability:** Promotes **CB-29** from “future research” to an approved product track after Owner sign-off on M-06.

> Work top-down. Calculator v1.0 remains shippable on `/compare`. List home is `/`.

---

## M-06 — List track approved (docs gate)

| ID | Title | Category | Priority | Description | Acceptance Criteria |
| -- | ----- | -------- | -------- | ----------- | ------------------- |
| SL-00 | Approve list brief + architecture + backlog | Documentation | P0 | Owner reviews shopping-list docs and AD-07–AD-10. | Written approval; CB-29 marked promoted in `initial-backlog.md` |

---

## Sprint L0 — Shell (Milestone M-07)

| ID | Title | Category | Priority | Description | Acceptance Criteria |
| -- | ----- | -------- | -------- | ----------- | ------------------- |
| SL-01 | Add router + bottom nav | Infrastructure | P0 | React Router: `/` List, `/compare` Calculator; `BottomNav` List \| Compare; Vercel/SPA fallback verified. | Deep link `/compare` works online/offline after first load; nav keyboard accessible |
| SL-02 | `features/list` skeleton | Configuration | P0 | Folder slice, empty `ListPage`, i18n keys stub, feature flag not required. | `/` renders list shell; no regress on Compare |
| SL-03 | `listStore` + persist | Functionality | P0 | Zustand persist: add/update/remove/clear; `todo`/`done`. | Reload keeps items; unit tests for CRUD |
| SL-04 | Progress + spend pure helpers | Functionality | P0 | `listTotals.ts`: done/total, cents-safe spend. | Tests for empty, partial prices, BRL cents |

---

## Sprint L1 — Checklist MVP (Milestone M-08)

| ID | Title | Category | Priority | Description | Acceptance Criteria |
| -- | ----- | -------- | -------- | ----------- | ------------------- |
| SL-05 | Add item field | Functionality | P0 | Name-only add; Enter / button; focus returns for rapid entry. | 5 items addable quickly on 360px width |
| SL-06 | List rows + check off | Functionality | P0 | Checkbox toggles done; muted style for done; show paid price when set. | Toggle works; a11y name includes state |
| SL-07 | Item bottom sheet | Functionality | P0 | Open on row tap (not only checkbox): Mark bought, Compare, Edit, Delete. | Sheet focus trap; Esc/dismiss restores focus |
| SL-08 | Mark bought + price | Functionality | P0 | Sheet flow: price (`inputMode=decimal`), optional qty/unit; saves via `markBought`. | Empty price allowed; zero price invalid when typed |
| SL-09 | List header progress | Functionality | P0 | `done/total` + formatted spend; empty copy localized. | Updates live; en/pt-BR |
| SL-10 | Clear done / clear all | Functionality | P1 | Destructive confirms via `window.confirm` or inline confirm pattern consistent with app. | Done items removable in batch |

---

## Sprint L2 — Compare handoff (Milestone M-09)

| ID | Title | Category | Priority | Description | Acceptance Criteria |
| -- | ----- | -------- | -------- | ----------- | ------------------- |
| SL-11 | Navigate with `itemId` | Functionality | P0 | Compare options → `/compare?itemId=`; seed label (and preferred unit if any). | Standalone `/compare` unchanged when no param |
| SL-12 | Apply winner to list CTA | Functionality | P0 | After valid ranking: **Use this price on the list**; dialog A mark done+price / B price only; navigate home. | Name never retyped; orphan id → CTA hidden |
| SL-13 | Back to list affordance | Improvement | P0 | Visible control when handoff active; bottom nav still works. | Cancel leaves item untouched |
| SL-14 | Handoff tests | Tests | P0 | Store + component tests for seed and apply paths. | Regression suite green |

---

## Sprint L3 — Hardening (Milestone M-10)

| ID | Title | Category | Priority | Description | Acceptance Criteria |
| -- | ----- | -------- | -------- | ----------- | ------------------- |
| SL-15 | Offline + PWA pass for both routes | Tests | P0 | Airplane mode: list CRUD + compare + handoff return. | Checklist recorded |
| SL-16 | A11y pass (nav, sheet, live progress) | Tests | P0 | Keyboard-only list flow; Lighthouse a11y ≥ 95. | Report or notes saved |
| SL-17 | Docs + README module section | Documentation | P0 | README + screenshots for List and handoff; `llms.txt` paths. | Reviewer can demo both modes in &lt;5 min |
| SL-18 | Tag list MVP (e.g. v1.1.0) | Documentation | P1 | Release notes for list module. | Tag published |

---

## Follow-ups (explicitly not List MVP)

| ID | Title | Priority | Notes |
| -- | ----- | -------- | ----- |
| SL-20 | Multiple lists / list picker | P2 | After single-list evidence |
| SL-21 | Categories or aisle groups | P2 | Only with user pain evidence |
| SL-22 | “Save winner to list” from standalone Compare | P2 | ✅ Creates or matches item by name (post-v1.2) |
| SL-23 | Preferred store / budget cap | P2 | Product track, not portfolio MVP |
| SL-24 | Sync / accounts | P2 | Requires backend — out of current architecture |
| SL-25 | Barcode / OCR | P2 | Remains deferred (was CB-28) |

---

## Traceability

| Brief objective | Items |
| --------------- | ----- |
| Checklist + progress | SL-03–SL-06, SL-09 |
| Buy with price | SL-07–SL-08 |
| Compare handoff | SL-11–SL-14 |
| Independent Compare | SL-01, SL-11 |
| Offline / a11y / docs | SL-15–SL-18 |

| Architecture | Items |
| ------------ | ----- |
| AD-07 feature slice + router | SL-01–SL-02 |
| AD-08 independent Compare | SL-01, SL-11 |
| AD-09 handoff protocol | SL-11–SL-13 |
| AD-10 single list | SL-03; SL-20 deferred |

---

## Suggested milestone map

| Milestone | Gate |
| --------- | ---- |
| M-06 List track approved | SL-00 |
| M-07 Shell ready | SL-01–SL-04 |
| M-08 Checklist usable | SL-05–SL-10 |
| M-09 Handoff complete | SL-11–SL-14 |
| M-10 List MVP released | SL-15–SL-18 |

---

*Ready for: Owner approval (M-06) → Sprint L0 (SL-01).*
