import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Share2 } from 'lucide-react'
import { Sheet } from '../../../components/ui/Sheet'
import { formatPrice, type AppLocale } from '../../../lib/currency'
import { formatReceiptText } from '../lib/formatReceiptText'
import { shareReceiptText } from '../lib/shareReceipt'
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
 * Read-only archived cupom in a bottom sheet (+ share).
 */
export function ClosedReceiptSheet({ purchase, locale, onClose }: ClosedReceiptSheetProps) {
  const { t } = useTranslation()
  const total = purchase.totalCents / 100
  const [shareStatus, setShareStatus] = useState<'idle' | 'copied' | 'failed'>('idle')

  const onShare = async () => {
    const title = t('receipt.title')
    const text = formatReceiptText({
      title,
      locale,
      startedAt: purchase.startedAt,
      closedAt: purchase.closedAt,
      lines: purchase.lines,
      total,
    })
    const result = await shareReceiptText(title, text)
    if (result === 'clipboard') {
      setShareStatus('copied')
      window.setTimeout(() => setShareStatus('idle'), 2500)
    } else if (result === null) {
      setShareStatus('failed')
      window.setTimeout(() => setShareStatus('idle'), 2500)
    }
  }

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
        <button
          type="button"
          onClick={() => {
            void onShare()
          }}
          className="flex min-h-[48px] items-center justify-center gap-2 rounded-xl border border-fg/15 px-4 font-medium text-fg focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
        >
          <Share2 size={18} aria-hidden="true" />
          {t('receipt.share')}
        </button>
        {shareStatus === 'copied' && (
          <p role="status" className="text-sm text-muted">
            {t('receipt.shareCopied')}
          </p>
        )}
        {shareStatus === 'failed' && (
          <p role="status" className="text-sm text-red-600 dark:text-red-400">
            {t('receipt.shareFailed')}
          </p>
        )}
      </div>
    </Sheet>
  )
}
