import { Link } from 'react-router'
import { useTranslation } from 'react-i18next'
import { Receipt } from 'lucide-react'
import { formatPrice, type AppLocale } from '../../../lib/currency'
import { useOpenPurchase, useOpenPurchaseTotal } from '../hooks/usePurchase'

interface ReceiptLinkChipProps {
  readonly locale: AppLocale
}

/**
 * Compact List → Receipt jump when the open purchase has lines.
 */
export function ReceiptLinkChip({ locale }: ReceiptLinkChipProps) {
  const { t } = useTranslation()
  const open = useOpenPurchase()
  const total = useOpenPurchaseTotal()

  if (open.lines.length === 0) return null

  return (
    <Link
      to="/receipt"
      className="inline-flex min-h-[44px] items-center gap-2 rounded-xl border border-accent/40 bg-accent/10 px-3 text-sm font-medium text-accent focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
    >
      <Receipt size={16} aria-hidden="true" />
      {t('receipt.chip', { amount: formatPrice(total, locale) })}
    </Link>
  )
}
