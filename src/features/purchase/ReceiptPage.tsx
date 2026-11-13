import { useTranslation } from 'react-i18next'
import { ContactFooter } from '../../components/ui/ContactFooter'
import { InstallPrompt } from '../../components/ui/InstallPrompt'
import { LanguageToggle } from '../../components/ui/LanguageToggle'
import { OfflineBadge } from '../../components/ui/OfflineBadge'
import { ThemeToggle } from '../../components/ui/ThemeToggle'
import { formatPrice, type AppLocale } from '../../lib/currency'
import { useOpenPurchase, useOpenPurchaseTotal } from './hooks/usePurchase'

/**
 * Receipt foundation shell (Sprint R0): empty state + basic lines/total.
 * Cupom polish, end-purchase UI, and history land in R1/R2.
 */
export function ReceiptPage() {
  const { t, i18n } = useTranslation()
  const open = useOpenPurchase()
  const total = useOpenPurchaseTotal()
  const locale: AppLocale = i18n.language === 'pt-BR' ? 'pt-BR' : 'en'

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

      {open.lines.length === 0 ? (
        <p className="text-muted">{t('receipt.empty')}</p>
      ) : (
        <>
          <ul className="flex flex-col gap-2" aria-label={t('receipt.linesLabel')}>
            {open.lines.map((line) => (
              <li
                key={line.id}
                className="flex items-baseline justify-between gap-3 border-b border-fg/10 py-2 font-mono text-sm tabular-nums"
              >
                <span className="min-w-0 flex-1 truncate text-fg">
                  {line.name}
                  <span className="ml-2 text-muted">
                    {line.quantity}
                    {line.unit}
                  </span>
                </span>
                <span className="shrink-0 text-fg">{formatPrice(line.price, locale)}</span>
              </li>
            ))}
          </ul>

          <p
            className="sticky bottom-20 z-30 rounded-2xl border border-fg/15 bg-surface px-4 py-3 text-lg font-semibold tabular-nums text-fg shadow-sm"
            aria-live="polite"
          >
            {t('receipt.total', { amount: formatPrice(total, locale) })}
          </p>
        </>
      )}

      <ContactFooter />
    </div>
  )
}
