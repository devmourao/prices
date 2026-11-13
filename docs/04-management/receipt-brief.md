# PRODUCT BRIEF — Receipt / Purchases module (`prices` v1.2+)

**Version:** 0.1.0  
**Status:** Proposed — Pending Owner Approval  
**Date:** 2026-11-13  
**Owner:** Marcos Ferreira Mourão  
**Related:** `shopping-list-brief.md`, `shopping-list-architecture.md`, `receipt-backlog.md`, `docs/02-architecture/receipt-architecture.md`

---

# 1. Identification

| Field | Information |
| ----- | ----------- |
| Module name | Receipt (Compras / Recibo) |
| Product code | prices / receipt |
| Track | Mature-product extension after list v1.1 |
| Depends on | List v1.1 (checklist + mark bought + compare handoff) |

---

# 2. Overview

## Summary

After planning on the **List** and deciding on **Compare**, the shopper needs a clear place for **what was actually bought** — with price, quantity, and a running total — presented like a supermarket receipt (cupom), not like another checklist.

This module introduces an **open purchase (recibo atual)** fed only when the user confirms a buy (price + quantity). Confirmed lines are **immutable snapshots** (model B). The List stays focused on **what is still missing**. Compare stays a decision assistant.

## Elevator pitch

> Make the list, confirm each item in the aisle with price and quantity, then open Receipt to see a cupom-style summary and the total — offline, same PWA.

---

# 3. Problem / opportunity

| Problem | Opportunity |
| ------- | ----------- |
| “Done” items with prices are buried in a strikethrough list — hard to read as a bill | Dedicated receipt view: name · qty · price · total |
| Editing/removing list items can distort “what I spent” | Snapshot lines on confirm; list and receipt diverge by design |
| Shoppers want “how much am I spending so far?” mid-trip | Sticky receipt total + optional chip on List linking to Receipt |
| “Cart” metaphor suggests e-commerce checkout | Name it **Receipt / Compras**, not Cart |

---

# 4. Mental model (non-negotiable)

| Surface | Job |
| ------- | --- |
| **List** | What is still left to buy (plan / execute). |
| **Compare** | Which pack is better value (decide). |
| **Receipt** | What entered the bag + how much it costs (record / review). |

**Confirm buy** is the bridge: List (or handoff apply) → write a `PurchaseLine` → remove or drop from pending list → Receipt updates.

Do **not** treat Receipt as a place to “add products without confirming.” No e-commerce cart.

---

# 5. Primary flows

### F1 — Plan → confirm → see receipt

1. Build list on `/`.  
2. In aisle: open item → Mark bought → price (required for receipt) + quantity (default 1) + unit.  
3. On save: create purchase line; item leaves pending list.  
4. Open **Receipt**: cupom lines + running total.

### F2 — Confirm via Compare handoff

1. Item → Compare → pick winner → Apply and mark bought.  
2. Same as F1: snapshot line uses winner shelf price/qty/unit.  
3. Land on List or optionally Receipt (default: List with toast “Added to receipt · total …”).

### F3 — Review & close trip

1. Receipt → scan lines → sticky total.  
2. **End purchase** → archive open receipt into history (cap 20) → new empty open receipt.  
3. Optional: undo last line / remove line from open receipt only (before end).

### F4 — History (P1)

1. Receipt → past purchases → open archived cupom (read-only).

---

# 6. Scope

## In scope (Receipt MVP)

- Open purchase with snapshot lines (`name`, `quantity`, `unit`, `price`, `addedAt`, optional `sourceItemId` / `unitPrice`).
- Confirm-buy path writes to purchase store (refactor mark-bought / handoff apply).
- List shows **pending only** (or pending + light link to receipt); no dual “done+price” as source of truth for totals.
- Receipt page: cupom layout, line list, sticky total (cents-safe).
- Bottom nav: **List | Compare | Receipt** (three destinations).
- End purchase → history (capped).
- Remove line from open receipt; optional undo last.
- i18n en + pt-BR; offline; a11y baseline (landmarks, focus, live total).

## Out of scope

- Payment, real fiscal NF-e, store APIs.  
- Multi-currency / FX.  
- Editing historical receipts.  
- “Add to cart” without going through confirm.  
- Budgets, coupons, shared carts, accounts/sync.  
- Fourth nav item or analytics dashboard.

---

# 7. UX / UI principles

1. **One job per screen** — List ≠ cupom; Receipt ≠ form.  
2. **Confirm is a short sheet** — price required to enter receipt; qty defaults to 1.  
3. **Cupom typography** — monospace-friendly or tabular nums; name left, amounts right; no marketing cards.  
4. **Sticky total** on Receipt; List may show a compact “Receipt · R$ X” chip.  
5. **Immediate feedback** after confirm (toast or brief status).  
6. **End purchase** is explicit — avoids mixing two supermarket trips.  
7. **Thumb zone** — nav + total in easy reach; targets ≥ 44px.  
8. **Offline first** — same PWA bar as v1.1.

---

# 8. Success criteria

- Confirm 5 items with prices; Receipt shows 5 lines and correct total (cents).  
- Pending list no longer shows those items.  
- End purchase clears open receipt and keeps archive entry.  
- Compare-only path still works with empty list and empty receipt.  
- Airplane mode: confirm + receipt + end purchase after first load.  
- Lighthouse mobile a11y ≥ 95 (same bar).

---

# 9. Risks

| Risk | Mitigation |
| ---- | ---------- |
| Users confuse List “done” with Receipt | Migrate to pending-only list; copy: “Goes to receipt” |
| Double-write bugs (list done + purchase line) | Single write path in one action (`confirmPurchase`) |
| Nav overcrowding | Exactly three items; short labels List / Compare / Receipt |
| Totals drift | Integer cents; pure `purchaseTotals` tests |
| Scope creep into “cart checkout” | Out-of-scope list; naming “Receipt” |

---

# 10. Approval

| Role | Name | Date |
| ---- | ---- | ---- |
| Author | Frontend Architect (agent-assisted) | 2026-11-13 |
| Approver | Marcos Ferreira Mourão | TBD — Pending |

---

# 11. Revision history

| Version | Date | Change |
| ------- | ---- | ------ |
| 0.1.0 | 2026-11-13 | Initial receipt brief (model B snapshots, cupom UX) |

---

*Next: `receipt-architecture.md` → `receipt-backlog.md` → Owner approval (M-11) → implementation.*
