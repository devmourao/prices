import { useTranslation } from 'react-i18next'
import { BookmarkPlus, History, Trash2 } from 'lucide-react'
import { formatUnitPrice, type AppLocale } from '../../../lib/currency'
import { useProducts } from '../hooks/useCalculator'
import { baseUnitOf, familyOf, rank, type PricedEntry } from '../lib/units'
import { useHistoryEntries, useHistoryStore } from '../store/historyStore'

/**
 * Local comparison history. Snapshots live in localStorage only.
 * Tapping a row restores that comparison; the trash icon deletes it.
 */
export function HistoryPanel() {
  const { t, i18n } = useTranslation()
  const products = useProducts()
  const entries = useHistoryEntries()
  const saveSnapshot = useHistoryStore((state) => state.saveSnapshot)
  const restoreSnapshot = useHistoryStore((state) => state.restoreSnapshot)
  const removeSnapshot = useHistoryStore((state) => state.removeSnapshot)
  const clearHistory = useHistoryStore((state) => state.clearHistory)

  const comparableCount = products.filter(
    (product) => product.price > 0 && product.quantity > 0,
  ).length
  const locale: AppLocale = i18n.language === 'pt-BR' ? 'pt-BR' : 'en'

  return (
    <section aria-labelledby="history-title" className="flex flex-col gap-3">
      <div className="flex items-center justify-between gap-2">
        <h2 id="history-title" className="flex items-center gap-2 text-lg font-semibold text-fg">
          <History size={18} aria-hidden="true" />
          {t('calculator.history.title')}
        </h2>
        {entries.length > 0 && (
          <button
            type="button"
            onClick={clearHistory}
            className="min-h-[44px] rounded-lg px-3 text-sm text-muted transition-colors hover:text-fg focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
          >
            {t('calculator.history.clear')}
          </button>
        )}
      </div>

      <button
        type="button"
        disabled={comparableCount < 2}
        onClick={() => saveSnapshot(products)}
        className="flex min-h-[44px] items-center justify-center gap-2 rounded-xl border border-fg/15 px-4 text-sm font-medium text-fg transition-colors hover:border-fg/30 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent disabled:cursor-not-allowed disabled:opacity-40"
      >
        <BookmarkPlus size={18} aria-hidden="true" />
        {t('calculator.history.save')}
      </button>

      {entries.length === 0 ? (
        <p className="text-sm text-muted">{t('calculator.history.empty')}</p>
      ) : (
        <ol className="flex flex-col gap-2">
          {entries.map((entry) => (
            <HistoryRow
              key={entry.id}
              createdAt={entry.createdAt}
              productCount={entry.products.length}
              winner={winnerOf(entry.products)}
              locale={locale}
              onRestore={() => restoreSnapshot(entry.id)}
              onRemove={() => removeSnapshot(entry.id)}
            />
          ))}
        </ol>
      )}
    </section>
  )
}

interface WinnerInfo {
  readonly name: string
  readonly unitPrice: number
  readonly unit: PricedEntry['unit']
}

function winnerOf(products: readonly PricedEntry[]): WinnerInfo | null {
  try {
    const ranked = rank(products)
    if (ranked.length === 0) return null
    const { label, unitPrice, unit } = ranked[0]
    return { name: label, unitPrice, unit }
  } catch {
    return null
  }
}

interface HistoryRowProps {
  readonly createdAt: string
  readonly productCount: number
  readonly winner: WinnerInfo | null
  readonly locale: AppLocale
  readonly onRestore: () => void
  readonly onRemove: () => void
}

function HistoryRow({ createdAt, productCount, winner, locale, onRestore, onRemove }: HistoryRowProps) {
  const { t } = useTranslation()
  const when = new Intl.DateTimeFormat(locale, {
    dateStyle: 'short',
    timeStyle: 'short',
  }).format(new Date(createdAt))
  const detail =
    winner === null
      ? when
      : winner.name.trim() === ''
        ? `${when} • ${formatUnitPrice(winner.unitPrice, baseUnitOf(familyOf(winner.unit)), locale)}`
        : `${when} • ${t('calculator.history.winner', { name: winner.name })} — ${formatUnitPrice(winner.unitPrice, baseUnitOf(familyOf(winner.unit)), locale)}`
  return (
    <li className="flex items-center justify-between gap-2 rounded-xl border border-fg/15 bg-surface p-3">
      <button
        type="button"
        onClick={onRestore}
        aria-label={`${t('calculator.history.restore')}: ${t('calculator.history.summary', { count: productCount })}, ${detail}`}
        className="flex min-h-[44px] flex-1 flex-col items-start gap-0.5 rounded-lg text-left focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
      >
        <span className="text-sm font-medium text-fg">
          {t('calculator.history.summary', { count: productCount })}
        </span>
        <span className="text-xs text-muted">{detail}</span>
      </button>
      <button
        type="button"
        onClick={onRemove}
        aria-label={t('calculator.history.remove')}
        className="flex min-h-[44px] min-w-[44px] items-center justify-center rounded-lg text-muted transition-colors hover:text-fg focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
      >
        <Trash2 size={18} aria-hidden="true" />
      </button>
    </li>
  )
}
