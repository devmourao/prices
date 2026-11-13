# PRODUCT BRIEF — Shopping List module (`prices` v1.x+)

**Version:** 0.1.0  
**Status:** Proposed — Pending Owner Approval  
**Date:** 2026-11-13  
**Owner:** Marcos Ferreira Mourão  
**Related:** `project-brief.md` v0.2.1, `CB-29`, `shopping-list-backlog.md`, `docs/02-architecture/shopping-list-architecture.md`

---

# 1. Identification

| Field | Information |
| ----- | ----------- |
| Module name | Shopping List |
| Product code | prices / list |
| Track | Mature-product track (extends the portfolio calculator) |
| Depends on | Calculator v1.0 (comparison core, i18n, theme, PWA offline) |

---

# 2. Overview

## Summary

The Shopping List module turns `prices` from a one-shot aisle calculator into a **purchase companion**: the shopper plans items at home (or on the way), checks them off in the store, records the paid price, and — when facing two package sizes — opens the **same** cost-benefit calculator already shipped, then brings the winning price back onto the list item.

The calculator remains **independently reachable**. The list does not own comparison math; it **invokes** comparison as a decision assistant for one item.

## Elevator pitch

> Build a list before you shop. In the aisle, tap an item to check it off and enter the price — or open Compare to pick the better pack, then use that price on the list. Compare still works alone when you only need a quick unit-price check.

---

# 3. Problem / opportunity

| Problem | Opportunity |
| ------- | ----------- |
| The calculator answers “which pack is cheaper?” but not “what do I still need?” | List = plan + progress; calculator = decision tool at the shelf. |
| Shoppers juggle notes apps + mental math + weak signal | One offline PWA: checklist + compare + paid total. |
| Returning from compare into a notes app loses context | Deep-link handoff: item → compare → “Use this price on the list”. |

---

# 4. Mental model (non-negotiable)

| Surface | Job |
| ------- | --- |
| **List** | Plan and execute the trip (what’s left). Confirmed buys feed the Receipt track (v1.2). |
| **Compare** | Decide between package options (unit price). |
| **Receipt** | What was bought + total as a cupom (see `receipt-brief.md`). |
| **Item sheet** | Bridge: buy / compare / edit — never dump ranking into the checklist. |

Three entry points:

1. Open **List** (default for the mature product).
2. Open **Compare** directly (fast path / portfolio demo).
3. From an item: **Compare options** → return with the chosen price applied.

---

# 5. Objectives

## General

Ship a mobile-first, offline shopping list that uses the existing calculator as an optional decision step without coupling the two UIs.

## Specific

- Create / edit / check off list items with minimal taps.
- Confirm purchase with optional price (+ quantity/unit when useful).
- Open Compare pre-labeled with the item name; apply winner price back to the item.
- Keep `/compare` (or equivalent) usable with zero list state.
- Persist list locally; work offline after first load.
- Reuse theme, i18n (en + pt-BR), a11y, and PWA baselines.

---

# 6. Scope

## In scope (List MVP)

- Single active list (v1): add / rename / remove items; optional notes short text later if needed.
- Item fields: name (required), optional preferred unit, status (`todo` | `done`), optional paid price, optional paid quantity/unit.
- Checklist UI with progress summary (count done / total, running spend).
- Item bottom sheet: Mark bought (+ price), Compare options, Edit, Delete.
- Compare handoff: seed calculator with item label; CTA **Use this price on the list** (apply winner → mark done or only set price — explicit choice).
- Bottom navigation: **List** | **Compare**.
- Local persistence (`localStorage` / Zustand persist); clear-list action.
- Empty states: empty list CTA; Compare still available from nav.

## Out of scope (follow-ups / explicit non-goals for MVP)

- Accounts, sync, multi-device.
- Multiple lists, templates, recipes, categories, aisle sorting.
- Barcode / OCR / store APIs / live FX.
- Budgets, coupons, brand suggestions, shared lists.
- Inline mini-calculator per row (pollutes scanability).
- Backend.

---

# 7. Primary flows

### F1 — Plan at home

1. Open List → Add item (name only) → repeat.  
2. Progress shows `0 / N`.

### F2 — Buy without comparing

1. Tap item → sheet → Mark bought → enter price (optional quantity/unit) → Done.  
2. Item checked; spend updates.

### F3 — Buy with compare (decision assist)

1. Tap item → Compare options.  
2. Calculator opens with label prefilled; user enters 2+ shelf options.  
3. Sees winner → **Use this price on the list**.  
4. Confirm: apply price + mark bought **or** apply price only.  
5. Returns to List; item updated.

### F4 — Compare only

1. Bottom nav → Compare (or direct URL).  
2. Same calculator UX as v1.0; no list required.  
3. Optional secondary action later: “Save winner to list” (P2).

---

# 8. UX / UI principles (aisle-ready)

1. **One job per screen** — checklist ≠ ranking.  
2. **Sheets over deep stacks** — buy/price in a bottom sheet; Compare as a full route with obvious Back to list.  
3. **Thumb zone** — primary actions and bottom nav within easy reach; targets ≥ 44px.  
4. **Defer price** — creating an item never requires price; price belongs at the shelf.  
5. **Cheap confirmation** — large checkbox / clear “Mark bought”; price can be step 2.  
6. **Honest progress** — always visible done/total and spend.  
7. **Offline first** — every MVP feature works in airplane mode after first visit.  
8. **No purple-dashboard clutter** — keep the existing calm surface language; list rows are not marketing cards.  
9. **i18n + a11y** — no hardcoded strings; sheet focus trap / restore; `aria-live` for progress when useful.

---

# 9. Success criteria (List MVP)

- Add 5 items and check 3 off (with prices) in under a minute on a 360px-wide phone.  
- From an item, reach a Compare result in ≤ 3 taps after typing shelf prices (same bar as calculator).  
- Applying the winner updates the list item without retyping the name.  
- Compare remains usable with an empty list.  
- State survives reload; airplane-mode flow works after first load.  
- Lighthouse mobile: Performance ≥ 90, Accessibility ≥ 95, Best Practices ≥ 90 (same bar).

---

# 10. Risks

| Risk | Mitigation |
| ---- | ---------- |
| List and Compare merge into one confusing screen | Enforce mental model; architecture gate on routes/sheets |
| Handoff loses context | Typed navigation state + return CTA; remount-safe calculator seed |
| Scope creep (categories, sync, OCR) | Out-of-scope list; backlog follow-ups gated |
| Dual persistence bugs | Feature stores isolated; pure domain libs; tests for handoff |
| Portfolio story dilutes | Keep Compare deep-linkable; README documents both modes |

---

# 11. Stakeholders

Same as core product: Owner / developer; recruiters (portfolio); supermarket shoppers (end users).

---

# 12. Approval

| Role | Name | Date |
| ---- | ---- | ---- |
| Author | Frontend Architect (agent-assisted) | 2026-11-13 |
| Approver | Marcos Ferreira Mourão | TBD — Pending |

---

# 13. Revision history

| Version | Date | Change |
| ------- | ---- | ------ |
| 0.1.0 | 2026-11-13 | Initial shopping-list brief from UX evaluation (CB-29 promoted to planned track) |

---

*Next: `shopping-list-architecture.md` → `shopping-list-backlog.md` → Owner approval (M-06) → implementation sprints.*
