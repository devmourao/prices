import { describe, expect, it } from 'vitest'
import { formatPercent, formatPrice, formatUnitPrice } from './currency'

describe('formatUnitPrice', () => {
  it('formats USD per unit in English', () => {
    expect(formatUnitPrice(5, 'L', 'en')).toBe('$5.00/L')
  })

  it('formats BRL per unit in Portuguese', () => {
    expect(formatUnitPrice(5, 'L', 'pt-BR')).toBe('R$ 5,00/L')
  })
})

describe('formatPrice', () => {
  it('rejects non-finite amounts', () => {
    expect(() => formatPrice(Number.NaN, 'en')).toThrow(RangeError)
  })
})

describe('formatPercent', () => {
  it('formats savings fractions', () => {
    expect(formatPercent(0.2, 'en')).toBe('20%')
    expect(formatPercent(0.2, 'pt-BR')).toBe('20%')
  })
})
