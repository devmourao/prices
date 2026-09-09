import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'

export const PWA_UPDATE_EVENT = 'prices:pwa-update'

/**
 * Minimal update prompt: shown when the service worker fetched a newer
 * precache. Reload activates it; dismiss hides it for this session.
 */
export function UpdatePrompt() {
  const { t } = useTranslation()
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const show = () => setVisible(true)
    window.addEventListener(PWA_UPDATE_EVENT, show)
    return () => window.removeEventListener(PWA_UPDATE_EVENT, show)
  }, [])

  if (!visible) return null

  return (
    <div
      role="alert"
      className="fixed inset-x-0 top-0 z-50 mx-auto flex w-full max-w-xl flex-wrap items-center justify-between gap-2 border-b border-fg/15 bg-bg/95 px-4 py-3 shadow-sm backdrop-blur"
    >
      <span className="text-sm font-medium text-fg">{t('pwa.updateAvailable')}</span>
      <span className="flex gap-2">
        <button
          type="button"
          onClick={() => window.location.reload()}
          className="min-h-[44px] rounded-lg bg-accent px-4 text-sm font-semibold text-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
        >
          {t('pwa.reload')}
        </button>
        <button
          type="button"
          onClick={() => setVisible(false)}
          className="min-h-[44px] rounded-lg px-4 text-sm text-muted transition-colors hover:text-fg focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
        >
          {t('pwa.dismiss')}
        </button>
      </span>
    </div>
  )
}
