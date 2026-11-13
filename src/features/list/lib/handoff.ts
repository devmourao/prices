import {
  buildSeededProducts,
  useCalculatorStore,
} from '../../calculator/store/calculatorStore'
import type { ListItem } from '../store/listStore'
import { useListStore } from '../store/listStore'

/** Seeds the calculator scratchpad from a list item (call before navigate). */
export function seedCalculatorForListItem(item: ListItem): void {
  const unit = item.preferredUnit ?? 'L'
  useCalculatorStore.getState().replaceProducts(buildSeededProducts(item.name, unit))
}

export function findListItem(itemId: string | null): ListItem | null {
  if (itemId === null || itemId === '') return null
  return useListStore.getState().items.find((item) => item.id === itemId) ?? null
}
