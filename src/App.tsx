import { BrowserRouter, Navigate, Route, Routes } from 'react-router'
import { BottomNav } from './components/ui/BottomNav'
import { UpdatePrompt } from './components/ui/UpdatePrompt'
import { CalculatorPage } from './features/calculator/CalculatorPage'
import { ListPage } from './features/list/ListPage'

/**
 * App shell: List at `/`, Compare at `/compare`, shared update toast + bottom nav.
 */
function App() {
  return (
    <BrowserRouter>
      <UpdatePrompt />
      <main className="min-h-svh pb-24">
        <Routes>
          <Route path="/" element={<ListPage />} />
          <Route path="/compare" element={<CalculatorPage />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>
      <BottomNav />
    </BrowserRouter>
  )
}

export default App
