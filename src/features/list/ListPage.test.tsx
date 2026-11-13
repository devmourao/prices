import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { beforeEach, describe, expect, it, vi } from 'vitest'
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
  vi.restoreAllMocks()
})

describe('ListPage', () => {
  it('shows empty state and zero progress', () => {
    renderPage()
    expect(screen.getByRole('heading', { name: /shopping list/i })).toBeInTheDocument()
    expect(screen.getByText(/no items yet/i)).toBeInTheDocument()
    expect(screen.getByText(/0 of 0 done/i)).toBeInTheDocument()
  })

  it('adds items quickly and updates progress', async () => {
    const user = userEvent.setup()
    renderPage()

    const input = screen.getByLabelText(/add item/i)
    await user.type(input, 'Milk{Enter}')
    await user.type(input, 'Bread{Enter}')

    expect(screen.getByText('Milk')).toBeInTheDocument()
    expect(screen.getByText('Bread')).toBeInTheDocument()
    expect(screen.getByText(/0 of 2 done/i)).toBeInTheDocument()
  })

  it('checks off an item from the checkbox', async () => {
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
    expect(screen.getByRole('checkbox', { name: /mark milk as not bought/i })).toHaveAttribute(
      'aria-checked',
      'true',
    )
    expect(screen.getByText(/1 of 1 done/i)).toBeInTheDocument()
  })

  it('marks bought with price from the sheet', async () => {
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
    await user.click(within(dialog).getByRole('button', { name: /^save$/i }))

    expect(useListStore.getState().items[0]).toMatchObject({
      status: 'done',
      paidPrice: 5.5,
    })
    expect(screen.getByText(/spent \$5\.50/i)).toBeInTheDocument()
  })

  it('clears bought items after confirm', async () => {
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
