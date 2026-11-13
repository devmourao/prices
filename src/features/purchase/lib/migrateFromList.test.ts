import { beforeEach, describe, expect, it } from 'vitest'
import { useListStore } from '../../list/store/listStore'
import { createOpenPurchase, usePurchaseStore } from '../store/purchaseStore'
import { applyListV11Migration, planListV11Migration } from './migrateFromList'

beforeEach(() => {
  localStorage.clear()
  useListStore.setState({ items: [] })
  usePurchaseStore.setState({
    open: createOpenPurchase(),
    history: [],
    migratedFromListV11: false,
  })
})

describe('planListV11Migration', () => {
  it('copies done+price items to lines and strips all done', () => {
    const items = [
      {
        id: 'a',
        name: 'Milk',
        status: 'done' as const,
        paidPrice: 5.5,
        paidQuantity: 2,
        paidUnit: 'L' as const,
        updatedAt: '2026-11-13T10:00:00.000Z',
      },
      {
        id: 'b',
        name: 'Bread',
        status: 'done' as const,
        updatedAt: '2026-11-13T10:01:00.000Z',
      },
      {
        id: 'c',
        name: 'Eggs',
        status: 'todo' as const,
        updatedAt: '2026-11-13T10:02:00.000Z',
      },
    ]

    const { lines, remainingItems } = planListV11Migration(items, false)
    expect(lines).toHaveLength(1)
    expect(lines[0]).toMatchObject({
      name: 'Milk',
      price: 5.5,
      quantity: 2,
      unit: 'L',
      sourceItemId: 'a',
    })
    expect(remainingItems).toEqual([items[2]])
  })

  it('is a no-op when already migrated', () => {
    const items = [
      {
        id: 'a',
        name: 'Milk',
        status: 'done' as const,
        paidPrice: 1,
        updatedAt: '2026-11-13T10:00:00.000Z',
      },
    ]
    const result = planListV11Migration(items, true)
    expect(result.lines).toHaveLength(0)
    expect(result.remainingItems).toEqual(items)
  })
})

describe('applyListV11Migration', () => {
  it('migrates once without double-counting', () => {
    useListStore.setState({
      items: [
        {
          id: 'rice',
          name: 'Rice',
          status: 'done',
          paidPrice: 12.5,
          paidQuantity: 1,
          paidUnit: 'kg',
          updatedAt: '2026-11-13T12:00:00.000Z',
        },
        {
          id: 'beans',
          name: 'Beans',
          status: 'todo',
          updatedAt: '2026-11-13T12:00:00.000Z',
        },
      ],
    })

    applyListV11Migration()
    expect(usePurchaseStore.getState().migratedFromListV11).toBe(true)
    expect(usePurchaseStore.getState().open.lines).toHaveLength(1)
    expect(usePurchaseStore.getState().open.lines[0].name).toBe('Rice')
    expect(useListStore.getState().items.map((item) => item.id)).toEqual(['beans'])

    applyListV11Migration()
    expect(usePurchaseStore.getState().open.lines).toHaveLength(1)
  })
})
