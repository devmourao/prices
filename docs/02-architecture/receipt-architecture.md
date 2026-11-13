# ARCHITECTURE ADDENDUM — Receipt / Purchases module

**Status:** Approved (M-11)  
**Date:** 2026-11-13  
**Related:** `shopping-list-architecture.md` (AD-07–AD-10), `receipt-brief.md` v0.1.0

---

# 1. Goal

Introduce a **purchase receipt** feature slice that records confirmed buys as **immutable snapshot lines**, keeps the List as **pending work**, and leaves Compare as a pure decision tool. Totals use integer cents (reuse `toCents`).

**Model B (chosen):** confirming a buy always appends a `PurchaseLine` to the open purchase and removes the item from the pending list. Receipt totals do not derive from list `done` state.

---

# 2. Information architecture

```text
/                 → ListPage (pending items only)
/compare          → CalculatorPage (+ optional itemId handoff)
/compare?itemId=… → seed + apply → confirmPurchase
/receipt          → ReceiptPage (open cupom + total)
/receipt/history  → optional; or sheet/section on Receipt (MVP: section)
```

**Bottom nav (three):** List | Compare | Receipt.

**Chrome:** shared theme/locale/offline; sticky total only on Receipt.

---

# 3. Domain model

```ts
type PurchaseLine = {
  id: string
  name: string
  quantity: number
  unit: Unit
  price: number          // shelf / line price in major units
  unitPrice?: number     // optional display aid
  sourceItemId?: string  // list item id if came from list
  addedAt: string        // ISO
}

type OpenPurchase = {
  id: string
  startedAt: string
  lines: readonly PurchaseLine[]
}

type ClosedPurchase = OpenPurchase & {
  closedAt: string
  totalCents: number     // frozen at close
}

type PurchaseState = {
  open: OpenPurchase
  history: readonly ClosedPurchase[]  // newest first, cap 20
  confirmPurchase: (input: ConfirmPurchaseInput) => void
  removeLine: (lineId: string) => void
  endPurchase: () => boolean
  clearOpen: () => void
}
```

`ConfirmPurchaseInput`: `{ name, price, quantity, unit, sourceItemId? }`  
Side effect: if `sourceItemId` set → `listStore.removeItem(sourceItemId)`.

**Migration from v1.1:** one-shot on load — for each list item with `status === 'done'` and `paidPrice`, create a line, then remove those items (or strip done items after copy). Document in backlog RC-02.

---

# 4. Folder structure (delta)

```text
src/features/purchase/
  ReceiptPage.tsx
  components/
    ReceiptHeader.tsx      # startedAt, End purchase
    ReceiptLines.tsx       # cupom rows
    ReceiptTotal.tsx       # sticky total
    ReceiptHistory.tsx     # archived list
    ConfirmBuySheet.tsx    # optional extract from ItemSheet
  hooks/usePurchase.ts
  store/purchaseStore.ts
  lib/
    purchaseTotals.ts      # sum lines via toCents
    purchaseTotals.test.ts
```

List feature: `markBought` / handoff apply call `confirmPurchase` (or thin `confirmFromListItem` wrapper). Avoid duplicating total logic on the list.

---

# 5. Confirm write path (single door)

```text
UI (ItemSheet | ApplyPriceDialog | future quick-add)
  → confirmPurchase({ name, price, quantity, unit, sourceItemId? })
      → append PurchaseLine to open
      → remove list item if sourceItemId
      → persist both stores
```

**AD-11:** No second code path that sets `list.status = done` with price as the source of spend truth.

Handoff “Apply price only” (no mark bought): **does not** create a purchase line (stays on list as pending with optional draft price — or drop “price only” if it conflicts; prefer keeping price-only as list annotation without receipt until confirm).

Recommendation for v1.2:  
- **Apply and mark bought** → `confirmPurchase`.  
- **Apply price only** → update pending item fields only (no receipt line).

---

# 6. Totals

```ts
function lineCents(line: PurchaseLine): number {
  return toCents(line.price) // line price is what was paid for that pack
}
function purchaseTotalCents(lines: readonly PurchaseLine[]): number {
  return lines.reduce((sum, line) => sum + lineCents(line), 0)
}
```

Display via existing `formatPrice`. If product later needs `price × qty`, define explicitly; MVP treats `price` as **amount paid for the line** (as today’s mark-bought).

---

# 7. UI composition

- Receipt rows: tabular layout (`grid` / flex); muted timestamp optional.  
- Total: large type, sticky above bottom nav (`bottom-20`).  
- Empty open receipt: “Confirm items from the list to build your receipt.”  
- End purchase: confirm dialog; disabled when `lines.length === 0`.  
- History: tappable archived totals → read-only cupom sheet.

---

# 8. Decisions

| ID | Decision | Justification |
| -- | -------- | ------------- |
| AD-11 | Snapshot purchase lines (model B) | Stable cupom; list can change without rewriting history |
| AD-12 | Three-destination nav (List / Compare / Receipt) | Matches three jobs; avoids cart metaphor |
| AD-13 | Single `confirmPurchase` write path | Prevents double accounting |
| AD-14 | End purchase archives open receipt | Separates trips without multi-list complexity |

---

# 9. Risks & mitigations

| Risk | Mitigation |
| ---- | ---------- |
| Persist migration bugs | RC-02 migration + tests with fixtures |
| Nav label length (PT “Recibo”) | Short labels; icons + text |
| Handoff apply semantics | Explicit matrix in AD-13 companion (bought vs price-only) |
| PWA deep link `/receipt` | Existing SPA rewrites |

---

# 10. Review checklist

- [x] IA + routes  
- [x] Model B domain  
- [x] Single confirm path  
- [x] AD-11–AD-14  
- [x] Owner approval (PR #11)  

---

*Shipped through Sprint R2 (history UI + v1.2 docs). Tag `v1.2.0` after M-14 merge.*
