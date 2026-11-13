import { describe, expect, it } from 'vitest'
import { budgetStatus } from './budget'

describe('budgetStatus', () => {
  it('returns remaining under budget', () => {
    expect(budgetStatus(100, 40.5)).toEqual({
      budget: 100,
      spent: 40.5,
      remaining: 59.5,
      over: false,
      ratio: 0.405,
    })
  })

  it('flags overspend with cents-safe math', () => {
    const status = budgetStatus(10, 10.01)
    expect(status?.over).toBe(true)
    expect(status?.remaining).toBeCloseTo(-0.01, 10)
    expect(status?.ratio).toBe(1)
  })

  it('rejects invalid budgets', () => {
    expect(budgetStatus(0, 5)).toBeNull()
    expect(budgetStatus(-1, 5)).toBeNull()
    expect(budgetStatus(Number.NaN, 5)).toBeNull()
  })
})
