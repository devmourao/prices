# Release Notes — prices v1.2.0

**Date:** 2026-11-13  
**Tag:** `v1.2.0` (create after this PR merges to the release branch)  
**Demo:** https://prices-mauve.vercel.app

---

## Highlights

Receipt / Compras module: confirm buys as immutable cupom lines, keep the list pending-only, and archive finished trips.

- **List (`/`)** — pending items; confirm with price → receipt (qty default 1).
- **Compare (`/compare`)** — same calculator; **Apply and mark bought** writes a purchase line; price-only stays on the list.
- **Receipt (`/receipt`)** — cupom layout, sticky total, remove line, end purchase, past purchases (read-only).

## What’s new since list v1.1

| Area | Change |
| ---- | ------ |
| Routing | Third nav tab + `/receipt` |
| Purchase store | Zustand persist (`prices-purchase`): open lines, history cap 20 |
| Model B | Snapshot `PurchaseLine`s; list no longer source of spend truth |
| Migration | One-shot v1.1 done+price → open receipt |
| Confirm path | ItemSheet + handoff → `confirmPurchase` (single door) |
| UX | List chip, confirm toast, end purchase, history sheet |
| Tests | 90+ Vitest/Testing Library cases |

## How to demo (&lt; 5 minutes)

1. Open `/` → add Milk, Bread, Rice.  
2. Milk → Mark bought → price `5.50` → **Add to receipt** (toast + chip).  
3. Rice → Compare → two packs → **Apply and mark bought**.  
4. Open **Receipt** → see lines + total → remove Bread if present → **End purchase**.  
5. Open **Past purchases** → read-only cupom → Esc.  
6. Toggle EN/PT-BR; airplane-mode reload `/receipt` (see `receipt-mvp-verification.md`).

## Upgrade / install

```bash
npm install
npm run build
npx vite preview
```

Existing v1.1 list data with done+price items migrates once into the open receipt on first load after upgrade.

## Tagging

After merge to the protected release branch:

```bash
git tag -a v1.2.0 -m "prices v1.2.0 — receipt/cupom + purchase history"
git push origin v1.2.0
```

## Follow-ups (not in v1.2.0)

Undo last confirm, export/share receipt, multi-store trips, budget cap — see `receipt-backlog.md` RC-20+.
