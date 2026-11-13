import { render, screen } from '@testing-library/react'
import { beforeEach, describe, expect, it } from 'vitest'
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

beforeEach(() => {
  localStorage.clear()
  usePurchaseStore.setState({
    open: createOpenPurchase(),
    history: [],
    migratedFromListV11: false,
  })
})

describe('ReceiptPage', () => {
  it('shows empty state', () => {
    renderPage()
    expect(screen.getByRole('heading', { name: /receipt/i })).toBeInTheDocument()
    expect(screen.getByText(/confirm items from the list/i)).toBeInTheDocument()
  })

  it('lists open lines and total', () => {
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
    renderPage()
    expect(screen.getByText('Milk')).toBeInTheDocument()
    expect(screen.getByText('Bread')).toBeInTheDocument()
    expect(screen.getByText(/total/i)).toBeInTheDocument()
  })
})
