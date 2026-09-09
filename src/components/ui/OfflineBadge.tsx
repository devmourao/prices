import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { WifiOff } from 'lucide-react'

/**
 * Connectivity indicator for the supermarket context (unstable signal).
 * Silent when online; shows a cached-version pill when offline.
 */
export function OfflineBadge() {
  const { t } = useTranslation()
  const [online, setOnline] = useState(() =>
    typeof navigator === 'undefined' ? true : navigator.onLine,
  )

  useEffect(() => {
    const goOnline = () => setOnline(true)
    const goOffline = () => setOnline(false)
    window.addEventListener('online', goOnline)
    window.addEventListener('offline', goOffline)
    return () => {
      window.removeEventListener('online', goOnline)
      window.removeEventListener('offline', goOffline)
    }
  }, [])

  if (online) return null

  return (
    <span
      role="status"
      className="inline-flex items-center gap-1.5 rounded-full border border-amber-500/40 bg-amber-500/10 px-2.5 py-1 text-xs font-medium text-amber-700 dark:text-amber-300"
    >
      <WifiOff size={14} aria-hidden="true" />
      {t('connectivity.offline')}
    </span>
  )
}
