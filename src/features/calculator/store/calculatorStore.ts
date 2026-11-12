import { create } from 'zustand'
import { createJSONStorage, persist } from 'zustand/middleware'
import {
  rank,
  rankedUnitPricesEqual,
  type RankedEntry,
  type Unit,
} from '../lib/units'

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

export type ComparisonStatus =
  | { readonly status: 'need-more' }
  | { readonly status: 'mixed' }
  | { readonly status: 'ok'; readonly ranked: RankedEntry[]; readonly tied: boolean }

function createProduct(): Product {
  return {
    id: crypto.randomUUID(),
    label: '',
    price: 0,
    quantity: 1,
    unit: 'L',
  }
}

export function isComparableProduct(product: Pick<Product, 'price' | 'quantity'>): boolean {
  return product.price > 0 && product.quantity > 0
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
 * Single comparison path shared by ResultsList and selectors.
 * Incomplete rows are excluded; mixed families become `mixed`.
 */
export function compareProducts(products: readonly Product[]): ComparisonStatus {
  const comparable = products.filter(isComparableProduct)
  if (comparable.length < 2) return { status: 'need-more' }
  try {
    const ranked = rank(comparable)
    const tied =
      ranked.length > 1 && rankedUnitPricesEqual(ranked[0], ranked[ranked.length - 1])
    return { status: 'ok', ranked, tied }
  } catch {
    return { status: 'mixed' }
  }
}

export function selectComparison(state: CalculatorState): ComparisonStatus {
  return compareProducts(state.products)
}

/**
 * Ranked products or [] when the current inputs are not comparable
 * (need more rows, mixed families, invalid values). Never throws.
 */
export function selectRankedProducts(state: CalculatorState): RankedEntry[] {
  const comparison = selectComparison(state)
  return comparison.status === 'ok' ? comparison.ranked : []
}

export function selectWinnerId(state: CalculatorState): string | null {
  const comparison = selectComparison(state)
  if (comparison.status !== 'ok' || comparison.tied) return null
  return comparison.ranked[0]?.id ?? null
}
