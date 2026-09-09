import { useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import {
  formatPercent,
  formatUnitPrice,
  type AppLocale,
} from '../../../lib/currency'
import { useProducts } from '../hooks/useCalculator'
import {
  baseUnitOf,
  familyOf,
  overpayPct,
  rank,
  unitPricesEqual,
  type RankedEntry,
} from '../lib/units'
import { WinnerBadge } from './WinnerBadge'
import { accentFor } from '../../../components/ui/cardAccents'

/**
 * Ranked comparison. Only complete entries (price > 0, quantity > 0)
 * take part; mixed unit families render the guard message instead
 * of wrong math. Non-winners show how much MORE expensive they are
 * than the best value. Announced politely for screen readers.
 */
export function ResultsList() {
  const products = useProducts()
  const { t, i18n } = useTranslation()
  const locale: AppLocale = i18n.language === 'pt-BR' ? 'pt-BR' : 'en'

  const content = useMemo(() => {
    const comparable = products.filter(
      (product) => product.price > 0 && product.quantity > 0,
    )
    if (comparable.length < 2) return { status: 'need-more' as const }
    try {
      const ranked = rank(comparable)
      const tied =
        ranked.length > 1 &&
        unitPricesEqual(ranked[0].unitPrice, ranked[ranked.length - 1].unitPrice)
      return { status: 'ok' as const, ranked, tied }
    } catch {
      return { status: 'mixed' as const }
    }
  }, [products])

  return (
    <section aria-labelledby="results-title" aria-live="polite" className="flex flex-col gap-3 rounded-2xl border border-fg/15 border-t-4 border-t-accent bg-surface p-4 shadow-sm">
      <h2 id="results-title" className="text-lg font-semibold text-fg">
        {t('calculator.results.title')}
      </h2>

      {content.status === 'need-more' && <p className="text-muted">{t('calculator.results.needTwo')}</p>}

      {content.status === 'mixed' && (
        <p role="alert" className="text-sm text-red-600 dark:text-red-400">
          {t('calculator.results.cannotCompare')}
        </p>
      )}

      {content.status === 'ok' && (
        <>
          {content.tied && (
            <p role="status" className="text-sm font-medium text-fg">
              {t('calculator.results.tie')}
            </p>
          )}
          <ol className="flex flex-col gap-2">
            {content.ranked.map((entry, position) => (
              <ResultRow
                key={entry.id}
                entry={entry}
                locale={locale}
                isWinner={position === 0 && !content.tied}
                showOverpay={position > 0 && !content.tied}
                winnerPrice={content.ranked[0].unitPrice}
                fallbackIndex={products.findIndex((product) => product.id === entry.id) + 1}
              />
            ))}
          </ol>
        </>
      )}
    </section>
  )
}

interface ResultRowProps {
  readonly entry: RankedEntry
  readonly locale: AppLocale
  readonly isWinner: boolean
  readonly showOverpay: boolean
  readonly winnerPrice: number
  readonly fallbackIndex: number
}

function ResultRow({ entry, locale, isWinner, showOverpay, winnerPrice, fallbackIndex }: ResultRowProps) {
  const { t } = useTranslation()
  const accent = accentFor(fallbackIndex - 1)
  const name =
    entry.label.trim() === '' ? t('calculator.product.title', { index: fallbackIndex }) : entry.label
  return (
    <li
      className={
        isWinner
          ? 'flex animate-rise items-center justify-between gap-2 rounded-xl border border-accent bg-accent/10 p-3 shadow-md ring-1 ring-accent'
          : 'flex animate-rise items-center justify-between gap-2 rounded-xl border border-fg/15 bg-bg p-3'
      }
    >
      <div className="flex items-center gap-2">
        <span
          aria-hidden="true"
          className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-sm font-bold ${accent.chip}`}
        >
          {fallbackIndex}
        </span>
        <div className="flex flex-col gap-1">
          <span className="font-medium text-fg">{name}</span>
          <span className={isWinner ? 'text-base font-bold text-fg' : 'text-sm text-muted'}>
            {formatUnitPrice(entry.unitPrice, baseUnitOf(familyOf(entry.unit)), locale)}
          </span>
        </div>
      </div>
      {isWinner ? (
        <WinnerBadge />
      ) : showOverpay ? (
        <span className="text-sm font-medium text-fg">
          {t('calculator.results.moreExpensive', {
            pct: formatPercent(overpayPct(entry.unitPrice, winnerPrice), locale),
          })}
        </span>
      ) : null}
    </li>
  )
}
