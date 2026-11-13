import { describe, expect, it } from 'vitest'
import { listProgress, listSpend } from './listTotals'

describe('listProgress', () => {
  it('returns zeros for an empty list', () => {
    expect(listProgress([])).toEqual({ done: 0, total: 0 })
  })

  it('counts done items', () => {
    expect(
      listProgress([
        { status: 'todo' },
        { status: 'done' },
        { status: 'done' },
      ]),
    ).toEqual({ done: 2, total: 3 })
  })
})

describe('listSpend', () => {
  it('sums paid prices on done items via cents', () => {
    expect(
      listSpend([
        { status: 'done', paidPrice: 7.5 },
        { status: 'done', paidPrice: 2.5 },
        { status: 'todo', paidPrice: 99 },
        { status: 'done' },
      ]),
    ).toBe(10)
  })

  it('ignores invalid prices', () => {
    expect(
      listSpend([
        { status: 'done', paidPrice: Number.NaN },
        { status: 'done', paidPrice: -1 },
      ]),
    ).toBe(0)
  })

  it('keeps BRL cent precision on typical shelf totals', () => {
    expect(
      listSpend([
        { status: 'done', paidPrice: 1.1 },
        { status: 'done', paidPrice: 2.2 },
      ]),
    ).toBe(3.3)
  })
})
