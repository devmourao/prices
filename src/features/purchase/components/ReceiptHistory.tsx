import { History } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { formatPrice, type AppLocale } from '../../../lib/currency'
import type { ClosedPurchase } from '../store/purchaseStore'

interface ReceiptHistoryProps {
  readonly history: readonly ClosedPurchase[]
  readonly locale: AppLocale
  readonly onOpen: (purchase: ClosedPurchase) => void
}

function formatClosedAt(iso: string, locale: AppLocale): string {
  const date = new Date(iso)
  if (Number.isNaN(date.getTime())) return iso
  return new Intl.DateTimeFormat(locale, {
    dateStyle: 'medium',
    timeStyle: 'short',
  }).format(date)
}

/**
 * Archived purchases (newest first, cap 20). Tap to open read-only cupom.
 */
export function ReceiptHistory({ history, locale, onOpen }: ReceiptHistoryProps) {
  const { t } = useTranslation()

  return (
    <section aria-labelledby="receipt-history-title" className="flex flex-col gap-3">
      <h2
        id="receipt-history-title"
        className="flex items-center gap-2 text-lg font-semibold text-fg"
      >
        <History size={18} aria-hidden="true" />
        {t('receipt.history.title')}
      </h2>

      {history.length === 0 ? (
        <p className="text-sm text-muted">{t('receipt.history.empty')}</p>
      ) : (
        <ul className="flex flex-col gap-2" aria-label={t('receipt.history.listLabel')}>
          {history.map((purchase) => (
            <li key={purchase.id}>
              <button
                type="button"
                onClick={() => onOpen(purchase)}
                className="flex min-h-[48px] w-full items-center justify-between gap-3 rounded-xl border border-fg/15 bg-surface px-4 py-3 text-left focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
              >
                <span className="min-w-0 flex-1">
                  <span className="block truncate font-medium text-fg">
                    {formatClosedAt(purchase.closedAt, locale)}
                  </span>
                  <span className="block text-xs text-muted">
                    {t('receipt.history.lineCount', { count: purchase.lines.length })}
                  </span>
                </span>
                <span className="shrink-0 font-mono text-sm font-semibold tabular-nums text-fg">
                  {formatPrice(purchase.totalCents / 100, locale)}
                </span>
              </button>
            </li>
          ))}
        </ul>
      )}
    </section>
  )
}
