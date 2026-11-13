import { beforeEach, describe, expect, it } from 'vitest'
import { useListStore } from './listStore'

beforeEach(() => {
  localStorage.clear()
  useListStore.setState({ items: [] })
})

describe('listStore', () => {
  it('adds, updates, removes and clears items', () => {
    const { addItem, updateItem, removeItem, clearAll } = useListStore.getState()
    addItem('  Milk  ')
    addItem('')
    expect(useListStore.getState().items).toHaveLength(1)
    expect(useListStore.getState().items[0].name).toBe('Milk')

    const id = useListStore.getState().items[0].id
    updateItem(id, { name: 'Whole milk' })
    expect(useListStore.getState().items[0].name).toBe('Whole milk')

    removeItem(id)
    expect(useListStore.getState().items).toHaveLength(0)

    addItem('Bread')
    clearAll()
    expect(useListStore.getState().items).toHaveLength(0)
  })

  it('marks bought with optional paid fields and clears done', () => {
    useListStore.getState().addItem('Rice')
    useListStore.getState().addItem('Beans')
    const [rice, beans] = useListStore.getState().items

    useListStore.getState().markBought(rice.id, { price: 12.5, quantity: 1, unit: 'kg' })
    expect(useListStore.getState().items.find((item) => item.id === rice.id)).toMatchObject({
      status: 'done',
      paidPrice: 12.5,
      paidQuantity: 1,
      paidUnit: 'kg',
    })

    useListStore.getState().markBought(beans.id)
    expect(useListStore.getState().items.find((item) => item.id === beans.id)?.status).toBe('done')

    useListStore.getState().clearDone()
    expect(useListStore.getState().items).toHaveLength(0)
  })

  it('persists items across reloads', () => {
    useListStore.getState().addItem('Eggs')
    const raw = localStorage.getItem('prices-list')
    expect(raw).not.toBeNull()
    expect(JSON.parse(raw ?? '').state.items).toHaveLength(1)
  })

  it('restores a removed item by id without duplicating', () => {
    useListStore.getState().addItem('Milk')
    const item = useListStore.getState().items[0]
    useListStore.getState().removeItem(item.id)
    useListStore.getState().restoreItem(item)
    useListStore.getState().restoreItem(item)
    expect(useListStore.getState().items).toHaveLength(1)
    expect(useListStore.getState().items[0].id).toBe(item.id)
  })
})
