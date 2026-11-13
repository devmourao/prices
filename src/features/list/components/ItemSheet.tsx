import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router'
import { Calculator, Check, Pencil, Trash2 } from 'lucide-react'
import { Sheet } from '../../../components/ui/Sheet'
import { TextField } from '../../../components/ui/TextField'
import { UnitSelector } from '../../calculator/components/UnitSelector'
import { parseAmount } from '../../calculator/lib/parse'
import type { Unit } from '../../calculator/lib/units'
import { confirmPurchaseWithFeedback } from '../../purchase/lib/confirmFeedback'
import { useListActions } from '../hooks/useList'
import { seedCalculatorForListItem } from '../lib/handoff'
import type { ListItem } from '../store/listStore'

export type ItemSheetMode = 'menu' | 'buy' | 'edit'

interface ItemSheetProps {
  readonly item: ListItem
  readonly onClose: () => void
  readonly initialMode?: ItemSheetMode
}

/**
 * Item actions: confirm buy → receipt, compare, edit name, delete.
 * Price is required to create a purchase line (qty defaults to 1).
 */
export function ItemSheet({ item, onClose, initialMode = 'menu' }: ItemSheetProps) {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const { updateItem, removeItem } = useListActions()
  const [mode, setMode] = useState<ItemSheetMode>(initialMode)
  const [name, setName] = useState(item.name)
  const [priceText, setPriceText] = useState(
    item.paidPrice === undefined || item.paidPrice === 0 ? '' : String(item.paidPrice),
  )
  const [quantityText, setQuantityText] = useState(
    item.paidQuantity === undefined ? '1' : String(item.paidQuantity),
  )
  const [unit, setUnit] = useState<Unit>(item.paidUnit ?? item.preferredUnit ?? 'un')

  const price = parseAmount(priceText)
  const quantity = parseAmount(quantityText)
  const priceError =
    priceText.trim() === ''
      ? t('list.item.errors.priceRequired')
      : price === null || price <= 0
        ? t('list.item.errors.priceInvalid')
        : undefined
  const quantityError =
    quantityText.trim() === ''
      ? undefined
      : quantity === null || quantity <= 0
        ? t('list.item.errors.quantityPositive')
        : undefined

  const saveBuy = () => {
    if (priceError !== undefined || quantityError !== undefined) return
    if (price === null) return
    const qty = quantityText.trim() === '' || quantity === null ? 1 : quantity
    confirmPurchaseWithFeedback({
      name: item.name,
      price,
      quantity: qty,
      unit,
      sourceItemId: item.id,
    })
    onClose()
  }

  const saveEdit = () => {
    const trimmed = name.trim()
    if (trimmed === '') return
    updateItem(item.id, { name: trimmed })
    onClose()
  }

  const title =
    mode === 'buy'
      ? t('list.item.buyTitle')
      : mode === 'edit'
        ? t('list.item.editTitle')
        : item.name

  return (
    <Sheet title={title} onClose={onClose}>
      {mode === 'menu' && (
        <div className="flex flex-col gap-2">
          <button
            type="button"
            onClick={() => setMode('buy')}
            className="flex min-h-[48px] items-center gap-3 rounded-xl bg-accent px-4 font-semibold text-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
          >
            <Check size={18} aria-hidden="true" />
            {t('list.item.markBought')}
          </button>
          <button
            type="button"
            onClick={() => {
              seedCalculatorForListItem(item)
              onClose()
              void navigate(`/compare?itemId=${encodeURIComponent(item.id)}`)
            }}
            className="flex min-h-[48px] items-center gap-3 rounded-xl border border-fg/15 px-4 font-medium text-fg focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
          >
            <Calculator size={18} aria-hidden="true" />
            {t('list.item.compare')}
          </button>
          <button
            type="button"
            onClick={() => setMode('edit')}
            className="flex min-h-[48px] items-center gap-3 rounded-xl border border-fg/15 px-4 font-medium text-fg focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
          >
            <Pencil size={18} aria-hidden="true" />
            {t('list.item.edit')}
          </button>
          <button
            type="button"
            onClick={() => {
              removeItem(item.id)
              onClose()
            }}
            className="flex min-h-[48px] items-center gap-3 rounded-xl border border-red-500/30 px-4 font-medium text-red-600 dark:text-red-400 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
          >
            <Trash2 size={18} aria-hidden="true" />
            {t('list.item.delete')}
          </button>
        </div>
      )}

      {mode === 'buy' && (
        <div className="flex flex-col gap-3">
          <TextField
            id={`${item.id}-paid-price`}
            label={t('list.item.priceLabel')}
            value={priceText}
            placeholder={t('list.item.pricePlaceholder')}
            inputMode="decimal"
            error={priceText.trim() === '' ? undefined : priceError}
            onChange={setPriceText}
          />
          <TextField
            id={`${item.id}-paid-qty`}
            label={t('list.item.quantityLabel')}
            value={quantityText}
            placeholder={t('list.item.quantityPlaceholder')}
            inputMode="decimal"
            error={quantityError}
            onChange={setQuantityText}
          />
          <UnitSelector value={unit} onChange={setUnit} />
          <p className="text-sm text-muted">{t('list.item.priceRequiredHint')}</p>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => setMode('menu')}
              className="min-h-[48px] flex-1 rounded-xl border border-fg/15 px-4 text-muted focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
            >
              {t('list.item.back')}
            </button>
            <button
              type="button"
              onClick={saveBuy}
              disabled={priceError !== undefined || quantityError !== undefined}
              className="min-h-[48px] flex-1 rounded-xl bg-accent px-4 font-semibold text-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent disabled:opacity-40"
            >
              {t('list.item.saveBought')}
            </button>
          </div>
        </div>
      )}

      {mode === 'edit' && (
        <div className="flex flex-col gap-3">
          <TextField
            id={`${item.id}-edit-name`}
            label={t('list.item.nameLabel')}
            value={name}
            placeholder={t('list.add.placeholder')}
            onChange={setName}
          />
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => setMode('menu')}
              className="min-h-[48px] flex-1 rounded-xl border border-fg/15 px-4 text-muted focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
            >
              {t('list.item.back')}
            </button>
            <button
              type="button"
              onClick={saveEdit}
              disabled={name.trim() === ''}
              className="min-h-[48px] flex-1 rounded-xl bg-accent px-4 font-semibold text-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent disabled:opacity-40"
            >
              {t('list.item.saveEdit')}
            </button>
          </div>
        </div>
      )}
    </Sheet>
  )
}
