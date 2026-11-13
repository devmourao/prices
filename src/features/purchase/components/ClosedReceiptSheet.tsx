import { useTranslation } from 'react-i18next'
import { Sheet } from '../../../components/ui/Sheet'
import { formatPrice, type AppLocale } from '../../../lib/currency'
import type { ClosedPurchase } from '../store/purchaseStore'
import { ReceiptLines } from './ReceiptLines'

interface ClosedReceiptSheetProps {
  readonly purchase: ClosedPurchase
  readonly locale: AppLocale
  readonly onClose: () => void
}

function formatWhen(iso: string, locale: AppLocale): string {
  const date = new Date(iso)
  if (Number.isNaN(date.getTime())) return iso
  return new Intl.DateTimeFormat(locale, {
    dateStyle: 'medium',
    timeStyle: 'short',
  }).format(date)
}

/**
 * Read-only archived cupom in a bottom sheet.
 */
export function ClosedReceiptSheet({ purchase, locale, onClose }: ClosedReceiptSheetProps) {
  const { t } = useTranslation()
  const total = purchase.totalCents / 100

  return (
    <Sheet
      title={t('receipt.history.detailTitle', { when: formatWhen(purchase.closedAt, locale) })}
      onClose={onClose}
    >
      <div className="flex flex-col gap-3">
        <p className="text-sm text-muted">
          {t('receipt.history.summary', {
            count: purchase.lines.length,
            amount: formatPrice(total, locale),
          })}
        </p>
        <ReceiptLines lines={purchase.lines} locale={locale} />
        <p className="rounded-xl border border-fg/15 bg-bg px-4 py-3 text-lg font-semibold tabular-nums text-fg">
          {t('receipt.total', { amount: formatPrice(total, locale) })}
        </p>
      </div>
    </Sheet>
  )
}
