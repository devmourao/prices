import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { I18nextProvider } from 'react-i18next'
import { MemoryRouter } from 'react-router'
import i18n from '../../i18n'
import { ReceiptPage } from './ReceiptPage'
import { createOpenPurchase, usePurchaseStore } from './store/purchaseStore'

function renderPage() {
  return render(
    <I18nextProvider i18n={i18n}>
      <MemoryRouter>
        <ReceiptPage />
      </MemoryRouter>
    </I18nextProvider>,
  )
}

function seedLines() {
  usePurchaseStore.setState({
    open: {
      id: 'p1',
      startedAt: '2026-11-13T10:00:00.000Z',
      lines: [
        {
          id: 'l1',
          name: 'Milk',
          quantity: 1,
          unit: 'L',
          price: 5.5,
          addedAt: '2026-11-13T10:01:00.000Z',
        },
        {
          id: 'l2',
          name: 'Bread',
          quantity: 1,
          unit: 'un',
          price: 4.5,
          addedAt: '2026-11-13T10:02:00.000Z',
        },
      ],
    },
    history: [],
    migratedFromListV11: true,
  })
}

beforeEach(() => {
  localStorage.clear()
  usePurchaseStore.setState({
    open: createOpenPurchase(),
    history: [],
    migratedFromListV11: false,
  })
  vi.restoreAllMocks()
})

describe('ReceiptPage', () => {
  it('shows empty state and disabled end purchase', () => {
    renderPage()
    expect(screen.getByRole('heading', { name: /receipt/i })).toBeInTheDocument()
    expect(screen.getByText(/confirm items from the list/i)).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /end purchase/i })).toBeDisabled()
  })

  it('lists open lines with sticky total', () => {
    seedLines()
    renderPage()
    expect(screen.getByText('Milk')).toBeInTheDocument()
    expect(screen.getByText('Bread')).toBeInTheDocument()
    expect(screen.getByText(/total/i)).toBeInTheDocument()
  })

  it('removes a line from the open receipt', async () => {
    const user = userEvent.setup()
    seedLines()
    renderPage()

    await user.click(screen.getByRole('button', { name: /remove milk/i }))
    expect(screen.queryByText('Milk')).not.toBeInTheDocument()
    expect(usePurchaseStore.getState().open.lines).toHaveLength(1)
  })

  it('ends purchase into history with frozen total', async () => {
    const user = userEvent.setup()
    vi.spyOn(window, 'confirm').mockReturnValue(true)
    seedLines()
    renderPage()

    await user.click(screen.getByRole('button', { name: /end purchase/i }))
    expect(usePurchaseStore.getState().open.lines).toHaveLength(0)
    expect(usePurchaseStore.getState().history).toHaveLength(1)
    expect(usePurchaseStore.getState().history[0].totalCents).toBe(1000)
    expect(screen.getByText(/confirm items from the list/i)).toBeInTheDocument()
  })

  it('cancels end purchase when confirm is dismissed', async () => {
    const user = userEvent.setup()
    vi.spyOn(window, 'confirm').mockReturnValue(false)
    seedLines()
    renderPage()

    await user.click(screen.getByRole('button', { name: /end purchase/i }))
    expect(usePurchaseStore.getState().open.lines).toHaveLength(2)
    expect(usePurchaseStore.getState().history).toHaveLength(0)
  })

  it('opens a read-only archived cupom from history', async () => {
    const user = userEvent.setup()
    usePurchaseStore.setState({
      open: createOpenPurchase(),
      history: [
        {
          id: 'closed-1',
          startedAt: '2026-11-12T09:00:00.000Z',
          closedAt: '2026-11-12T10:00:00.000Z',
          totalCents: 1000,
          lines: [
            {
              id: 'hl1',
              name: 'Rice',
              quantity: 1,
              unit: 'kg',
              price: 10,
              addedAt: '2026-11-12T09:30:00.000Z',
            },
          ],
        },
      ],
      migratedFromListV11: true,
    })
    renderPage()

    expect(screen.getByRole('heading', { name: /past purchases/i })).toBeInTheDocument()
    await user.click(screen.getByRole('button', { name: /\$10\.00/i }))
    const dialog = screen.getByRole('dialog')
    expect(dialog).toHaveTextContent('Rice')
    expect(dialog).toHaveTextContent(/total/i)
    expect(screen.queryByRole('button', { name: /remove rice/i })).not.toBeInTheDocument()
  })
})
