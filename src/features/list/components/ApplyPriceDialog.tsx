import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router'
import { Sheet } from '../../../components/ui/Sheet'
import {
  formatPrice,
  formatUnitPrice,
  type AppLocale,
} from '../../../lib/currency'
import { baseUnitOf, familyOf, type RankedEntry } from '../../calculator/lib/units'
import { confirmPurchaseWithFeedback } from '../../purchase/lib/confirmFeedback'
import { useListActions } from '../hooks/useList'
import type { ListItem } from '../store/listStore'

interface ApplyPriceDialogProps {
  readonly item: ListItem
  readonly winner: RankedEntry
  readonly locale: AppLocale
  readonly onClose: () => void
}

/**
 * Apply the compared winner: (A) confirmPurchase → receipt, or (B) price only on list.
 */
export function ApplyPriceDialog({ item, winner, locale, onClose }: ApplyPriceDialogProps) {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const { updateItem } = useListActions()

  const paid = {
    price: winner.price,
    quantity: winner.quantity,
    unit: winner.unit,
  }

  const goHome = () => {
    onClose()
    void navigate('/')
  }

  const applyAndMarkDone = () => {
    confirmPurchaseWithFeedback({
      name: item.name,
      price: paid.price,
      quantity: paid.quantity,
      unit: paid.unit,
      unitPrice: winner.unitPrice,
      sourceItemId: item.id,
    })
    goHome()
  }

  const applyPriceOnly = () => {
    updateItem(item.id, {
      paidPrice: paid.price,
      paidQuantity: paid.quantity,
      paidUnit: paid.unit,
    })
    goHome()
  }

  const winnerName =
    winner.label.trim() === '' ? t('calculator.product.title', { index: 1 }) : winner.label

  return (
    <Sheet title={t('list.handoff.applyTitle')} onClose={onClose}>
      <div className="flex flex-col gap-3">
        <p className="text-sm text-muted">
          {t('list.handoff.applyBody', { name: item.name })}
        </p>
        <div className="rounded-xl border border-fg/15 bg-bg p-3">
          <p className="font-medium text-fg">{winnerName}</p>
          <p className="text-sm text-muted">
            {formatPrice(winner.price, locale)} ·{' '}
            {formatUnitPrice(winner.unitPrice, baseUnitOf(familyOf(winner.unit)), locale)}
          </p>
        </div>
        <button
          type="button"
          onClick={applyAndMarkDone}
          className="min-h-[48px] rounded-xl bg-accent px-4 font-semibold text-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
        >
          {t('list.handoff.applyAndDone')}
        </button>
        <button
          type="button"
          onClick={applyPriceOnly}
          className="min-h-[48px] rounded-xl border border-fg/15 px-4 font-medium text-fg focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
        >
          {t('list.handoff.applyPriceOnly')}
        </button>
        <button
          type="button"
          onClick={onClose}
          className="min-h-[44px] rounded-xl px-4 text-sm text-muted focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
        >
          {t('list.item.back')}
        </button>
      </div>
    </Sheet>
  )
}
