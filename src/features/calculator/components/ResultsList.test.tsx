import { render, screen } from '@testing-library/react'
import { beforeEach, describe, expect, it } from 'vitest'
import { I18nextProvider } from 'react-i18next'
import i18n from '../../../i18n'
import { useCalculatorStore, type Product } from '../store/calculatorStore'
import { ResultsList } from './ResultsList'

function product(overrides: Partial<Product> & { id: string }): Product {
  return { label: '', price: 0, quantity: 1, unit: 'L', ...overrides }
}

function renderResults() {
  return render(
    <I18nextProvider i18n={i18n}>
      <ResultsList />
    </I18nextProvider>,
  )
}

beforeEach(() => {
  localStorage.clear()
  useCalculatorStore.setState({
    products: [product({ id: 'a' }), product({ id: 'b' })],
  })
})

describe('ResultsList', () => {
  it('asks for two complete products when inputs are incomplete', () => {
    renderResults()
    expect(screen.getByText(/at least two products/i)).toBeInTheDocument()
  })

  it('shows the mixed-family guard', () => {
    useCalculatorStore.setState({
      products: [
        product({ id: 'a', price: 10, quantity: 2, unit: 'L' }),
        product({ id: 'b', price: 10, quantity: 2, unit: 'kg' }),
      ],
    })
    renderResults()
    expect(screen.getByRole('alert')).toHaveTextContent(/different unit families/i)
  })

  it('announces a tie for equal unit prices', () => {
    useCalculatorStore.setState({
      products: [
        product({ id: 'a', label: 'A', price: 10, quantity: 2, unit: 'L' }),
        product({ id: 'b', label: 'B', price: 7.5, quantity: 1.5, unit: 'L' }),
      ],
    })
    renderResults()
    expect(screen.getByRole('status')).toHaveTextContent(/tie/i)
  })

  it('badges the cheaper product', () => {
    useCalculatorStore.setState({
      products: [
        product({ id: 'a', label: 'A', price: 10, quantity: 2, unit: 'L' }),
        product({ id: 'b', label: 'B', price: 9, quantity: 2, unit: 'L' }),
      ],
    })
    renderResults()
    expect(screen.getByText(/best value/i)).toBeInTheDocument()
    expect(screen.getByText(/more expensive/i)).toBeInTheDocument()
  })
})
