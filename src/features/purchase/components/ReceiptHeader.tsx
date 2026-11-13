import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Share2 } from 'lucide-react'
import type { AppLocale } from '../../../lib/currency'
import { formatReceiptText } from '../lib/formatReceiptText'
import { shareReceiptText } from '../lib/shareReceipt'
import type { OpenPurchase } from '../store/purchaseStore'
import { ReceiptBudget } from './ReceiptBudget'

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
 * Cupom header: started-at, budget, share, end purchase.
 */
export function ReceiptHeader({ open, locale, onEndPurchase }: ReceiptHeaderProps) {
  const { t } = useTranslation()
  const hasLines = open.lines.length > 0
  const [shareStatus, setShareStatus] = useState<'idle' | 'copied' | 'failed'>('idle')

  const onShare = async () => {
    if (!hasLines) return
    const title = t('receipt.title')
    const text = formatReceiptText({
      title,
      locale,
      startedAt: open.startedAt,
      lines: open.lines,
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
    <div className="flex flex-col gap-3 rounded-2xl border border-fg/15 border-t-4 border-t-accent bg-surface p-4 shadow-sm">
      <p className="text-sm text-muted">
        {t('receipt.started', { when: formatStartedAt(open.startedAt, locale) })}
      </p>

      <ReceiptBudget locale={locale} />

      <div className="flex flex-col gap-2 sm:flex-row">
        <button
          type="button"
          onClick={() => {
            void onShare()
          }}
          disabled={!hasLines}
          className="flex min-h-[48px] flex-1 items-center justify-center gap-2 rounded-xl border border-fg/15 px-4 font-medium text-fg focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent disabled:opacity-40"
        >
          <Share2 size={18} aria-hidden="true" />
          {t('receipt.share')}
        </button>
        <button
          type="button"
          onClick={onEndPurchase}
          disabled={!hasLines}
          className="min-h-[48px] flex-1 rounded-xl border border-fg/15 px-4 font-medium text-fg focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent disabled:opacity-40"
        >
          {t('receipt.endPurchase')}
        </button>
      </div>

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
  )
}
