import { useMemo } from 'react'
import { listProgress, listSpend } from '../lib/listTotals'
import { useListStore } from '../store/listStore'

export function useListItems() {
  return useListStore((state) => state.items)
}

export function useListActions() {
  const addItem = useListStore((state) => state.addItem)
  const restoreItem = useListStore((state) => state.restoreItem)
  const updateItem = useListStore((state) => state.updateItem)
  const removeItem = useListStore((state) => state.removeItem)
  const markBought = useListStore((state) => state.markBought)
  const clearDone = useListStore((state) => state.clearDone)
  const clearAll = useListStore((state) => state.clearAll)
  return { addItem, restoreItem, updateItem, removeItem, markBought, clearDone, clearAll }
}

export function useListProgress() {
  const items = useListItems()
  return useMemo(() => listProgress(items), [items])
}

export function useListSpend() {
  const items = useListItems()
  return useMemo(() => listSpend(items), [items])
}
