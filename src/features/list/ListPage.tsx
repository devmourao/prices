import { useCallback, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { ContactFooter } from '../../components/ui/ContactFooter'
import { InstallPrompt } from '../../components/ui/InstallPrompt'
import { LanguageToggle } from '../../components/ui/LanguageToggle'
import { OfflineBadge } from '../../components/ui/OfflineBadge'
import { ThemeToggle } from '../../components/ui/ThemeToggle'
import { formatPrice, type AppLocale } from '../../lib/currency'
import { AddItemField } from './components/AddItemField'
import { ItemSheet } from './components/ItemSheet'
import { ListItemRow } from './components/ListItemRow'
import { useListActions, useListItems, useListProgress, useListSpend } from './hooks/useList'

/**
 * Checklist MVP: add items, check off, buy+price sheet, clear actions.
 * Compare remains on /compare (handoff seed completes in Sprint L2).
 */
export function ListPage() {
  const { t, i18n } = useTranslation()
  const items = useListItems()
  const progress = useListProgress()
  const spend = useListSpend()
  const { clearDone, clearAll } = useListActions()
  const [openItemId, setOpenItemId] = useState<string | null>(null)
  const locale: AppLocale = i18n.language === 'pt-BR' ? 'pt-BR' : 'en'

  const openItem = items.find((item) => item.id === openItemId) ?? null
  const closeSheet = useCallback(() => setOpenItemId(null), [])

  const confirmClearDone = () => {
    if (progress.done === 0) return
    if (window.confirm(t('list.clear.confirmDone'))) clearDone()
  }

  const confirmClearAll = () => {
    if (items.length === 0) return
    if (window.confirm(t('list.clear.confirmAll'))) clearAll()
  }

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
        aria-live="polite"
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

      <AddItemField />

      {items.length === 0 ? (
        <p className="text-muted">{t('list.empty')}</p>
      ) : (
        <>
          <ul className="flex flex-col gap-2" aria-label={t('list.itemsLabel')}>
            {items.map((item) => (
              <ListItemRow
                key={item.id}
                item={item}
                locale={locale}
                onOpen={() => setOpenItemId(item.id)}
              />
            ))}
          </ul>
          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              onClick={confirmClearDone}
              disabled={progress.done === 0}
              className="min-h-[44px] rounded-xl border border-fg/15 px-4 text-sm text-muted transition-colors hover:text-fg focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent disabled:opacity-40"
            >
              {t('list.clear.done')}
            </button>
            <button
              type="button"
              onClick={confirmClearAll}
              className="min-h-[44px] rounded-xl border border-fg/15 px-4 text-sm text-muted transition-colors hover:text-fg focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
            >
              {t('list.clear.all')}
            </button>
          </div>
        </>
      )}

      <ContactFooter />

      {openItem !== null && <ItemSheet item={openItem} onClose={closeSheet} />}
    </div>
  )
}
