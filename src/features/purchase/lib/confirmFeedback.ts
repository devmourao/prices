import type { ListItem } from '../../list/store/listStore'
import { useListStore } from '../../list/store/listStore'
import { purchaseTotal } from './purchaseTotals'
import { usePurchaseStore, type ConfirmPurchaseInput } from '../store/purchaseStore'

export const RECEIPT_CONFIRM_EVENT = 'prices:receipt-confirm'
export const RECEIPT_UNDO_EVENT = 'prices:receipt-undo'

export type ReceiptConfirmDetail = {
  readonly name: string
  readonly total: number
  readonly canUndo: boolean
}

type PendingUndo = {
  readonly lineId: string
  readonly listItem?: ListItem
}

let pendingUndo: PendingUndo | null = null

/**
 * Single door for UI confirms: writes a purchase line and announces the new total.
 * Keeps one-shot undo (line + optional restored list item) until timeout/next confirm.
 */
export function confirmPurchaseWithFeedback(input: ConfirmPurchaseInput): void {
  const listItem =
    input.sourceItemId === undefined
      ? undefined
      : useListStore.getState().items.find((item) => item.id === input.sourceItemId)

  const snapshot: ListItem | undefined =
    listItem === undefined
      ? undefined
      : {
          ...listItem,
          preferredUnit: listItem.preferredUnit,
          paidPrice: listItem.paidPrice,
          paidQuantity: listItem.paidQuantity,
          paidUnit: listItem.paidUnit,
        }

  usePurchaseStore.getState().confirmPurchase(input)

  const lines = usePurchaseStore.getState().open.lines
  const line = lines[lines.length - 1]
  pendingUndo =
    line === undefined
      ? null
      : {
          lineId: line.id,
          listItem: snapshot,
        }

  const total = purchaseTotal(lines)
  window.dispatchEvent(
    new CustomEvent<ReceiptConfirmDetail>(RECEIPT_CONFIRM_EVENT, {
      detail: {
        name: input.name.trim(),
        total,
        canUndo: pendingUndo !== null,
      },
    }),
  )
}

/** Reverts the last confirmPurchaseWithFeedback (line + list item). */
export function undoLastConfirm(): boolean {
  if (pendingUndo === null) return false
  const { lineId, listItem } = pendingUndo
  pendingUndo = null
  usePurchaseStore.getState().removeLine(lineId)
  if (listItem !== undefined) {
    useListStore.getState().restoreItem(listItem)
  }
  window.dispatchEvent(new CustomEvent(RECEIPT_UNDO_EVENT))
  return true
}

export function clearPendingUndo(): void {
  pendingUndo = null
}
