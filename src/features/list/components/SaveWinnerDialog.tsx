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
import { ensureListItemForWinner } from '../lib/saveWinner'

interface SaveWinnerDialogProps {
  readonly winner: RankedEntry
  readonly winnerName: string
  readonly locale: AppLocale
  readonly onClose: () => void
}

/**
 * Standalone Compare → list: match/create by name, then price-only or confirm→receipt.
 */
export function SaveWinnerDialog({
  winner,
  winnerName,
  locale,
  onClose,
}: SaveWinnerDialogProps) {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const { updateItem } = useListActions()

  const goHome = () => {
    onClose()
    void navigate('/')
  }

  const addAndMarkBought = () => {
    const item = ensureListItemForWinner(winnerName, winner.unit)
    confirmPurchaseWithFeedback({
      name: item.name,
      price: winner.price,
      quantity: winner.quantity,
      unit: winner.unit,
      unitPrice: winner.unitPrice,
      sourceItemId: item.id,
    })
    goHome()
  }

  const addPriceOnly = () => {
    const item = ensureListItemForWinner(winnerName, winner.unit)
    updateItem(item.id, {
      paidPrice: winner.price,
      paidQuantity: winner.quantity,
      paidUnit: winner.unit,
      preferredUnit: winner.unit,
    })
    goHome()
  }

  return (
    <Sheet title={t('list.saveWinner.title')} onClose={onClose}>
      <div className="flex flex-col gap-3">
        <p className="text-sm text-muted">{t('list.saveWinner.body', { name: winnerName })}</p>
        <div className="rounded-xl border border-fg/15 bg-bg p-3">
          <p className="font-medium text-fg">{winnerName}</p>
          <p className="text-sm text-muted">
            {formatPrice(winner.price, locale)} ·{' '}
            {formatUnitPrice(winner.unitPrice, baseUnitOf(familyOf(winner.unit)), locale)}
          </p>
        </div>
        <button
          type="button"
          onClick={addAndMarkBought}
          className="min-h-[48px] rounded-xl bg-accent px-4 font-semibold text-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
        >
          {t('list.saveWinner.addAndBought')}
        </button>
        <button
          type="button"
          onClick={addPriceOnly}
          className="min-h-[48px] rounded-xl border border-fg/15 px-4 font-medium text-fg focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
        >
          {t('list.saveWinner.addPriceOnly')}
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
