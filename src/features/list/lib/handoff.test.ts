import { beforeEach, describe, expect, it } from 'vitest'
import { useCalculatorStore } from '../../calculator/store/calculatorStore'
import { useListStore } from '../store/listStore'
import { findListItem, seedCalculatorForListItem } from './handoff'

beforeEach(() => {
  localStorage.clear()
  useCalculatorStore.setState({
    products: [
      { id: 'x', label: '', price: 0, quantity: 1, unit: 'L' },
      { id: 'y', label: '', price: 0, quantity: 1, unit: 'L' },
    ],
  })
  useListStore.setState({ items: [] })
})

describe('handoff', () => {
  it('seeds two labeled calculator products from a list item', () => {
    useListStore.getState().addItem('Milk')
    const item = useListStore.getState().items[0]
    seedCalculatorForListItem(item)

    const products = useCalculatorStore.getState().products
    expect(products).toHaveLength(2)
    expect(products.every((product) => product.label === 'Milk')).toBe(true)
    expect(products.every((product) => product.price === 0)).toBe(true)
  })

  it('finds list items by id and ignores orphans', () => {
    useListStore.getState().addItem('Bread')
    const id = useListStore.getState().items[0].id
    expect(findListItem(id)?.name).toBe('Bread')
    expect(findListItem('missing')).toBeNull()
    expect(findListItem(null)).toBeNull()
  })
})
