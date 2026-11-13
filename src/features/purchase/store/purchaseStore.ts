import { create } from 'zustand'
import { createJSONStorage, persist } from 'zustand/middleware'
import type { Unit } from '../../calculator/lib/units'
import { useListStore } from '../../list/store/listStore'
import { purchaseTotalCents } from '../lib/purchaseTotals'

export const PURCHASE_HISTORY_CAP = 20

export type PurchaseLine = {
  readonly id: string
  readonly name: string
  readonly quantity: number
  readonly unit: Unit
  readonly price: number
  readonly unitPrice?: number
  readonly sourceItemId?: string
  readonly addedAt: string
}

export type OpenPurchase = {
  readonly id: string
  readonly startedAt: string
  readonly lines: readonly PurchaseLine[]
}

export type ClosedPurchase = OpenPurchase & {
  readonly closedAt: string
  readonly totalCents: number
}

export type ConfirmPurchaseInput = {
  readonly name: string
  readonly price: number
  readonly quantity: number
  readonly unit: Unit
  readonly sourceItemId?: string
  readonly unitPrice?: number
}

interface PurchaseState {
  readonly open: OpenPurchase
  readonly history: readonly ClosedPurchase[]
  /** One-shot v1.1 done+price → lines migration flag (persisted). */
  readonly migratedFromListV11: boolean
  confirmPurchase: (input: ConfirmPurchaseInput) => void
  removeLine: (lineId: string) => void
  endPurchase: () => boolean
  clearOpen: () => void
}

function nowIso(): string {
  return new Date().toISOString()
}

export function createOpenPurchase(): OpenPurchase {
  return {
    id: crypto.randomUUID(),
    startedAt: nowIso(),
    lines: [],
  }
}

export const usePurchaseStore = create<PurchaseState>()(
  persist(
    (set, get) => ({
      open: createOpenPurchase(),
      history: [],
      migratedFromListV11: false,
      confirmPurchase: (input) => {
        const name = input.name.trim()
        if (name === '') return
        if (!Number.isFinite(input.price) || input.price < 0) return
        if (!Number.isFinite(input.quantity) || input.quantity <= 0) return

        const line: PurchaseLine = {
          id: crypto.randomUUID(),
          name,
          quantity: input.quantity,
          unit: input.unit,
          price: input.price,
          unitPrice: input.unitPrice,
          sourceItemId: input.sourceItemId,
          addedAt: nowIso(),
        }

        set((state) => ({
          open: {
            ...state.open,
            lines: [...state.open.lines, line],
          },
        }))

        if (input.sourceItemId) {
          useListStore.getState().removeItem(input.sourceItemId)
        }
      },
      removeLine: (lineId) =>
        set((state) => ({
          open: {
            ...state.open,
            lines: state.open.lines.filter((line) => line.id !== lineId),
          },
        })),
      endPurchase: () => {
        const { open, history } = get()
        if (open.lines.length === 0) return false
        const closed: ClosedPurchase = {
          ...open,
          closedAt: nowIso(),
          totalCents: purchaseTotalCents(open.lines),
        }
        set({
          open: createOpenPurchase(),
          history: [closed, ...history].slice(0, PURCHASE_HISTORY_CAP),
        })
        return true
      },
      clearOpen: () =>
        set((state) => ({
          open: {
            ...state.open,
            lines: [],
          },
        })),
    }),
    {
      name: 'prices-purchase',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        open: state.open,
        history: state.history,
        migratedFromListV11: state.migratedFromListV11,
      }),
    },
  ),
)
