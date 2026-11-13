import { useMemo } from 'react'
import { purchaseTotal } from '../lib/purchaseTotals'
import { usePurchaseStore } from '../store/purchaseStore'

export function useOpenPurchase() {
  return usePurchaseStore((state) => state.open)
}

export function usePurchaseHistory() {
  return usePurchaseStore((state) => state.history)
}

export function usePurchaseActions() {
  const confirmPurchase = usePurchaseStore((state) => state.confirmPurchase)
  const removeLine = usePurchaseStore((state) => state.removeLine)
  const endPurchase = usePurchaseStore((state) => state.endPurchase)
  const clearOpen = usePurchaseStore((state) => state.clearOpen)
  return { confirmPurchase, removeLine, endPurchase, clearOpen }
}

export function useOpenPurchaseTotal() {
  const open = useOpenPurchase()
  return useMemo(() => purchaseTotal(open.lines), [open.lines])
}
