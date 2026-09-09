import { create } from 'zustand'
import { createJSONStorage, persist } from 'zustand/middleware'
import { useCalculatorStore, type Product } from './calculatorStore'

export interface HistoryEntry {
  readonly id: string
  /** ISO timestamp of when the snapshot was taken. */
  readonly createdAt: string
  readonly products: readonly Product[]
}

interface HistoryState {
  readonly entries: readonly HistoryEntry[]
  /** Snapshots the current comparison. Only meaningful ones (2+ comparable). Capped at 20. */
  saveSnapshot: (products: readonly Product[]) => boolean
  restoreSnapshot: (id: string) => boolean
  removeSnapshot: (id: string) => void
  clearHistory: () => void
}

const MAX_ENTRIES = 20

function isComparable(product: Product): boolean {
  return product.price > 0 && product.quantity > 0
}

export const useHistoryStore = create<HistoryState>()(
  persist(
    (set, get) => ({
      entries: [],
      saveSnapshot: (products) => {
        if (products.filter(isComparable).length < 2) return false
        const entry: HistoryEntry = {
          id: crypto.randomUUID(),
          createdAt: new Date().toISOString(),
          products: products.map((product) => ({ ...product })),
        }
        set({ entries: [entry, ...get().entries].slice(0, MAX_ENTRIES) })
        return true
      },
      restoreSnapshot: (id) => {
        const entry = get().entries.find((candidate) => candidate.id === id)
        if (!entry) return false
        useCalculatorStore.setState({
          products: entry.products.map((product) => ({ ...product })),
        })
        return true
      },
      removeSnapshot: (id) =>
        set((state) => ({
          entries: state.entries.filter((entry) => entry.id !== id),
        })),
      clearHistory: () => set({ entries: [] }),
    }),
    {
      name: 'prices-history',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({ entries: state.entries }),
    },
  ),
)

export function useHistoryEntries() {
  return useHistoryStore((state) => state.entries)
}
