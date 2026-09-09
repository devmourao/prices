import {
  selectRankedProducts,
  selectWinnerId,
  useCalculatorStore,
} from '../store/calculatorStore'

/** Thin selector layer so components subscribe only to what they render. */
export function useProducts() {
  return useCalculatorStore((state) => state.products)
}

export function useRankedProducts() {
  return useCalculatorStore(selectRankedProducts)
}

export function useWinnerId() {
  return useCalculatorStore(selectWinnerId)
}

export function useCalculatorActions() {
  const addProduct = useCalculatorStore((state) => state.addProduct)
  const updateProduct = useCalculatorStore((state) => state.updateProduct)
  const removeProduct = useCalculatorStore((state) => state.removeProduct)
  const clearAll = useCalculatorStore((state) => state.clearAll)
  return { addProduct, updateProduct, removeProduct, clearAll }
}
