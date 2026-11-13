import { create } from 'zustand'
import { createJSONStorage, persist } from 'zustand/middleware'
import type { Unit } from '../../calculator/lib/units'

export type ListItemStatus = 'todo' | 'done'

export interface ListItem {
  readonly id: string
  name: string
  preferredUnit?: Unit
  status: ListItemStatus
  paidPrice?: number
  paidQuantity?: number
  paidUnit?: Unit
  updatedAt: string
}

export type PaidPatch = {
  readonly price: number
  readonly quantity?: number
  readonly unit?: Unit
}

interface ListState {
  readonly items: readonly ListItem[]
  addItem: (name: string) => void
  updateItem: (id: string, patch: Partial<Omit<ListItem, 'id'>>) => void
  removeItem: (id: string) => void
  markBought: (id: string, paid?: PaidPatch) => void
  clearDone: () => void
  clearAll: () => void
}

function nowIso(): string {
  return new Date().toISOString()
}

function createItem(name: string): ListItem {
  return {
    id: crypto.randomUUID(),
    name: name.trim(),
    status: 'todo',
    updatedAt: nowIso(),
  }
}

export const useListStore = create<ListState>()(
  persist(
    (set) => ({
      items: [],
      addItem: (name) => {
        const trimmed = name.trim()
        if (trimmed === '') return
        set((state) => ({ items: [...state.items, createItem(trimmed)] }))
      },
      updateItem: (id, patch) =>
        set((state) => ({
          items: state.items.map((item) =>
            item.id === id ? { ...item, ...patch, updatedAt: nowIso() } : item,
          ),
        })),
      removeItem: (id) =>
        set((state) => ({
          items: state.items.filter((item) => item.id !== id),
        })),
      markBought: (id, paid) =>
        set((state) => ({
          items: state.items.map((item) => {
            if (item.id !== id) return item
            return {
              ...item,
              status: 'done' as const,
              paidPrice: paid?.price,
              paidQuantity: paid?.quantity,
              paidUnit: paid?.unit,
              updatedAt: nowIso(),
            }
          }),
        })),
      clearDone: () =>
        set((state) => ({
          items: state.items.filter((item) => item.status !== 'done'),
        })),
      clearAll: () => set({ items: [] }),
    }),
    {
      name: 'prices-list',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({ items: state.items }),
    },
  ),
)
