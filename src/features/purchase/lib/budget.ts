import { toCents } from '../../calculator/lib/units'

export type BudgetStatus = {
  readonly budget: number
  readonly spent: number
  readonly remaining: number
  readonly over: boolean
  readonly ratio: number
}

/**
 * Compares open-purchase spend to a budget (major units, cents-safe).
 * `budget` must be finite and > 0.
 */
export function budgetStatus(budget: number, spent: number): BudgetStatus | null {
  if (!Number.isFinite(budget) || budget <= 0) return null
  if (!Number.isFinite(spent) || spent < 0) return null
  const budgetCents = toCents(budget)
  const spentCents = toCents(spent)
  const remainingCents = budgetCents - spentCents
  return {
    budget,
    spent,
    remaining: remainingCents / 100,
    over: remainingCents < 0,
    ratio: budgetCents === 0 ? 1 : Math.min(spentCents / budgetCents, 1),
  }
}
