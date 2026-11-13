import { useEffect, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Link } from 'react-router'
import { ArrowLeft, ListChecks } from 'lucide-react'
import { formatUnitPrice, type AppLocale } from '../../../lib/currency'
import { ApplyPriceDialog } from '../../list/components/ApplyPriceDialog'
import { useHandoffItem } from '../../list/hooks/useHandoffItem'
import { seedCalculatorForListItem } from '../../list/lib/handoff'
import { baseUnitOf, familyOf } from '../lib/units'
import { useComparison } from '../hooks/useCalculator'
import { useCalculatorStore } from '../store/calculatorStore'

/**
 * List → Compare chrome: context banner, back link, apply-winner CTA.
 * Deep links re-seed after calculator persist hydration when needed.
 */
export function HandoffBar({ locale }: { readonly locale: AppLocale }) {
  const { t } = useTranslation()
  const item = useHandoffItem()
  const comparison = useComparison()
  const [applyOpen, setApplyOpen] = useState(false)
  const seededFor = useRef<string | null>(null)

  useEffect(() => {
    if (item === null) {
      seededFor.current = null
      return
    }
    if (seededFor.current === item.id) return

    const seedIfNeeded = () => {
      if (seededFor.current === item.id) return
      const products = useCalculatorStore.getState().products
      const alreadyLabeled =
        products.length >= 2 && products.every((product) => product.label === item.name)
      if (!alreadyLabeled) {
        seedCalculatorForListItem(item)
      }
      seededFor.current = item.id
    }

    const persist = useCalculatorStore.persist
    if (persist.hasHydrated()) {
      seedIfNeeded()
      return
    }
    return persist.onFinishHydration(seedIfNeeded)
  }, [item])

  if (item === null) return null

  const winner =
    comparison.status === 'ok' && !comparison.tied ? comparison.ranked[0] : null

  return (
    <>
      <div
        role="status"
        className="flex flex-col gap-2 rounded-xl border border-accent/40 bg-accent/10 p-3"
      >
        <p className="text-sm font-medium text-fg">
          {t('list.handoff.comparing', { name: item.name })}
        </p>
        <div className="flex flex-wrap gap-2">
          <Link
            to="/"
            className="inline-flex min-h-[44px] items-center gap-2 rounded-lg border border-fg/15 px-3 text-sm font-medium text-fg focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
          >
            <ArrowLeft size={16} aria-hidden="true" />
            {t('list.handoff.backToList')}
          </Link>
          {winner !== null && (
            <button
              type="button"
              onClick={() => setApplyOpen(true)}
              className="inline-flex min-h-[44px] items-center gap-2 rounded-lg bg-accent px-3 text-sm font-semibold text-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
            >
              <ListChecks size={16} aria-hidden="true" />
              {t('list.handoff.usePrice')}
            </button>
          )}
        </div>
        {winner !== null && (
          <p className="text-xs text-muted">
            {formatUnitPrice(winner.unitPrice, baseUnitOf(familyOf(winner.unit)), locale)}
          </p>
        )}
        {comparison.status === 'ok' && comparison.tied && (
          <p className="text-xs text-muted">{t('list.handoff.tieHint')}</p>
        )}
      </div>

      {applyOpen && winner !== null && (
        <ApplyPriceDialog
          item={item}
          winner={winner}
          locale={locale}
          onClose={() => setApplyOpen(false)}
        />
      )}
    </>
  )
}
