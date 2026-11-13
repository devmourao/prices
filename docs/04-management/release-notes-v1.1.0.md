# Release Notes — prices v1.1.0

**Date:** 2026-11-13  
**Tag:** `v1.1.0` (create after this PR merges to the release branch)  
**Demo:** https://prices.mourao.info

---

## Highlights

Shopping list module ships as an additive track on top of the v1.0 cost-benefit calculator.

- **List (`/`)** — plan items, check them off, record paid price, track progress and spend offline.
- **Compare (`/compare`)** — same unit-price calculator as v1.0, still usable alone.
- **Handoff** — from a list item, compare shelf options and apply the winner price back to the list (mark bought or price only).

## What’s new since calculator v1.0

| Area | Change |
| ---- | ------ |
| Routing | React Router: `/` List, `/compare` Calculator, bottom nav |
| List store | Zustand persist (`prices-list`): CRUD, mark bought, clear |
| Totals | Cents-safe progress and spend helpers |
| Checklist UX | Add field, checkbox rows, bottom sheet (buy / compare / edit / delete) |
| Handoff | `?itemId=` seed, apply dialog, back-to-list |
| PWA | SPA rewrites (`vercel.json`, `_redirects`) for deep links |
| A11y | `<main>` landmark, sheet focus trap + Esc, live progress |
| Tests | 67+ Vitest/Testing Library cases |

## How to demo (&lt; 5 minutes)

1. Open `/` → add Milk, Bread, Rice.  
2. Check off Bread; open Milk → Mark bought → price `5.50` → Save.  
3. Open Rice → Compare options → enter two pack prices → **Use this price on the list** → Apply and mark bought.  
4. Switch to Compare via bottom nav without a list item — standalone calculator still works.  
5. Toggle EN/PT-BR and light/dark; reload — list and prefs persist.

## Upgrade / install

```bash
npm install
npm run build
npx vite preview
```

PWA: visit once online, then airplane-mode test both routes (see `list-mvp-verification.md`).

## Tagging

After merge to the protected release branch:

```bash
git tag -a v1.1.0 -m "prices v1.1.0 — shopping list + compare handoff"
git push origin v1.1.0
```

## Follow-ups (not in v1.1.0)

Multiple lists, categories, sync/accounts, barcode/OCR — see `shopping-list-backlog.md` SL-20+.
