import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { formatPrice, type AppLocale } from '../../../lib/currency'
import {
  RECEIPT_CONFIRM_EVENT,
  type ReceiptConfirmDetail,
} from '../lib/confirmFeedback'

const TOAST_MS = 3500

/**
 * Ephemeral status after confirmPurchase — aria-live polite, auto-dismiss.
 */
export function ConfirmToast() {
  const { t, i18n } = useTranslation()
  const [detail, setDetail] = useState<ReceiptConfirmDetail | null>(null)
  const locale: AppLocale = i18n.language === 'pt-BR' ? 'pt-BR' : 'en'

  useEffect(() => {
    const onConfirm = (event: Event) => {
      const custom = event as CustomEvent<ReceiptConfirmDetail>
      if (custom.detail === undefined) return
      setDetail(custom.detail)
    }
    window.addEventListener(RECEIPT_CONFIRM_EVENT, onConfirm)
    return () => window.removeEventListener(RECEIPT_CONFIRM_EVENT, onConfirm)
  }, [])

  useEffect(() => {
    if (detail === null) return
    const timer = window.setTimeout(() => setDetail(null), TOAST_MS)
    return () => window.clearTimeout(timer)
  }, [detail])

  if (detail === null) return null

  return (
    <div
      role="status"
      aria-live="polite"
      className="fixed inset-x-0 top-0 z-50 mx-auto flex w-full max-w-xl items-center justify-between gap-2 border-b border-fg/15 bg-bg/95 px-4 py-3 shadow-sm backdrop-blur"
    >
      <span className="text-sm font-medium text-fg">
        {t('receipt.toast.added', {
          name: detail.name,
          amount: formatPrice(detail.total, locale),
        })}
      </span>
      <button
        type="button"
        onClick={() => setDetail(null)}
        className="min-h-[44px] shrink-0 rounded-lg px-3 text-sm text-muted hover:text-fg focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
      >
        {t('receipt.toast.dismiss')}
      </button>
    </div>
  )
}
