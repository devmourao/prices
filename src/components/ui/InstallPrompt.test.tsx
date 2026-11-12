import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { beforeEach, describe, expect, it } from 'vitest'
import { I18nextProvider } from 'react-i18next'
import i18n from '../../i18n'
import { InstallPrompt } from './InstallPrompt'

function renderPrompt() {
  return render(
    <I18nextProvider i18n={i18n}>
      <InstallPrompt />
    </I18nextProvider>,
  )
}

beforeEach(() => {
  sessionStorage.clear()
})

describe('InstallPrompt', () => {
  it('offers install when beforeinstallprompt fires', async () => {
    const user = userEvent.setup()
    renderPrompt()

    const event = new Event('beforeinstallprompt') as Event & {
      preventDefault: () => void
      prompt: () => Promise<void>
      userChoice: Promise<{ outcome: 'accepted' | 'dismissed'; platform: string }>
    }
    Object.assign(event, {
      preventDefault: () => undefined,
      prompt: async () => undefined,
      userChoice: Promise.resolve({ outcome: 'dismissed' as const, platform: 'test' }),
    })
    window.dispatchEvent(event)

    expect(await screen.findByText(/install prices/i)).toBeInTheDocument()
    await user.click(screen.getByRole('button', { name: /not now/i }))
    expect(screen.queryByText(/install prices/i)).not.toBeInTheDocument()
    expect(sessionStorage.getItem('prices-install-dismissed')).toBe('1')
  })
})
