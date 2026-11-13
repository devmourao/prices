import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import { I18nextProvider } from 'react-i18next'
import i18n from '../../i18n'
import { Sheet } from './Sheet'

describe('Sheet', () => {
  it('closes on Escape and restores focus', async () => {
    const user = userEvent.setup()
    const onClose = vi.fn()
    render(
      <I18nextProvider i18n={i18n}>
        <button type="button">Trigger</button>
        <Sheet title="Actions" onClose={onClose}>
          <button type="button">Primary</button>
        </Sheet>
      </I18nextProvider>,
    )

    expect(screen.getByRole('dialog', { name: 'Actions' })).toBeInTheDocument()
    await user.keyboard('{Escape}')
    expect(onClose).toHaveBeenCalled()
  })

  it('keeps Tab focus inside the dialog', async () => {
    const user = userEvent.setup()
    render(
      <I18nextProvider i18n={i18n}>
        <Sheet title="Actions" onClose={() => undefined}>
          <button type="button">First</button>
          <button type="button">Last</button>
        </Sheet>
      </I18nextProvider>,
    )

    const dialog = screen.getByRole('dialog')
    const close = screen.getByRole('button', { name: /close/i })
    const first = screen.getByRole('button', { name: 'First' })
    const last = screen.getByRole('button', { name: 'Last' })

    close.focus()
    await user.tab()
    expect(first).toHaveFocus()
    await user.tab()
    expect(last).toHaveFocus()
    await user.tab()
    expect(close).toHaveFocus()
    expect(dialog).toContainElement(document.activeElement as HTMLElement)
  })
})
