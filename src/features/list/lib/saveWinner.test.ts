import { beforeEach, describe, expect, it } from 'vitest'
import { useListStore } from '../store/listStore'
import { ensureListItemForWinner, findListItemByName } from './saveWinner'

beforeEach(() => {
  localStorage.clear()
  useListStore.setState({ items: [] })
})

describe('saveWinner helpers', () => {
  it('finds items by case-insensitive name', () => {
    useListStore.getState().addItem('Milk')
    expect(findListItemByName(' milk ')?.name).toBe('Milk')
    expect(findListItemByName('Bread')).toBeNull()
  })

  it('creates a new item when no match', () => {
    const item = ensureListItemForWinner('Rice', 'kg')
    expect(item).toMatchObject({ name: 'Rice', preferredUnit: 'kg', status: 'todo' })
    expect(useListStore.getState().items).toHaveLength(1)
  })

  it('reuses an existing item and may set preferredUnit', () => {
    useListStore.getState().addItem('Beans')
    const first = ensureListItemForWinner('beans', 'kg')
    const second = ensureListItemForWinner('BEANS', 'g')
    expect(first.id).toBe(second.id)
    expect(useListStore.getState().items).toHaveLength(1)
    expect(useListStore.getState().items[0].preferredUnit).toBe('kg')
  })
})
