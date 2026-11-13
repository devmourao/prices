import { useEffect } from 'react'
import { BrowserRouter, Navigate, Route, Routes } from 'react-router'
import { BottomNav } from './components/ui/BottomNav'
import { UpdatePrompt } from './components/ui/UpdatePrompt'
import { CalculatorPage } from './features/calculator/CalculatorPage'
import { ListPage } from './features/list/ListPage'
import { applyListV11Migration } from './features/purchase/lib/migrateFromList'
import { ReceiptPage } from './features/purchase/ReceiptPage'
import { useListStore } from './features/list/store/listStore'
import { usePurchaseStore } from './features/purchase/store/purchaseStore'

function useListV11PurchaseMigration() {
  useEffect(() => {
    const tryMigrate = () => {
      if (!useListStore.persist.hasHydrated()) return
      if (!usePurchaseStore.persist.hasHydrated()) return
      applyListV11Migration()
    }

    tryMigrate()
    const unsubList = useListStore.persist.onFinishHydration(tryMigrate)
    const unsubPurchase = usePurchaseStore.persist.onFinishHydration(tryMigrate)
    return () => {
      unsubList()
      unsubPurchase()
    }
  }, [])
}

/**
 * App shell: List `/`, Compare `/compare`, Receipt `/receipt`,
 * shared update toast + three-destination bottom nav.
 */
function App() {
  useListV11PurchaseMigration()

  return (
    <BrowserRouter>
      <UpdatePrompt />
      <main className="min-h-svh pb-24">
        <Routes>
          <Route path="/" element={<ListPage />} />
          <Route path="/compare" element={<CalculatorPage />} />
          <Route path="/receipt" element={<ReceiptPage />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>
      <BottomNav />
    </BrowserRouter>
  )
}

export default App
