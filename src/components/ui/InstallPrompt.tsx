import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Download, Share } from 'lucide-react'

interface BeforeInstallPromptEvent extends Event {
  readonly prompt: () => Promise<void>
  readonly userChoice: Promise<{ outcome: 'accepted' | 'dismissed'; platform: string }>
}

const DISMISS_KEY = 'prices-install-dismissed'

function isIosDevice(): boolean {
  if (typeof navigator === 'undefined') return false
  const ua = navigator.userAgent
  const iosUa = /iPad|iPhone|iPod/.test(ua)
  const iPadOs = navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1
  return iosUa || iPadOs
}

function isStandaloneDisplay(): boolean {
  if (typeof window === 'undefined') return false
  const media = window.matchMedia('(display-mode: standalone)').matches
  const iosStandalone =
    'standalone' in navigator &&
    Boolean((navigator as Navigator & { standalone?: boolean }).standalone)
  return media || iosStandalone
}

function wasDismissed(): boolean {
  try {
    return sessionStorage.getItem(DISMISS_KEY) === '1'
  } catch {
    return false
  }
}

function rememberDismiss(): void {
  try {
    sessionStorage.setItem(DISMISS_KEY, '1')
  } catch {
    // Session storage unavailable — dismiss lasts for this mount only.
  }
}

function shouldShowIosHint(): boolean {
  return !wasDismissed() && !isStandaloneDisplay() && isIosDevice()
}

/**
 * Install guidance for the supermarket PWA:
 * - Chromium: capture beforeinstallprompt and offer a one-tap install.
 * - iOS Safari: show Add to Home Screen steps (no beforeinstallprompt).
 * Hidden once installed, dismissed for the session, or unsupported.
 */
export function InstallPrompt() {
  const { t } = useTranslation()
  const [deferred, setDeferred] = useState<BeforeInstallPromptEvent | null>(null)
  const [iosHint] = useState(shouldShowIosHint)
  const [chromeVisible, setChromeVisible] = useState(false)
  const [dismissed, setDismissed] = useState(wasDismissed)

  useEffect(() => {
    if (wasDismissed() || isStandaloneDisplay()) return

    const onBeforeInstall = (event: Event) => {
      event.preventDefault()
      setDeferred(event as BeforeInstallPromptEvent)
      setChromeVisible(true)
    }

    window.addEventListener('beforeinstallprompt', onBeforeInstall)
    return () => window.removeEventListener('beforeinstallprompt', onBeforeInstall)
  }, [])

  const visible = !dismissed && ((chromeVisible && deferred !== null) || iosHint)
  if (!visible) return null

  const dismiss = () => {
    rememberDismiss()
    setDismissed(true)
    setChromeVisible(false)
    setDeferred(null)
  }

  const install = async () => {
    if (!deferred) return
    await deferred.prompt()
    await deferred.userChoice
    setDeferred(null)
    setChromeVisible(false)
    setDismissed(true)
  }

  const showIosOnly = iosHint && deferred === null

  return (
    <div
      role="status"
      className="flex flex-col gap-2 rounded-xl border border-fg/15 bg-surface p-3 shadow-sm"
    >
      <p className="text-sm font-medium text-fg">
        {showIosOnly ? t('pwa.installIosTitle') : t('pwa.installTitle')}
      </p>
      {showIosOnly ? (
        <p className="text-sm text-muted">{t('pwa.installIosHint')}</p>
      ) : (
        <p className="text-sm text-muted">{t('pwa.installBody')}</p>
      )}
      <div className="flex flex-wrap gap-2">
        {deferred && (
          <button
            type="button"
            onClick={() => void install()}
            className="inline-flex min-h-[44px] items-center justify-center gap-2 rounded-lg bg-accent px-4 text-sm font-semibold text-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
          >
            <Download size={16} aria-hidden="true" />
            {t('pwa.install')}
          </button>
        )}
        {showIosOnly && (
          <span className="inline-flex min-h-[44px] items-center gap-2 rounded-lg border border-fg/15 px-3 text-sm text-muted">
            <Share size={16} aria-hidden="true" />
            {t('pwa.installIosAction')}
          </span>
        )}
        <button
          type="button"
          onClick={dismiss}
          className="min-h-[44px] rounded-lg px-4 text-sm text-muted transition-colors hover:text-fg focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
        >
          {t('pwa.dismiss')}
        </button>
      </div>
    </div>
  )
}
