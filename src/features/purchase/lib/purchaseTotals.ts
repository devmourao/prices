import { toCents } from '../../calculator/lib/units'

export type PurchaseLineLike = {
  readonly price: number
}

/**
 * Line amount in integer cents. MVP: `price` is the amount paid for the line
 * (not price × qty). Invalid prices contribute 0.
 */
export function lineCents(line: PurchaseLineLike): number {
  if (!Number.isFinite(line.price) || line.price < 0) return 0
  return toCents(line.price)
}

/**
 * Sum of line amounts via integer cents; returns major units.
 */
export function purchaseTotalCents(lines: readonly PurchaseLineLike[]): number {
  return lines.reduce((sum, line) => sum + lineCents(line), 0)
}

/**
 * Open-purchase total in major currency units (cents-safe).
 */
export function purchaseTotal(lines: readonly PurchaseLineLike[]): number {
  return purchaseTotalCents(lines) / 100
}
