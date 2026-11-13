import { useTranslation } from 'react-i18next'
import { formatPrice, type AppLocale } from '../../../lib/currency'

interface ReceiptTotalProps {
  readonly total: number
  readonly locale: AppLocale
}

/**
 * Sticky cupom total above the bottom nav.
 */
export function ReceiptTotal({ total, locale }: ReceiptTotalProps) {
  const { t } = useTranslation()

  return (
    <p
      className="sticky bottom-20 z-30 rounded-2xl border border-fg/15 bg-surface px-4 py-3 text-lg font-semibold tabular-nums text-fg shadow-sm"
      aria-live="polite"
    >
      {t('receipt.total', { amount: formatPrice(total, locale) })}
    </p>
  )
}
