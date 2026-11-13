# ARCHITECTURE ADDENDUM — Shopping List module

**Status:** Implemented (v1.1 — M-07–M-09 code; M-10 docs/hardening)  
**Date:** 2026-11-13  
**Related:** `architecture-review.md` (AD-01–AD-06), `shopping-list-brief.md` v0.1.0

---

# 1. Goal

Extend the modular SPA+PWA with a second feature slice — `features/list` — without rewriting the calculator. Comparison math stays in `features/calculator/lib`. The list **orchestrates** navigation and applies results; it does not reimplement unit prices.

---

# 2. Information architecture

```text
/                 → ListPage (mature-product home)
/compare          → CalculatorPage (independent; existing UX)
/compare?itemId=… → Calculator seeded from list item (handoff)
```

**Chrome**

- App shell: header prefs (theme / locale / offline) shared.
- **Bottom nav:** List | Compare (two destinations only for MVP).
- **Item sheet:** modal/sheet over List — Mark bought, Compare, Edit, Delete.

**Justification:** Two top-level jobs match the mental model. Sheets keep buy/price cheap; Compare stays a full route so the sticky results pattern and history panel keep working.

---

# 3. Target folder structure (delta)

```text
src/
  app/
    App.tsx                 # router outlet + bottom nav
    routes.tsx              # / and /compare
  features/
    calculator/             # UNCHANGED domain; page accepts optional seed/return
      CalculatorPage.tsx
      …
    list/
      ListPage.tsx
      components/
        ListHeader.tsx      # progress: done/total + spend
        ListItemRow.tsx
        ItemSheet.tsx       # buy / compare / edit
        AddItemField.tsx
        ApplyPriceDialog.tsx
      hooks/
        useList.ts
      store/
        listStore.ts        # zustand + persist
      lib/
        listTotals.ts       # pure spend / progress helpers + tests
  components/ui/
    BottomNav.tsx
    Sheet.tsx               # focus trap, dismiss
```

Router: prefer **React Router** (lightweight data-router or createBrowserRouter) — only dependency added for this track. Hash router is acceptable if static-host deep links prove awkward; default to browser history + Vercel rewrites to `index.html` (already SPA-friendly).

---

# 4. Domain model (list)

```ts
type ListItemStatus = 'todo' | 'done'

type ListItem = {
  id: string
  name: string
  preferredUnit?: Unit  // optional hint when opening Compare
  status: ListItemStatus
  paidPrice?: number    // major currency units; cents rules same as calculator
  paidQuantity?: number
  paidUnit?: Unit
  updatedAt: string     // ISO
}

type ListState = {
  items: readonly ListItem[]
  addItem: (name: string) => void
  updateItem: (id: string, patch: Partial<Omit<ListItem, 'id'>>) => void
  removeItem: (id: string) => void
  markBought: (id: string, paid?: { price: number; quantity?: number; unit?: Unit }) => void
  clearDone: () => void
  clearAll: () => void
}
```

Derived (pure, not stored): `progress = { done, total }`, `spend = sum(paidPrice of done items with price)`.

---

# 5. Compare handoff protocol

| Step | Mechanism |
| ---- | --------- |
| List → Compare | Navigate to `/compare?itemId=<id>` (and optional `name=` fallback). Calculator reads `itemId`, loads name/unit from `listStore`, seeds first product label (does not invent shelf prices). |
| Working state | Calculator store remains aisle-scratchpad; do **not** persist handoff mid-flight into list. |
| Compare → List | CTA **Use this price on the list** opens apply dialog: (A) set price + mark done, or (B) set price only. Writes via `listStore.markBought` / `updateItem`, then `navigate('/')` focusing the item. |
| Cancel | Back / nav to List leaves list item unchanged. |
| Orphan `itemId` | If id missing, Compare runs standalone (ignore param). |

**AD-07:** List never imports ranking UI. It may import pure helpers only if needed; prefer calling list store after reading winner from calculator selectors.

**AD-08:** Calculator stays mountable with empty list and without query params (portfolio / quick path).

---

# 6. State strategy

| Store | Persist | Notes |
| ----- | ------- | ----- |
| `listStore` | Yes (`prices-list`) | Items only |
| `calculatorStore` | Yes (existing) | Scratch comparison; handoff seeds labels ephemerally |
| `historyStore` | Yes (existing) | Unrelated to list MVP |
| Preferences / locale | Existing | Shared |

Avoid a global “session” store until a second handoff appears. Query params + listStore are enough.

---

# 7. UI composition rules

- List rows: checkbox + name + optional muted price; not cards-in-cards.  
- Progress in sticky/header region; not a dashboard of widgets.  
- Item sheet: one column, primary button Mark bought, secondary Compare.  
- Apply-price dialog: show winner unit price + shelf price fields already chosen; two explicit actions.  
- Reuse `TextField`, `SegmentedControl`, focus styles, `formatPrice`.

---

# 8. Risks & mitigations

| Risk | Mitigation |
| ---- | ---------- |
| Router + PWA navigateFallback fights deep links | Keep Workbox `navigateFallback: index.html`; test `/compare` cold start offline |
| Calculator persist overwrites handoff seed | Seed after hydrate; or clear products when `itemId` present |
| Float money on list spend | Reuse `toCents` from `units.ts` for sums |
| Bottom nav + sticky Compare results clash | On List route, no compare sticky; on Compare, nav remains |

---

# 9. Decisions to record

| ID | Decision | Justification |
| -- | -------- | ------------- |
| AD-07 | Feature-sliced `list` + router; calculator untouched as domain owner | Clear boundaries; matches brief mental model |
| AD-08 | Compare independently routable | Portfolio + quick aisle use |
| AD-09 | Handoff via `itemId` query + apply dialog | Minimal protocol; testable; no backend |
| AD-10 | Single active list in MVP | Defers multi-list complexity |

---

# 10. Review checklist

- [x] IA and routes defined  
- [x] Folder delta defined  
- [x] Domain model sketched  
- [x] Handoff protocol defined  
- [x] Decisions AD-07–AD-10 recorded  
- [ ] Owner approval  

---

*Next: implement BottomNav + router shell (SL-01) after backlog approval.*
