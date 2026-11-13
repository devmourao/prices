import { beforeEach, describe, expect, it } from 'vitest'
import {
  selectComparison,
  selectRankedProducts,
  selectWinnerId,
  useCalculatorStore,
  type Product,
} from './calculatorStore'

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
})

describe('calculator store', () => {
  it('adds, updates and removes products', () => {
    const { addProduct, updateProduct, removeProduct } = useCalculatorStore.getState()
    addProduct()
    expect(useCalculatorStore.getState().products).toHaveLength(3)

    const [first] = useCalculatorStore.getState().products
    updateProduct(first.id, { price: 7.5, quantity: 1.5 })
    expect(useCalculatorStore.getState().products[0].price).toBe(7.5)

    removeProduct(first.id)
    expect(useCalculatorStore.getState().products).toHaveLength(2)
  })

  it('selects the cheapest winner', () => {
    expect(selectWinnerId(useCalculatorStore.getState())).toBe('b')
    expect(selectRankedProducts(useCalculatorStore.getState())[0].id).toBe('b')
  })

  it('returns no winner for mixed families instead of throwing', () => {
    useCalculatorStore.getState().updateProduct('b', { unit: 'kg' })
    expect(selectWinnerId(useCalculatorStore.getState())).toBeNull()
    expect(selectComparison(useCalculatorStore.getState()).status).toBe('mixed')
  })

  it('ignores incomplete rows in ranking', () => {
    useCalculatorStore.setState({
      products: [
        product({ id: 'a', price: 10, quantity: 2, unit: 'L' }),
        product({ id: 'b', price: 0, quantity: 2, unit: 'L' }),
        product({ id: 'c', price: 9, quantity: 2, unit: 'L' }),
      ],
    })
    expect(selectRankedProducts(useCalculatorStore.getState()).map((row) => row.id)).toEqual([
      'c',
      'a',
    ])
  })

  it('persists products across reloads', () => {
    const raw = localStorage.getItem('prices-calculator')
    expect(raw).not.toBeNull()
    expect(JSON.parse(raw ?? '').state.products).toHaveLength(2)
  })

  it('clears everything', () => {
    useCalculatorStore.getState().clearAll()
    expect(useCalculatorStore.getState().products).toHaveLength(0)
  })
})
