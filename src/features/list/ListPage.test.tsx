import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { I18nextProvider } from 'react-i18next'
import { MemoryRouter } from 'react-router'
import i18n from '../../i18n'
import { createOpenPurchase, usePurchaseStore } from '../purchase/store/purchaseStore'
import { ListPage } from './ListPage'
import { useListStore } from './store/listStore'

function renderPage() {
  return render(
    <I18nextProvider i18n={i18n}>
      <MemoryRouter>
        <ListPage />
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
  vi.restoreAllMocks()
})

describe('ListPage', () => {
  it('shows empty state and pending progress', () => {
    renderPage()
    expect(screen.getByRole('heading', { name: /shopping list/i })).toBeInTheDocument()
    expect(screen.getByText(/no items yet/i)).toBeInTheDocument()
    expect(screen.getByText(/0 of 0 left/i)).toBeInTheDocument()
  })

  it('adds items quickly and updates pending count', async () => {
    const user = userEvent.setup()
    renderPage()

    const input = screen.getByLabelText(/add item/i)
    await user.type(input, 'Milk{Enter}')
    await user.type(input, 'Bread{Enter}')

    expect(screen.getByText('Milk')).toBeInTheDocument()
    expect(screen.getByText('Bread')).toBeInTheDocument()
    expect(screen.getByText(/2 of 2 left/i)).toBeInTheDocument()
  })

  it('opens confirm-buy sheet from the checkbox', async () => {
    const user = userEvent.setup()
    useListStore.setState({
      items: [
        {
          id: '1',
          name: 'Milk',
          status: 'todo',
          updatedAt: new Date().toISOString(),
        },
      ],
    })
    renderPage()

    await user.click(screen.getByRole('checkbox', { name: /mark milk as bought/i }))
    const dialog = screen.getByRole('dialog')
    expect(within(dialog).getByLabelText(/price paid/i)).toBeInTheDocument()
  })

  it('confirms buy into receipt and shrinks the list', async () => {
    const user = userEvent.setup()
    useListStore.setState({
      items: [
        {
          id: '1',
          name: 'Milk',
          status: 'todo',
          updatedAt: new Date().toISOString(),
        },
      ],
    })
    renderPage()

    await user.click(screen.getByRole('button', { name: 'Milk' }))
    const dialog = screen.getByRole('dialog')
    await user.click(within(dialog).getByRole('button', { name: /mark bought/i }))
    await user.type(within(dialog).getByLabelText(/price paid/i), '5.50')
    await user.click(within(dialog).getByRole('button', { name: /add to receipt/i }))

    expect(useListStore.getState().items).toHaveLength(0)
    expect(usePurchaseStore.getState().open.lines).toHaveLength(1)
    expect(usePurchaseStore.getState().open.lines[0]).toMatchObject({
      name: 'Milk',
      price: 5.5,
      quantity: 1,
    })
    expect(screen.getByRole('link', { name: /receipt/i })).toBeInTheDocument()
  })

  it('clears leftover bought items after confirm', async () => {
    const user = userEvent.setup()
    vi.spyOn(window, 'confirm').mockReturnValue(true)
    useListStore.setState({
      items: [
        {
          id: '1',
          name: 'Milk',
          status: 'done',
          paidPrice: 5,
          updatedAt: new Date().toISOString(),
        },
        {
          id: '2',
          name: 'Bread',
          status: 'todo',
          updatedAt: new Date().toISOString(),
        },
      ],
    })
    renderPage()

    await user.click(screen.getByRole('button', { name: /clear bought/i }))
    expect(useListStore.getState().items).toHaveLength(1)
    expect(useListStore.getState().items[0].name).toBe('Bread')
  })
})
