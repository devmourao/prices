import { beforeEach, describe, expect, it } from 'vitest'
import { useCalculatorStore, type Product } from './calculatorStore'
import { useHistoryStore } from './historyStore'

function product(overrides: Partial<Product> & { id: string }): Product {
  return { label: '', price: 0, quantity: 1, unit: 'L', ...overrides }
}

beforeEach(() => {
  localStorage.clear()
  useCalculatorStore.setState({
    products: [
      product({ id: 'a', label: 'A', price: 10, quantity: 2, unit: 'L' }),
      product({ id: 'b', label: 'B', price: 9, quantity: 2, unit: 'L' }),
    ],
  })
  useHistoryStore.getState().clearHistory()
})

describe('history store', () => {
  it('refuses snapshots with fewer than 2 comparable products', () => {
    useCalculatorStore.setState({ products: [product({ id: 'a' })] })
    expect(useHistoryStore.getState().saveSnapshot(useCalculatorStore.getState().products)).toBe(
      false,
    )
    expect(useHistoryStore.getState().entries).toHaveLength(0)
  })

  it('saves, caps, restores, removes and clears', () => {
    const history = () => useHistoryStore.getState()
    expect(history().saveSnapshot(useCalculatorStore.getState().products)).toBe(true)

    for (let i = 0; i < 25; i++) history().saveSnapshot(useCalculatorStore.getState().products)
    expect(history().entries).toHaveLength(20)

    const persisted = JSON.parse(localStorage.getItem('prices-history') ?? '')
    expect(persisted.state.entries).toHaveLength(20)

    useCalculatorStore.getState().updateProduct('a', { price: 99 })
    expect(history().restoreSnapshot(history().entries[0].id)).toBe(true)
    expect(useCalculatorStore.getState().products[0].price).toBe(10)

    history().removeSnapshot(history().entries[0].id)
    expect(history().entries).toHaveLength(19)

    history().clearHistory()
    expect(history().entries).toHaveLength(0)
  })
})
