import { Trash2 } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { formatPrice, type AppLocale } from '../../../lib/currency'
import type { PurchaseLine } from '../store/purchaseStore'

interface ReceiptLinesProps {
  readonly lines: readonly PurchaseLine[]
  readonly locale: AppLocale
  /** When omitted, lines render read-only (archived cupom). */
  readonly onRemove?: (lineId: string) => void
}

/**
 * Cupom rows: name · qty+unit · amount; optional remove on open receipt.
 */
export function ReceiptLines({ lines, locale, onRemove }: ReceiptLinesProps) {
  const { t } = useTranslation()
  const editable = onRemove !== undefined

  return (
    <ul className="flex flex-col" aria-label={t('receipt.linesLabel')}>
      {lines.map((line) => (
        <li
          key={line.id}
          className={
            editable
              ? 'grid grid-cols-[minmax(0,1fr)_auto_auto] items-center gap-2 border-b border-dashed border-fg/15 py-3 font-mono text-sm tabular-nums'
              : 'grid grid-cols-[minmax(0,1fr)_auto] items-center gap-2 border-b border-dashed border-fg/15 py-3 font-mono text-sm tabular-nums'
          }
        >
          <div className="min-w-0">
            <p className="truncate font-medium text-fg">{line.name}</p>
            <p className="text-xs text-muted">
              {line.quantity}
              {line.unit}
            </p>
          </div>
          <span className="shrink-0 text-fg">{formatPrice(line.price, locale)}</span>
          {editable && (
            <button
              type="button"
              aria-label={t('receipt.removeLine', { name: line.name })}
              onClick={() => onRemove(line.id)}
              className="flex min-h-[44px] min-w-[44px] items-center justify-center rounded-lg text-muted hover:text-red-600 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent dark:hover:text-red-400"
            >
              <Trash2 size={16} aria-hidden="true" />
            </button>
          )}
        </li>
      ))}
    </ul>
  )
}
