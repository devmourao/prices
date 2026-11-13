# BACKLOG — Receipt / Purchases module

**Status:** Active — M-13 done; Sprint R2 (history + v1.2) in progress  
**Date:** 2026-11-13  
**Related:** `receipt-brief.md` v0.1.0, `receipt-architecture.md`  
**Convention:** `RC-NN` = receipt backlog item. Priority: P0 / P1 / P2.

> M-11 approved (plan PR merged). List + Compare v1.1 remain shippable alongside receipt foundation.

---

## M-11 — Receipt track approved

| ID | Title | Category | Priority | Description | Acceptance Criteria |
| -- | ----- | -------- | -------- | ----------- | ------------------- |
| RC-00 | Approve receipt brief + architecture + backlog | Documentation | P0 | Owner reviews model B, three-nav IA, AD-11–AD-14. | ✅ Written approval (PR #11 merged) |

---

## Sprint R0 — Foundation (Milestone M-12)

| ID | Title | Category | Priority | Description | Acceptance Criteria |
| -- | ----- | -------- | -------- | ----------- | ------------------- |
| RC-01 | `purchaseStore` + persist | Functionality | P0 | Open purchase, history cap 20, `confirmPurchase` / `removeLine` / `endPurchase`. | ✅ Unit tests; reload keeps open lines |
| RC-02 | Migrate v1.1 done+price items → lines | Functionality | P0 | One-shot migration; then pending-only list. | ✅ Fixture test; no double count |
| RC-03 | `purchaseTotals` cents helpers | Functionality | P0 | Pure sum + format integration. | ✅ BRL cent cases green |
| RC-04 | Bottom nav third tab + `/receipt` route | Infrastructure | P0 | List \| Compare \| Receipt; SPA fallback OK. | ✅ Deep link `/receipt` works |

---

## Sprint R1 — Cupom UX (Milestone M-13)

| ID | Title | Category | Priority | Description | Acceptance Criteria |
| -- | ----- | -------- | -------- | ----------- | ------------------- |
| RC-05 | `ReceiptPage` cupom layout | Functionality | P0 | Lines + sticky total; empty state. | ✅ Usable at 360px; tabular amounts |
| RC-06 | Wire ItemSheet confirm → `confirmPurchase` | Functionality | P0 | Price required for receipt; qty default 1; remove pending item. | ✅ List shrinks; receipt grows |
| RC-07 | Wire handoff “Apply and mark bought” | Functionality | P0 | Uses winner shelf price/qty/unit. | ✅ Price-only still skips receipt |
| RC-08 | Remove line + End purchase | Functionality | P0 | Confirm end; archive; new empty open. | ✅ History entry has frozen totalCents |
| RC-09 | List chip / link to receipt total | Improvement | P1 | Compact “Receipt · {amount}” when open has lines. | ✅ Navigates to `/receipt` |
| RC-10 | Toast / status after confirm | Improvement | P1 | Localized feedback with new total. | ✅ `aria-live` friendly |

---

## Sprint R2 — History + hardening (Milestone M-14)

| ID | Title | Category | Priority | Description | Acceptance Criteria |
| -- | ----- | -------- | -------- | ----------- | ------------------- |
| RC-11 | Receipt history UI | Functionality | P1 | List archived purchases; open read-only cupom. | ✅ Cap 20; newest first |
| RC-12 | Offline + a11y pass | Tests | P0 | Airplane: confirm → receipt → end; keyboard/nav. | ✅ Checklist recorded (`receipt-mvp-verification.md`) |
| RC-13 | README + release notes v1.2.0 | Documentation | P0 | Third mode documented; demo script. | ✅ Reviewer demos in &lt;5 min |
| RC-14 | Tag v1.2.0 | Documentation | P1 | SemVer tag after M-14 gate. | After merge: `git tag -a v1.2.0` |

---

## Follow-ups (not Receipt MVP)

| ID | Title | Priority | Notes |
| -- | ----- | -------- | ----- |
| RC-20 | Line = unit price × quantity explicit model | P2 | Only if users expect pack×qty |
| RC-21 | Undo last confirm (snackbar) | P2 | |
| RC-22 | Export / share receipt text | P2 | |
| RC-23 | Multi-store or named trips | P2 | Overlaps multi-list |
| RC-24 | Budget cap vs total | P2 | Was SL-23 |

---

## Traceability

| Brief objective | Items |
| --------------- | ----- |
| Snapshot confirm | RC-01, RC-06, RC-07, AD-11/13 |
| Cupom + total | RC-03, RC-05, RC-09 |
| End trip / history | RC-08, RC-11, AD-14 |
| Three-nav IA | RC-04, AD-12 |
| Ship quality | RC-12–RC-14 |

## Milestone map

| Milestone | Gate |
| --------- | ---- |
| M-11 Receipt track approved | RC-00 |
| M-12 Purchase foundation | RC-01–RC-04 |
| M-13 Cupom usable | RC-05–RC-10 |
| M-14 Receipt released (v1.2) | RC-11–RC-14 |

---

*Ready for: M-14 merge → tag `v1.2.0` (RC-14).*
