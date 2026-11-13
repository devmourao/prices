import { useTranslation } from 'react-i18next'
import { ContactFooter } from '../../components/ui/ContactFooter'
import { InstallPrompt } from '../../components/ui/InstallPrompt'
import { LanguageToggle } from '../../components/ui/LanguageToggle'
import { OfflineBadge } from '../../components/ui/OfflineBadge'
import { ThemeToggle } from '../../components/ui/ThemeToggle'
import { formatPrice, type AppLocale } from '../../lib/currency'
import { useListItems, useListProgress, useListSpend } from './hooks/useList'

/**
 * Shopping list shell (Sprint L0): progress + empty state.
 * Add/check/sheet land in Sprint L1; Compare stays on /compare.
 */
export function ListPage() {
  const { t, i18n } = useTranslation()
  const items = useListItems()
  const progress = useListProgress()
  const spend = useListSpend()
  const locale: AppLocale = i18n.language === 'pt-BR' ? 'pt-BR' : 'en'

  return (
    <div className="mx-auto flex w-full max-w-xl flex-col gap-4 px-4 py-6">
      <header className="flex items-start justify-between gap-2">
        <div className="flex flex-col gap-1">
          <h1 className="text-2xl font-bold text-fg">{t('list.title')}</h1>
          <p className="text-muted">{t('list.tagline')}</p>
          <OfflineBadge />
        </div>
        <div className="flex items-center gap-2">
          <LanguageToggle />
          <ThemeToggle />
        </div>
      </header>

      <InstallPrompt />

      <section
        aria-labelledby="list-progress-title"
        className="flex flex-col gap-1 rounded-2xl border border-fg/15 border-t-4 border-t-accent bg-surface p-4 shadow-sm"
      >
        <h2 id="list-progress-title" className="text-sm font-medium text-muted">
          {t('list.progress.label')}
        </h2>
        <p className="text-lg font-semibold text-fg">
          {t('list.progress.summary', { done: progress.done, total: progress.total })}
        </p>
        <p className="text-sm text-muted">
          {t('list.progress.spend', { amount: formatPrice(spend, locale) })}
        </p>
      </section>

      {items.length === 0 ? (
        <p className="text-muted">{t('list.empty')}</p>
      ) : (
        <ul className="flex flex-col gap-2" aria-label={t('list.itemsLabel')}>
          {items.map((item) => (
            <li
              key={item.id}
              className="rounded-xl border border-fg/15 bg-surface px-4 py-3 text-fg"
            >
              <span className={item.status === 'done' ? 'text-muted line-through' : 'font-medium'}>
                {item.name}
              </span>
            </li>
          ))}
        </ul>
      )}

      <ContactFooter />
    </div>
  )
}
