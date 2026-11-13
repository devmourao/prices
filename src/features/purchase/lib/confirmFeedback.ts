import { purchaseTotal } from './purchaseTotals'
import { usePurchaseStore, type ConfirmPurchaseInput } from '../store/purchaseStore'

export const RECEIPT_CONFIRM_EVENT = 'prices:receipt-confirm'

export type ReceiptConfirmDetail = {
  readonly name: string
  readonly total: number
}

/**
 * Single door for UI confirms: writes a purchase line and announces the new total.
 */
export function confirmPurchaseWithFeedback(input: ConfirmPurchaseInput): void {
  usePurchaseStore.getState().confirmPurchase(input)
  const total = purchaseTotal(usePurchaseStore.getState().open.lines)
  window.dispatchEvent(
    new CustomEvent<ReceiptConfirmDetail>(RECEIPT_CONFIRM_EVENT, {
      detail: { name: input.name.trim(), total },
    }),
  )
}
