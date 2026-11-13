import type { ListItem } from '../../list/store/listStore'
import { useListStore } from '../../list/store/listStore'
import type { PurchaseLine } from '../store/purchaseStore'
import { usePurchaseStore } from '../store/purchaseStore'

export type MigratableListItem = Pick<
  ListItem,
  'id' | 'name' | 'status' | 'paidPrice' | 'paidQuantity' | 'paidUnit' | 'preferredUnit' | 'updatedAt'
>

/**
 * Pure migration: done items with a paid price become purchase lines;
 * all done items are stripped so the list is pending-only.
 * Idempotent when `alreadyMigrated` is true.
 */
export function planListV11Migration(
  items: readonly MigratableListItem[],
  alreadyMigrated: boolean,
): { readonly lines: readonly PurchaseLine[]; readonly remainingItems: readonly MigratableListItem[] } {
  if (alreadyMigrated) {
    return { lines: [], remainingItems: items }
  }

  const lines: PurchaseLine[] = []
  for (const item of items) {
    if (item.status !== 'done') continue
    if (item.paidPrice === undefined) continue
    if (!Number.isFinite(item.paidPrice) || item.paidPrice < 0) continue
    lines.push({
      id: crypto.randomUUID(),
      name: item.name,
      quantity: item.paidQuantity ?? 1,
      unit: item.paidUnit ?? item.preferredUnit ?? 'un',
      price: item.paidPrice,
      sourceItemId: item.id,
      addedAt: item.updatedAt,
    })
  }

  const remainingItems = items.filter((item) => item.status !== 'done')
  return { lines, remainingItems }
}

/**
 * One-shot side effect: copy v1.1 done+price items into the open purchase,
 * strip done items from the list, set `migratedFromListV11`.
 * Safe to call repeatedly — no double count.
 */
export function applyListV11Migration(): void {
  const purchase = usePurchaseStore.getState()
  if (purchase.migratedFromListV11) return

  const { items } = useListStore.getState()
  const { lines, remainingItems } = planListV11Migration(items, false)

  usePurchaseStore.setState((state) => ({
    migratedFromListV11: true,
    open: {
      ...state.open,
      lines: [...state.open.lines, ...lines],
    },
  }))

  useListStore.setState({ items: remainingItems as ListItem[] })
}
