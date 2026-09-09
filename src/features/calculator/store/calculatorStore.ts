import { create } from 'zustand'
import { createJSONStorage, persist } from 'zustand/middleware'
import { rank, type RankedEntry, type Unit } from '../lib/units'

export interface Product {
  readonly id: string
  label: string
  price: number
  quantity: number
  unit: Unit
}

interface CalculatorState {
  readonly products: readonly Product[]
  addProduct: () => void
  updateProduct: (id: string, patch: Partial<Omit<Product, 'id'>>) => void
  removeProduct: (id: string) => void
  clearAll: () => void
}

function createProduct(): Product {
  return {
    id: crypto.randomUUID(),
    label: '',
    price: 0,
    quantity: 1,
    unit: 'L',
  }
}

export const useCalculatorStore = create<CalculatorState>()(
  persist(
    (set) => ({
      products: [createProduct(), createProduct()],
      addProduct: () =>
        set((state) => ({ products: [...state.products, createProduct()] })),
      updateProduct: (id, patch) =>
        set((state) => ({
          products: state.products.map((product) =>
            product.id === id ? { ...product, ...patch } : product,
          ),
        })),
      removeProduct: (id) =>
        set((state) => ({
          products: state.products.filter((product) => product.id !== id),
        })),
      clearAll: () => set({ products: [] }),
    }),
    {
      name: 'prices-calculator',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({ products: state.products }),
    },
  ),
)

/**
 * Ranked products or [] when the current inputs are not comparable
 * (mixed families, invalid values). Never throws: safe for rendering.
 */
export function selectRankedProducts(state: CalculatorState): RankedEntry[] {
  try {
    return rank(state.products)
  } catch {
    return []
  }
}

export function selectWinnerId(state: CalculatorState): string | null {
  const ranked = selectRankedProducts(state)
  return ranked.length > 0 ? ranked[0].id : null
}
