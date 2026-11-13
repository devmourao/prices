import { describe, expect, it } from 'vitest'
import { lineCents, purchaseTotal, purchaseTotalCents } from './purchaseTotals'

describe('lineCents', () => {
  it('converts finite non-negative prices to cents', () => {
    expect(lineCents({ price: 7.5 })).toBe(750)
    expect(lineCents({ price: 0 })).toBe(0)
  })

  it('ignores invalid prices', () => {
    expect(lineCents({ price: Number.NaN })).toBe(0)
    expect(lineCents({ price: -1 })).toBe(0)
  })
})

describe('purchaseTotalCents / purchaseTotal', () => {
  it('sums lines via integer cents', () => {
    const lines = [{ price: 7.5 }, { price: 2.5 }, { price: 99 }]
    expect(purchaseTotalCents(lines)).toBe(10900)
    expect(purchaseTotal(lines.slice(0, 2))).toBe(10)
  })

  it('keeps BRL cent precision on typical shelf totals', () => {
    expect(purchaseTotal([{ price: 1.1 }, { price: 2.2 }])).toBe(3.3)
  })

  it('returns 0 for empty or invalid-only lines', () => {
    expect(purchaseTotal([])).toBe(0)
    expect(purchaseTotal([{ price: Number.NaN }, { price: -0.01 }])).toBe(0)
  })
})
