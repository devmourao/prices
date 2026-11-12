import { act, render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { beforeEach, describe, expect, it } from 'vitest'
import { I18nextProvider } from 'react-i18next'
import i18n from '../../../i18n'
import { useProducts } from '../hooks/useCalculator'
import { useCalculatorStore, type Product } from '../store/calculatorStore'
import { useHistoryStore } from '../store/historyStore'
import { ProductCard } from './ProductCard'

function product(overrides: Partial<Product> & { id: string }): Product {
  return { label: '', price: 0, quantity: 1, unit: 'L', ...overrides }
}

function ConnectedFirstCard() {
  const products = useProducts()
  const first = products[0]
  if (!first) return null
  return <ProductCard key={first.id} product={first} index={1} />
}

function renderConnected() {
  return render(
    <I18nextProvider i18n={i18n}>
      <ConnectedFirstCard />
    </I18nextProvider>,
  )
}

beforeEach(() => {
  localStorage.clear()
  useCalculatorStore.setState({
    products: [
      product({ id: 'a', label: 'Milk', price: 10, quantity: 2, unit: 'L' }),
      product({ id: 'b', label: 'Juice', price: 9, quantity: 2, unit: 'L' }),
    ],
  })
  useHistoryStore.getState().clearHistory()
})

describe('ProductCard', () => {
  it('does not flag an empty price as invalid on first paint', () => {
    useCalculatorStore.setState({
      products: [product({ id: 'a', price: 0, quantity: 1 })],
    })
    renderConnected()
    expect(screen.queryByRole('alert')).not.toBeInTheDocument()
  })

  it('flags a zero price after the user types it', async () => {
    const user = userEvent.setup()
    useCalculatorStore.setState({
      products: [product({ id: 'a', price: 0, quantity: 1 })],
    })
    renderConnected()
    await user.type(screen.getByLabelText(/price/i), '0')
    expect(screen.getByRole('alert')).toHaveTextContent(/valid price/i)
  })

  it('remounts with restored values after history restore', () => {
    renderConnected()
    expect(screen.getByLabelText(/^price$/i)).toHaveValue('10')

    act(() => {
      expect(useHistoryStore.getState().saveSnapshot(useCalculatorStore.getState().products)).toBe(
        true,
      )
      useCalculatorStore.setState({
        products: [
          product({ id: 'edited', label: 'Milk', price: 12, quantity: 2, unit: 'L' }),
          product({ id: 'b', label: 'Juice', price: 9, quantity: 2, unit: 'L' }),
        ],
      })
    })
    expect(screen.getByLabelText(/^price$/i)).toHaveValue('12')

    act(() => {
      expect(
        useHistoryStore.getState().restoreSnapshot(useHistoryStore.getState().entries[0].id),
      ).toBe(true)
    })

    expect(useCalculatorStore.getState().products[0].price).toBe(10)
    expect(screen.getByLabelText(/^price$/i)).toHaveValue('10')
    expect(screen.getByLabelText(/package size/i)).toHaveValue('2')
  })
})
