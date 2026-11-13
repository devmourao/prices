import { useMemo } from 'react'
import { useSearchParams } from 'react-router'
import { useListItems } from './useList'
import type { ListItem } from '../store/listStore'

/** Resolves the list item referenced by `?itemId=` on /compare. */
export function useHandoffItem(): ListItem | null {
  const [params] = useSearchParams()
  const itemId = params.get('itemId')
  const items = useListItems()

  return useMemo(() => {
    if (itemId === null || itemId === '') return null
    return items.find((item) => item.id === itemId) ?? null
  }, [itemId, items])
}

export function useHandoffItemId(): string | null {
  const [params] = useSearchParams()
  return params.get('itemId')
}
