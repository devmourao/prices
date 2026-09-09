export type Unit = 'L' | 'kg' | 'g' | 'un'

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
}

const GRAMS_PER_KILO = 1000

export function familyOf(unit: Unit): UnitFamily {
  switch (unit) {
    case 'L':
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
    case 'g':
      return quantity / GRAMS_PER_KILO
  }
}

/**
 * Price per base unit. Throws RangeError for invalid price/quantity.
 */
export function pricePerBase(price: number, quantity: number, unit: Unit): number {
  if (!Number.isFinite(price) || price < 0) {
    throw new RangeError(`Price must be a non-negative number, got ${price}`)
  }
  return price / toBaseUnit(quantity, unit)
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
    .map((entry) => ({
      ...entry,
      baseQuantity: toBaseUnit(entry.quantity, entry.unit),
      unitPrice: pricePerBase(entry.price, entry.quantity, entry.unit),
    }))
    .sort((a, b) => a.unitPrice - b.unitPrice)
}

/**
 * Savings of an entry relative to a reference (usually the most expensive),
 * as a fraction in [0, 1). E.g. 0.2 = 20% cheaper.
 */
export function savingsPct(unitPrice: number, referencePrice: number): number {
  if (!Number.isFinite(unitPrice) || !Number.isFinite(referencePrice)) {
    throw new RangeError('Unit prices must be finite numbers')
  }
  if (referencePrice <= 0) {
    throw new RangeError('Reference price must be positive')
  }
  return Math.max(0, 1 - unitPrice / referencePrice)
}
