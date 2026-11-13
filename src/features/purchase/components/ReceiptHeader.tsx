import { useTranslation } from 'react-i18next'
import type { AppLocale } from '../../../lib/currency'
import type { OpenPurchase } from '../store/purchaseStore'

interface ReceiptHeaderProps {
  readonly open: OpenPurchase
  readonly locale: AppLocale
  readonly onEndPurchase: () => void
}

function formatStartedAt(iso: string, locale: AppLocale): string {
  const date = new Date(iso)
  if (Number.isNaN(date.getTime())) return iso
  return new Intl.DateTimeFormat(locale, {
    dateStyle: 'medium',
    timeStyle: 'short',
  }).format(date)
}

/**
 * Cupom header: started-at + End purchase (disabled when empty).
 */
export function ReceiptHeader({ open, locale, onEndPurchase }: ReceiptHeaderProps) {
  const { t } = useTranslation()
  const hasLines = open.lines.length > 0

  return (
    <div className="flex flex-col gap-2 rounded-2xl border border-fg/15 border-t-4 border-t-accent bg-surface p-4 shadow-sm">
      <p className="text-sm text-muted">
        {t('receipt.started', { when: formatStartedAt(open.startedAt, locale) })}
      </p>
      <button
        type="button"
        onClick={onEndPurchase}
        disabled={!hasLines}
        className="min-h-[48px] rounded-xl border border-fg/15 px-4 font-medium text-fg focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent disabled:opacity-40"
      >
        {t('receipt.endPurchase')}
      </button>
    </div>
  )
}
