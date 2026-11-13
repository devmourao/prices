import { describe, expect, it } from 'vitest'
import { formatReceiptText } from './formatReceiptText'

describe('formatReceiptText', () => {
  it('builds a plain-text cupom with total', () => {
    const text = formatReceiptText({
      title: 'Receipt',
      locale: 'en',
      startedAt: '2026-11-13T10:00:00.000Z',
      lines: [
        {
          id: '1',
          name: 'Milk',
          quantity: 1,
          unit: 'L',
          price: 5.5,
          addedAt: '2026-11-13T10:01:00.000Z',
        },
        {
          id: '2',
          name: 'Bread',
          quantity: 2,
          unit: 'un',
          price: 4.5,
          addedAt: '2026-11-13T10:02:00.000Z',
        },
      ],
    })
    expect(text).toContain('Receipt')
    expect(text).toContain('Milk (1L)')
    expect(text).toContain('Bread (2un)')
    expect(text).toMatch(/TOTAL/)
    expect(text).toContain('$10.00')
  })

  it('uses frozen total when provided', () => {
    const text = formatReceiptText({
      title: 'Recibo',
      locale: 'pt-BR',
      total: 12.34,
      lines: [],
    })
    expect(text).toMatch(/TOTAL/)
    expect(text).toContain('12,34')
  })
})
