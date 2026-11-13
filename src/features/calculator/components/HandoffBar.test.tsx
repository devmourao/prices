import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { beforeEach, describe, expect, it } from 'vitest'
import { I18nextProvider } from 'react-i18next'
import { MemoryRouter, Route, Routes } from 'react-router'
import i18n from '../../../i18n'
import { useListStore } from '../../list/store/listStore'
import { seedCalculatorForListItem } from '../../list/lib/handoff'
import { createOpenPurchase, usePurchaseStore } from '../../purchase/store/purchaseStore'
import { useCalculatorStore } from '../store/calculatorStore'
import { CalculatorPage } from '../CalculatorPage'

function renderCompare(itemId: string) {
  return render(
    <I18nextProvider i18n={i18n}>
      <MemoryRouter initialEntries={[`/compare?itemId=${itemId}`]}>
        <Routes>
          <Route path="/" element={<div>List home</div>} />
          <Route path="/compare" element={<CalculatorPage />} />
        </Routes>
      </MemoryRouter>
    </I18nextProvider>,
  )
}

beforeEach(() => {
  localStorage.clear()
  useListStore.setState({ items: [] })
  usePurchaseStore.setState({
    open: createOpenPurchase(),
    history: [],
    migratedFromListV11: true,
  })
  useCalculatorStore.setState({
    products: [
      { id: 'a', label: '', price: 0, quantity: 1, unit: 'L' },
      { id: 'b', label: '', price: 0, quantity: 1, unit: 'L' },
    ],
  })
})

describe('Compare handoff', () => {
  it('applies and marks bought into the receipt', async () => {
    const user = userEvent.setup()
    useListStore.getState().addItem('Milk')
    const item = useListStore.getState().items[0]
    seedCalculatorForListItem(item)

    const [first, second] = useCalculatorStore.getState().products
    useCalculatorStore.getState().updateProduct(first.id, {
      label: 'Milk',
      price: 10,
      quantity: 2,
      unit: 'L',
    })
    useCalculatorStore.getState().updateProduct(second.id, {
      label: 'Milk',
      price: 9,
      quantity: 2,
      unit: 'L',
    })

    renderCompare(item.id)

    expect(screen.getByText(/comparing options for “milk”/i)).toBeInTheDocument()
    expect(screen.getByRole('link', { name: /back to list/i })).toBeInTheDocument()

    await user.click(screen.getByRole('button', { name: /use this price on the list/i }))
    const dialog = screen.getByRole('dialog')
    await user.click(within(dialog).getByRole('button', { name: /apply and mark bought/i }))

    expect(screen.getByText('List home')).toBeInTheDocument()
    expect(useListStore.getState().items).toHaveLength(0)
    expect(usePurchaseStore.getState().open.lines).toHaveLength(1)
    expect(usePurchaseStore.getState().open.lines[0]).toMatchObject({
      name: 'Milk',
      price: 9,
      quantity: 2,
      unit: 'L',
    })
  })

  it('applies price only without creating a receipt line', async () => {
    const user = userEvent.setup()
    useListStore.getState().addItem('Milk')
    const item = useListStore.getState().items[0]
    seedCalculatorForListItem(item)

    const [first, second] = useCalculatorStore.getState().products
    useCalculatorStore.getState().updateProduct(first.id, {
      label: 'Milk',
      price: 10,
      quantity: 2,
      unit: 'L',
    })
    useCalculatorStore.getState().updateProduct(second.id, {
      label: 'Milk',
      price: 9,
      quantity: 2,
      unit: 'L',
    })

    renderCompare(item.id)
    await user.click(screen.getByRole('button', { name: /use this price on the list/i }))
    await user.click(
      within(screen.getByRole('dialog')).getByRole('button', { name: /apply price only/i }),
    )

    expect(useListStore.getState().items[0]).toMatchObject({
      status: 'todo',
      paidPrice: 9,
      paidQuantity: 2,
      paidUnit: 'L',
    })
    expect(usePurchaseStore.getState().open.lines).toHaveLength(0)
  })

  it('hides apply CTA for orphan item ids', () => {
    renderCompare('missing-id')
    expect(screen.queryByText(/comparing options/i)).not.toBeInTheDocument()
    expect(screen.queryByRole('button', { name: /use this price/i })).not.toBeInTheDocument()
  })
})

describe('Save winner to list (SL-22)', () => {
  function renderStandalone() {
    return render(
      <I18nextProvider i18n={i18n}>
        <MemoryRouter initialEntries={['/compare']}>
          <Routes>
            <Route path="/" element={<div>List home</div>} />
            <Route path="/compare" element={<CalculatorPage />} />
          </Routes>
        </MemoryRouter>
      </I18nextProvider>,
    )
  }

  it('saves standalone winner to the list and receipt', async () => {
    const user = userEvent.setup()
    const [first, second] = useCalculatorStore.getState().products
    useCalculatorStore.getState().updateProduct(first.id, {
      label: 'Oat milk',
      price: 10,
      quantity: 2,
      unit: 'L',
    })
    useCalculatorStore.getState().updateProduct(second.id, {
      label: 'Oat milk',
      price: 8,
      quantity: 2,
      unit: 'L',
    })

    renderStandalone()
    await user.click(screen.getByRole('button', { name: /save winner to list/i }))
    await user.click(
      within(screen.getByRole('dialog')).getByRole('button', {
        name: /add and mark bought/i,
      }),
    )

    expect(screen.getByText('List home')).toBeInTheDocument()
    expect(useListStore.getState().items).toHaveLength(0)
    expect(usePurchaseStore.getState().open.lines[0]).toMatchObject({
      name: 'Oat milk',
      price: 8,
      quantity: 2,
      unit: 'L',
    })
  })

  it('matches an existing list item by name for price-only save', async () => {
    const user = userEvent.setup()
    useListStore.getState().addItem('Oat milk')
    const [first, second] = useCalculatorStore.getState().products
    useCalculatorStore.getState().updateProduct(first.id, {
      label: 'Oat milk',
      price: 10,
      quantity: 1,
      unit: 'L',
    })
    useCalculatorStore.getState().updateProduct(second.id, {
      label: 'Oat milk',
      price: 7,
      quantity: 1,
      unit: 'L',
    })

    renderStandalone()
    await user.click(screen.getByRole('button', { name: /save winner to list/i }))
    await user.click(
      within(screen.getByRole('dialog')).getByRole('button', {
        name: /add with price only/i,
      }),
    )

    expect(useListStore.getState().items).toHaveLength(1)
    expect(useListStore.getState().items[0]).toMatchObject({
      name: 'Oat milk',
      status: 'todo',
      paidPrice: 7,
    })
    expect(usePurchaseStore.getState().open.lines).toHaveLength(0)
  })
})
