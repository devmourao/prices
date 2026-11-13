import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { ContactFooter } from '../../components/ui/ContactFooter'
import { InstallPrompt } from '../../components/ui/InstallPrompt'
import { LanguageToggle } from '../../components/ui/LanguageToggle'
import { OfflineBadge } from '../../components/ui/OfflineBadge'
import { ThemeToggle } from '../../components/ui/ThemeToggle'
import type { AppLocale } from '../../lib/currency'
import { ClosedReceiptSheet } from './components/ClosedReceiptSheet'
import { ReceiptHeader } from './components/ReceiptHeader'
import { ReceiptHistory } from './components/ReceiptHistory'
import { ReceiptLines } from './components/ReceiptLines'
import { ReceiptTotal } from './components/ReceiptTotal'
import {
  useOpenPurchase,
  useOpenPurchaseTotal,
  usePurchaseActions,
  usePurchaseHistory,
} from './hooks/usePurchase'
import type { ClosedPurchase } from './store/purchaseStore'

/**
 * Open cupom + archived history (read-only sheet).
 */
export function ReceiptPage() {
  const { t, i18n } = useTranslation()
  const open = useOpenPurchase()
  const total = useOpenPurchaseTotal()
  const history = usePurchaseHistory()
  const { removeLine, endPurchase } = usePurchaseActions()
  const [selected, setSelected] = useState<ClosedPurchase | null>(null)
  const locale: AppLocale = i18n.language === 'pt-BR' ? 'pt-BR' : 'en'

  const confirmEnd = () => {
    if (open.lines.length === 0) return
    if (!window.confirm(t('receipt.confirmEnd'))) return
    endPurchase()
  }

  return (
    <div className="mx-auto flex w-full max-w-xl flex-col gap-4 px-4 py-6">
      <header className="flex items-start justify-between gap-2">
        <div className="flex flex-col gap-1">
          <h1 className="text-2xl font-bold text-fg">{t('receipt.title')}</h1>
          <p className="text-muted">{t('receipt.tagline')}</p>
          <OfflineBadge />
        </div>
        <div className="flex items-center gap-2">
          <LanguageToggle />
          <ThemeToggle />
        </div>
      </header>

      <InstallPrompt />

      <ReceiptHeader open={open} locale={locale} onEndPurchase={confirmEnd} />

      {open.lines.length === 0 ? (
        <p className="text-muted">{t('receipt.empty')}</p>
      ) : (
        <>
          <ReceiptLines lines={open.lines} locale={locale} onRemove={removeLine} />
          <ReceiptTotal total={total} locale={locale} />
        </>
      )}

      <ReceiptHistory history={history} locale={locale} onOpen={setSelected} />

      <ContactFooter />

      {selected !== null && (
        <ClosedReceiptSheet
          purchase={selected}
          locale={locale}
          onClose={() => setSelected(null)}
        />
      )}
    </div>
  )
}
