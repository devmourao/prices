export type Unit = 'L' | 'mL' | 'kg' | 'g' | 'un'

export type UnitFamily = 'volume' | 'mass' | 'count'

export interface PricedEntry {
  readonly id: string
  readonly label: string
  readonly price: number
  readonly quantity: number
  readonly unit: Unit
}

export interface RankedEntry extends PricedEntry {
  readonly baseQuantity: number
  readonly unitPrice: number
  /** Integer cents of the shelf price — ranking uses this, not floats. */
  readonly priceCents: number
  /** Quantity in family base × 1000 (mL, g, or milli-units). */
  readonly scaledBase: number
}

const GRAMS_PER_KILO = 1000
const ML_PER_LITER = 1000
const CENTS_PER_MAJOR = 100
/** Scale base quantities to integers (L→mL, kg→g, un→milli-units). */
const BASE_SCALE = 1000

export function familyOf(unit: Unit): UnitFamily {
  switch (unit) {
    case 'L':
    case 'mL':
      return 'volume'
    case 'kg':
    case 'g':
      return 'mass'
    case 'un':
      return 'count'
  }
}

export function baseUnitOf(family: UnitFamily): Unit {
  switch (family) {
    case 'volume':
      return 'L'
    case 'mass':
      return 'kg'
    case 'count':
      return 'un'
  }
}

/**
 * Converts a major-unit price to integer cents (BRL/USD display units).
 * Rounds half-away-from-zero via Math.round on the absolute value path.
 */
export function toCents(amount: number): number {
  if (!Number.isFinite(amount)) {
    throw new RangeError(`Amount must be a finite number, got ${amount}`)
  }
  return Math.round(amount * CENTS_PER_MAJOR)
}

/**
 * Converts a quantity into its family base unit (L, kg, un).
 * Throws RangeError for non-finite or non-positive quantities.
 */
export function toBaseUnit(quantity: number, unit: Unit): number {
  if (!Number.isFinite(quantity) || quantity <= 0) {
    throw new RangeError(`Quantity must be a positive number, got ${quantity}`)
  }
  switch (unit) {
    case 'L':
    case 'kg':
    case 'un':
      return quantity
    case 'mL':
      return quantity / ML_PER_LITER
    case 'g':
      return quantity / GRAMS_PER_KILO
  }
}

/** Integer scaled base quantity for cross-multiply ranking. */
export function toScaledBase(quantity: number, unit: Unit): number {
  const scaled = Math.round(toBaseUnit(quantity, unit) * BASE_SCALE)
  if (scaled <= 0) {
    throw new RangeError(`Scaled base quantity must be positive, got ${scaled}`)
  }
  return scaled
}

/**
 * Price per base unit derived from integer cents.
 * Display-only float; ranking compares cents × scaled bases instead.
 */
export function pricePerBase(price: number, quantity: number, unit: Unit): number {
  if (!Number.isFinite(price) || price < 0) {
    throw new RangeError(`Price must be a non-negative number, got ${price}`)
  }
  const cents = toCents(price)
  const scaled = toScaledBase(quantity, unit)
  return (cents * BASE_SCALE) / (scaled * CENTS_PER_MAJOR)
}

function compareRankKeys(
  a: { readonly priceCents: number; readonly scaledBase: number },
  b: { readonly priceCents: number; readonly scaledBase: number },
): number {
  // centsA/scaledA ? centsB/scaledB  →  centsA*scaledB ? centsB*scaledA
  const left = a.priceCents * b.scaledBase
  const right = b.priceCents * a.scaledBase
  return left === right ? 0 : left < right ? -1 : 1
}

/**
 * Ranks entries of the SAME family by ascending unit price.
 * Throws Error when families are mixed (physically meaningless comparison).
 */
export function rank(entries: readonly PricedEntry[]): RankedEntry[] {
  const families = new Set(entries.map((entry) => familyOf(entry.unit)))
  if (families.size > 1) {
    throw new Error('Cannot compare products from different unit families')
  }
  return entries
    .map((entry) => {
      const priceCents = toCents(entry.price)
      const scaledBase = toScaledBase(entry.quantity, entry.unit)
      const baseQuantity = toBaseUnit(entry.quantity, entry.unit)
      return {
        ...entry,
        baseQuantity,
        priceCents,
        scaledBase,
        unitPrice: (priceCents * BASE_SCALE) / (scaledBase * CENTS_PER_MAJOR),
      }
    })
    .sort(compareRankKeys)
}

/**
 * Overpay of an entry relative to the winner, as a fraction >= 0.
 * E.g. 2.81 = 281% more expensive than the best value.
 */
export function overpayPct(unitPrice: number, winnerPrice: number): number {
  if (!Number.isFinite(unitPrice) || !Number.isFinite(winnerPrice)) {
    throw new RangeError('Unit prices must be finite numbers')
  }
  if (winnerPrice <= 0) {
    throw new RangeError('Winner price must be positive')
  }
  return Math.max(0, unitPrice / winnerPrice - 1)
}

/**
 * Equality for unit prices after cents-based computation.
 * Compares at 0.0001 currency-per-base precision.
 */
export function unitPricesEqual(a: number, b: number): boolean {
  return Math.round(a * 10_000) === Math.round(b * 10_000)
}

/** True when two ranked entries share the same cents/scaled ratio. */
export function rankedUnitPricesEqual(a: RankedEntry, b: RankedEntry): boolean {
  return a.priceCents * b.scaledBase === b.priceCents * a.scaledBase
}
