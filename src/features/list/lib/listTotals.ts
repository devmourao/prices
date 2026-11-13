import { toCents } from '../../calculator/lib/units'

export type ListItemLike = {
  readonly status: 'todo' | 'done'
  readonly paidPrice?: number
}

export type ListProgress = {
  readonly done: number
  readonly total: number
}

/**
 * Counts done vs total items. Empty list → { done: 0, total: 0 }.
 */
export function listProgress(items: readonly ListItemLike[]): ListProgress {
  const total = items.length
  const done = items.reduce((count, item) => count + (item.status === 'done' ? 1 : 0), 0)
  return { done, total }
}

/**
 * Sum of paid prices on done items that have a finite non-negative price.
 * Uses integer cents to avoid BRL float drift; returns major units.
 */
export function listSpend(items: readonly ListItemLike[]): number {
  let cents = 0
  for (const item of items) {
    if (item.status !== 'done') continue
    if (item.paidPrice === undefined) continue
    if (!Number.isFinite(item.paidPrice) || item.paidPrice < 0) continue
    cents += toCents(item.paidPrice)
  }
  return cents / 100
}
