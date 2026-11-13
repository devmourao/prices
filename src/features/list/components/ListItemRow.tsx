import { useTranslation } from 'react-i18next'
import { formatPrice, type AppLocale } from '../../../lib/currency'
import { useListActions } from '../hooks/useList'
import type { ListItem } from '../store/listStore'

interface ListItemRowProps {
  readonly item: ListItem
  readonly locale: AppLocale
  readonly onOpen: () => void
  /** Opens the confirm-buy sheet (price required → receipt). */
  readonly onBuy: () => void
}

/**
 * Checklist row: checkbox opens confirm-buy; the rest opens the action menu.
 * Legacy done items can still be unchecked back to todo.
 */
export function ListItemRow({ item, locale, onOpen, onBuy }: ListItemRowProps) {
  const { t } = useTranslation()
  const { updateItem } = useListActions()
  const done = item.status === 'done'

  const toggle = () => {
    if (done) {
      updateItem(item.id, {
        status: 'todo',
        paidPrice: undefined,
        paidQuantity: undefined,
        paidUnit: undefined,
      })
      return
    }
    onBuy()
  }

  return (
    <li className="flex items-stretch gap-1 rounded-xl border border-fg/15 bg-surface">
      <button
        type="button"
        role="checkbox"
        aria-checked={done}
        aria-label={
          done
            ? t('list.item.markTodo', { name: item.name })
            : t('list.item.markDone', { name: item.name })
        }
        onClick={toggle}
        className="flex min-h-[48px] min-w-[48px] items-center justify-center rounded-l-xl text-accent focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
      >
        <span
          aria-hidden="true"
          className={
            done
              ? 'flex h-5 w-5 items-center justify-center rounded border-2 border-accent bg-accent text-xs font-bold text-white'
              : 'h-5 w-5 rounded border-2 border-fg/30'
          }
        >
          {done ? '✓' : ''}
        </span>
      </button>
      <button
        type="button"
        onClick={onOpen}
        className="flex min-h-[48px] flex-1 flex-col items-start justify-center gap-0.5 rounded-r-xl px-3 py-2 text-left focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
      >
        <span className={done ? 'text-muted line-through' : 'font-medium text-fg'}>{item.name}</span>
        {item.paidPrice !== undefined && (
          <span className="text-xs text-muted">{formatPrice(item.paidPrice, locale)}</span>
        )}
      </button>
    </li>
  )
}
