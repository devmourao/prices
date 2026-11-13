import { beforeEach, describe, expect, it } from 'vitest'
import { useListStore } from '../../list/store/listStore'
import { createOpenPurchase, PURCHASE_HISTORY_CAP, usePurchaseStore } from './purchaseStore'

beforeEach(() => {
  localStorage.clear()
  useListStore.setState({ items: [] })
  usePurchaseStore.setState({
    open: createOpenPurchase(),
    history: [],
    migratedFromListV11: false,
  })
})

describe('purchaseStore', () => {
  it('confirms a purchase line and persists open lines', () => {
    usePurchaseStore.getState().confirmPurchase({
      name: '  Milk  ',
      price: 5.5,
      quantity: 1,
      unit: 'L',
    })
    const { open } = usePurchaseStore.getState()
    expect(open.lines).toHaveLength(1)
    expect(open.lines[0]).toMatchObject({ name: 'Milk', price: 5.5, quantity: 1, unit: 'L' })

    const raw = localStorage.getItem('prices-purchase')
    expect(raw).not.toBeNull()
    expect(JSON.parse(raw ?? '').state.open.lines).toHaveLength(1)
  })

  it('rejects invalid confirm input', () => {
    const { confirmPurchase } = usePurchaseStore.getState()
    confirmPurchase({ name: '', price: 1, quantity: 1, unit: 'un' })
    confirmPurchase({ name: 'X', price: Number.NaN, quantity: 1, unit: 'un' })
    confirmPurchase({ name: 'X', price: -1, quantity: 1, unit: 'un' })
    confirmPurchase({ name: 'X', price: 1, quantity: 0, unit: 'un' })
    expect(usePurchaseStore.getState().open.lines).toHaveLength(0)
  })

  it('removes the source list item when confirming', () => {
    useListStore.getState().addItem('Rice')
    const id = useListStore.getState().items[0].id
    usePurchaseStore.getState().confirmPurchase({
      name: 'Rice',
      price: 12,
      quantity: 1,
      unit: 'kg',
      sourceItemId: id,
    })
    expect(useListStore.getState().items).toHaveLength(0)
    expect(usePurchaseStore.getState().open.lines[0].sourceItemId).toBe(id)
  })

  it('removes a line from the open purchase', () => {
    usePurchaseStore.getState().confirmPurchase({
      name: 'A',
      price: 1,
      quantity: 1,
      unit: 'un',
    })
    usePurchaseStore.getState().confirmPurchase({
      name: 'B',
      price: 2,
      quantity: 1,
      unit: 'un',
    })
    const [first] = usePurchaseStore.getState().open.lines
    usePurchaseStore.getState().removeLine(first.id)
    expect(usePurchaseStore.getState().open.lines.map((line) => line.name)).toEqual(['B'])
  })

  it('ends purchase into history with frozen totalCents and caps at 20', () => {
    expect(usePurchaseStore.getState().endPurchase()).toBe(false)

    usePurchaseStore.getState().confirmPurchase({
      name: 'Milk',
      price: 1.1,
      quantity: 1,
      unit: 'L',
    })
    usePurchaseStore.getState().confirmPurchase({
      name: 'Bread',
      price: 2.2,
      quantity: 1,
      unit: 'un',
    })
    expect(usePurchaseStore.getState().endPurchase()).toBe(true)

    const { open, history } = usePurchaseStore.getState()
    expect(open.lines).toHaveLength(0)
    expect(history).toHaveLength(1)
    expect(history[0].totalCents).toBe(330)
    expect(history[0].lines).toHaveLength(2)

    for (let i = 0; i < PURCHASE_HISTORY_CAP + 3; i += 1) {
      usePurchaseStore.getState().confirmPurchase({
        name: `Item ${i}`,
        price: 1,
        quantity: 1,
        unit: 'un',
      })
      usePurchaseStore.getState().endPurchase()
    }
    expect(usePurchaseStore.getState().history).toHaveLength(PURCHASE_HISTORY_CAP)
  })

  it('clearOpen drops lines without archiving', () => {
    usePurchaseStore.getState().confirmPurchase({
      name: 'Milk',
      price: 3,
      quantity: 1,
      unit: 'L',
    })
    const openId = usePurchaseStore.getState().open.id
    usePurchaseStore.getState().clearOpen()
    expect(usePurchaseStore.getState().open.id).toBe(openId)
    expect(usePurchaseStore.getState().open.lines).toHaveLength(0)
    expect(usePurchaseStore.getState().history).toHaveLength(0)
  })
})
