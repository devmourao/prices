import type { Unit } from '../../calculator/lib/units'
import type { ListItem } from '../store/listStore'
import { useListStore } from '../store/listStore'

function nowIso(): string {
  return new Date().toISOString()
}

/** Case-insensitive name match on the pending/done list. */
export function findListItemByName(name: string): ListItem | null {
  const needle = name.trim().toLowerCase()
  if (needle === '') return null
  return (
    useListStore.getState().items.find((item) => item.name.trim().toLowerCase() === needle) ??
    null
  )
}

/**
 * Returns an existing list item with the same name, or creates a new todo item.
 * Optionally sets preferredUnit when creating or when the match has none.
 */
export function ensureListItemForWinner(name: string, preferredUnit?: Unit): ListItem {
  const trimmed = name.trim()
  if (trimmed === '') {
    throw new RangeError('Winner name must be non-empty')
  }

  const existing = findListItemByName(trimmed)
  if (existing !== null) {
    if (preferredUnit !== undefined && existing.preferredUnit === undefined) {
      useListStore.getState().updateItem(existing.id, { preferredUnit })
      return useListStore.getState().items.find((item) => item.id === existing.id) ?? existing
    }
    return existing
  }

  const item: ListItem = {
    id: crypto.randomUUID(),
    name: trimmed,
    status: 'todo',
    preferredUnit,
    updatedAt: nowIso(),
  }
  useListStore.setState((state) => ({ items: [...state.items, item] }))
  return item
}
