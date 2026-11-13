import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter } from 'react-router'
import { describe, expect, it } from 'vitest'
import { I18nextProvider } from 'react-i18next'
import i18n from '../../i18n'
import { BottomNav } from './BottomNav'

function renderNav(initialPath = '/') {
  return render(
    <I18nextProvider i18n={i18n}>
      <MemoryRouter initialEntries={[initialPath]}>
        <BottomNav />
      </MemoryRouter>
    </I18nextProvider>,
  )
}

describe('BottomNav', () => {
  it('marks List as current on /', () => {
    renderNav('/')
    expect(screen.getByRole('link', { name: /list/i })).toHaveAttribute('aria-current', 'page')
    expect(screen.getByRole('link', { name: /compare/i })).not.toHaveAttribute(
      'aria-current',
      'page',
    )
  })

  it('navigates to Compare', async () => {
    const user = userEvent.setup()
    renderNav('/')
    await user.click(screen.getByRole('link', { name: /compare/i }))
    expect(screen.getByRole('link', { name: /compare/i })).toHaveAttribute('aria-current', 'page')
  })
})
