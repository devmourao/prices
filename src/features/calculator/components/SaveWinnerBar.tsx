import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { ListPlus } from 'lucide-react'
import { formatUnitPrice, type AppLocale } from '../../../lib/currency'
import { SaveWinnerDialog } from '../../list/components/SaveWinnerDialog'
import { useHandoffItem } from '../../list/hooks/useHandoffItem'
import { baseUnitOf, familyOf } from '../lib/units'
import { useComparison, useProducts } from '../hooks/useCalculator'

/**
 * Standalone Compare → list (SL-22). Hidden during list handoff (`?itemId=`).
 */
export function SaveWinnerBar({ locale }: { readonly locale: AppLocale }) {
  const { t } = useTranslation()
  const handoffItem = useHandoffItem()
  const comparison = useComparison()
  const products = useProducts()
  const [open, setOpen] = useState(false)

  if (handoffItem !== null) return null
  if (comparison.status !== 'ok' || comparison.tied) return null

  const winner = comparison.ranked[0]
  const fallbackIndex = products.findIndex((product) => product.id === winner.id) + 1
  const winnerName =
    winner.label.trim() === ''
      ? t('calculator.product.title', { index: Math.max(fallbackIndex, 1) })
      : winner.label.trim()

  return (
    <>
      <div className="flex flex-col gap-2 rounded-xl border border-fg/15 bg-surface p-3">
        <p className="text-sm text-muted">{t('list.saveWinner.hint')}</p>
        <button
          type="button"
          onClick={() => setOpen(true)}
          className="inline-flex min-h-[48px] items-center justify-center gap-2 rounded-xl bg-accent px-4 text-sm font-semibold text-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
        >
          <ListPlus size={18} aria-hidden="true" />
          {t('list.saveWinner.cta')}
        </button>
        <p className="text-xs text-muted">
          {winnerName} ·{' '}
          {formatUnitPrice(winner.unitPrice, baseUnitOf(familyOf(winner.unit)), locale)}
        </p>
      </div>

      {open && (
        <SaveWinnerDialog
          winner={winner}
          winnerName={winnerName}
          locale={locale}
          onClose={() => setOpen(false)}
        />
      )}
    </>
  )
}
