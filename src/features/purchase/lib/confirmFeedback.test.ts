import { beforeEach, describe, expect, it } from 'vitest'
import { useListStore } from '../../list/store/listStore'
import { createOpenPurchase, usePurchaseStore } from '../store/purchaseStore'
import {
  clearPendingUndo,
  confirmPurchaseWithFeedback,
  undoLastConfirm,
} from './confirmFeedback'

beforeEach(() => {
  localStorage.clear()
  clearPendingUndo()
  useListStore.setState({ items: [] })
  usePurchaseStore.setState({
    open: createOpenPurchase(),
    history: [],
    budget: null,
    migratedFromListV11: true,
  })
})

describe('confirmPurchaseWithFeedback / undo', () => {
  it('undoes a confirm and restores the list item', () => {
    useListStore.getState().addItem('Milk')
    const item = useListStore.getState().items[0]

    confirmPurchaseWithFeedback({
      name: 'Milk',
      price: 5.5,
      quantity: 1,
      unit: 'L',
      sourceItemId: item.id,
    })
    expect(useListStore.getState().items).toHaveLength(0)
    expect(usePurchaseStore.getState().open.lines).toHaveLength(1)

    expect(undoLastConfirm()).toBe(true)
    expect(usePurchaseStore.getState().open.lines).toHaveLength(0)
    expect(useListStore.getState().items).toHaveLength(1)
    expect(useListStore.getState().items[0]).toMatchObject({
      id: item.id,
      name: 'Milk',
      status: 'todo',
    })
  })

  it('undo is one-shot', () => {
    confirmPurchaseWithFeedback({
      name: 'Bread',
      price: 3,
      quantity: 1,
      unit: 'un',
    })
    expect(undoLastConfirm()).toBe(true)
    expect(undoLastConfirm()).toBe(false)
  })
})
