import { render, screen } from '@testing-library/react'
import { beforeEach, describe, expect, it } from 'vitest'
import { I18nextProvider } from 'react-i18next'
import { MemoryRouter } from 'react-router'
import i18n from '../../i18n'
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
})

describe('ListPage', () => {
  it('shows empty state and zero progress', () => {
    renderPage()
    expect(screen.getByRole('heading', { name: /shopping list/i })).toBeInTheDocument()
    expect(screen.getByText(/no items yet/i)).toBeInTheDocument()
    expect(screen.getByText(/0 of 0 done/i)).toBeInTheDocument()
  })

  it('renders persisted items and progress', () => {
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
    expect(screen.getByText('Milk')).toBeInTheDocument()
    expect(screen.getByText('Bread')).toBeInTheDocument()
    expect(screen.getByText(/1 of 2 done/i)).toBeInTheDocument()
  })
})
