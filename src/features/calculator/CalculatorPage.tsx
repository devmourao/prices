import { useTranslation } from 'react-i18next'
import { Plus, RotateCcw } from 'lucide-react'
import { LanguageToggle } from '../../components/ui/LanguageToggle'
import { ContactFooter } from '../../components/ui/ContactFooter'
import { InstallPrompt } from '../../components/ui/InstallPrompt'
import { OfflineBadge } from '../../components/ui/OfflineBadge'
import { ThemeToggle } from '../../components/ui/ThemeToggle'
import type { AppLocale } from '../../lib/currency'
import { useCalculatorActions, useProducts } from './hooks/useCalculator'
import { HandoffBar } from './components/HandoffBar'
import { HistoryPanel } from './components/HistoryPanel'
import { ProductCard } from './components/ProductCard'
import { ResultsList } from './components/ResultsList'

/**
 * Mobile-first Compare view. Optional `?itemId=` enables list handoff:
 * seed labels, apply winner price back to the shopping list.
 */
export function CalculatorPage() {
  const { t, i18n } = useTranslation()
  const products = useProducts()
  const { addProduct, clearAll } = useCalculatorActions()
  const locale: AppLocale = i18n.language === 'pt-BR' ? 'pt-BR' : 'en'

  return (
    <div className="mx-auto flex w-full max-w-xl flex-col gap-4 px-4 py-6">
      <header className="flex items-start justify-between gap-2">
        <div className="flex flex-col gap-1">
          <h1 className="text-2xl font-bold text-fg">{t('app.title')}</h1>
          <p className="text-muted">{t('app.tagline')}</p>
          <OfflineBadge />
        </div>
        <div className="flex items-center gap-2">
          <LanguageToggle />
          <ThemeToggle />
        </div>
      </header>

      <InstallPrompt />

      <HandoffBar locale={locale} />

      <div className="flex flex-col gap-3">
        {products.map((product, position) => (
          <ProductCard key={product.id} product={product} index={position + 1} />
        ))}
      </div>

      <div className="flex gap-2">
        <button
          type="button"
          onClick={addProduct}
          className="flex min-h-[48px] flex-1 items-center justify-center gap-2 rounded-xl bg-accent px-4 font-semibold text-white transition-colors duration-200 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
        >
          <Plus size={20} aria-hidden="true" />
          {t('calculator.actions.addProduct')}
        </button>
        {products.length > 0 && (
          <button
            type="button"
            onClick={clearAll}
            aria-label={t('calculator.actions.clearAll')}
            title={t('calculator.actions.clearAll')}
            className="flex min-h-[48px] min-w-[48px] items-center justify-center rounded-xl border border-fg/15 text-muted transition-colors hover:text-fg focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
          >
            <RotateCcw size={20} aria-hidden="true" />
          </button>
        )}
      </div>

      <div className="sticky bottom-20 -mx-4 bg-bg/95 px-4 py-2 backdrop-blur">
        <ResultsList />
      </div>

      <HistoryPanel />

      <ContactFooter />
    </div>
  )
}
