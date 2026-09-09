import { describe, expect, it } from 'vitest'
import {
  familyOf,
  pricePerBase,
  rank,
  savingsPct,
  toBaseUnit,
  unitPricesEqual,
} from './units'

describe('toBaseUnit', () => {
  it('keeps L, kg and un as-is', () => {
    expect(toBaseUnit(2, 'L')).toBe(2)
    expect(toBaseUnit(1.5, 'kg')).toBe(1.5)
    expect(toBaseUnit(3, 'un')).toBe(3)
  })

  it('converts g to kg and mL to L', () => {
    expect(toBaseUnit(500, 'g')).toBe(0.5)
    expect(toBaseUnit(250, 'mL')).toBe(0.25)
  })

  it('rejects non-positive quantities', () => {
    expect(() => toBaseUnit(0, 'L')).toThrow(RangeError)
    expect(() => toBaseUnit(-2, 'kg')).toThrow(RangeError)
  })
})

describe('familyOf', () => {
  it('groups L/mL, kg/g and un', () => {
    expect(familyOf('L')).toBe('volume')
    expect(familyOf('mL')).toBe('volume')
    expect(familyOf('kg')).toBe('mass')
    expect(familyOf('g')).toBe('mass')
    expect(familyOf('un')).toBe('count')
  })
})

describe('pricePerBase', () => {
  it('computes the backlog acceptance cases', () => {
    expect(pricePerBase(10, 2, 'L')).toBe(5)
    expect(pricePerBase(7.5, 1.5, 'L')).toBe(5)
    expect(pricePerBase(5, 500, 'g')).toBe(10)
    expect(pricePerBase(2.5, 250, 'mL')).toBe(10)
  })

  it('rejects negative prices', () => {
    expect(() => pricePerBase(-1, 2, 'L')).toThrow(RangeError)
  })
})

describe('rank', () => {
  it('sorts by ascending unit price', () => {
    const ranked = rank([
      { id: 'a', label: 'A', price: 10, quantity: 2, unit: 'L' },
      { id: 'b', label: 'B', price: 9, quantity: 2, unit: 'L' },
      { id: 'c', label: 'C', price: 7.5, quantity: 1.5, unit: 'L' },
    ])
    expect(ranked.map((entry) => entry.id)).toEqual(['b', 'a', 'c'])
    expect(ranked[0].unitPrice).toBe(4.5)
  })

  it('ranks mL against L', () => {
    const ranked = rank([
      { id: 'a', label: 'A', price: 9, quantity: 1, unit: 'L' },
      { id: 'b', label: 'B', price: 2.5, quantity: 250, unit: 'mL' },
    ])
    expect(ranked[0].id).toBe('a')
  })

  it('blocks cross-family comparison', () => {
    expect(() =>
      rank([
        { id: 'a', label: 'A', price: 10, quantity: 2, unit: 'L' },
        { id: 'b', label: 'B', price: 10, quantity: 2, unit: 'kg' },
      ]),
    ).toThrow('different unit families')
  })
})

describe('savingsPct', () => {
  it('returns the fraction saved vs the reference', () => {
    expect(savingsPct(4.5, 5)).toBeCloseTo(0.1)
    expect(savingsPct(5, 5)).toBe(0)
  })
})

describe('unitPricesEqual', () => {
  it('detects exact and binary ties', () => {
    expect(unitPricesEqual(5, 5)).toBe(true)
    expect(unitPricesEqual(10 / 3, 20 / 6)).toBe(true)
  })

  it('distinguishes different prices', () => {
    expect(unitPricesEqual(4.5, 5)).toBe(false)
    expect(unitPricesEqual(0, 1e-6)).toBe(false)
  })
})
