import { useMemo } from 'react'
import { budgetStatus } from '../lib/budget'
import { purchaseTotal } from '../lib/purchaseTotals'
import { usePurchaseStore } from '../store/purchaseStore'

export function useOpenPurchase() {
  return usePurchaseStore((state) => state.open)
}

export function usePurchaseHistory() {
  return usePurchaseStore((state) => state.history)
}

export function usePurchaseBudget() {
  return usePurchaseStore((state) => state.budget)
}

export function usePurchaseActions() {
  const confirmPurchase = usePurchaseStore((state) => state.confirmPurchase)
  const removeLine = usePurchaseStore((state) => state.removeLine)
  const endPurchase = usePurchaseStore((state) => state.endPurchase)
  const clearOpen = usePurchaseStore((state) => state.clearOpen)
  const setBudget = usePurchaseStore((state) => state.setBudget)
  return { confirmPurchase, removeLine, endPurchase, clearOpen, setBudget }
}

export function useOpenPurchaseTotal() {
  const open = useOpenPurchase()
  return useMemo(() => purchaseTotal(open.lines), [open.lines])
}

export function useBudgetStatus() {
  const budget = usePurchaseBudget()
  const spent = useOpenPurchaseTotal()
  return useMemo(
    () => (budget === null ? null : budgetStatus(budget, spent)),
    [budget, spent],
  )
}
