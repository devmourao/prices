import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { formatPrice, type AppLocale } from '../../../lib/currency'
import { parseAmount } from '../../calculator/lib/parse'
import { useBudgetStatus, usePurchaseActions, usePurchaseBudget } from '../hooks/usePurchase'

interface ReceiptBudgetProps {
  readonly locale: AppLocale
}

/**
 * Optional trip budget: set/clear + remaining / overspend vs open total.
 */
export function ReceiptBudget({ locale }: ReceiptBudgetProps) {
  const { t } = useTranslation()
  const budget = usePurchaseBudget()
  const status = useBudgetStatus()
  const { setBudget } = usePurchaseActions()
  const [draft, setDraft] = useState(budget === null ? '' : String(budget))
  const [editing, setEditing] = useState(false)

  const parsed = parseAmount(draft)
  const invalid =
    draft.trim() !== '' && (parsed === null || parsed <= 0)

  const save = () => {
    if (draft.trim() === '') {
      setBudget(null)
      setEditing(false)
      return
    }
    if (parsed === null || parsed <= 0) return
    setBudget(parsed)
    setEditing(false)
  }

  return (
    <section
      aria-labelledby="receipt-budget-title"
      className="flex flex-col gap-2 rounded-xl border border-fg/15 bg-bg p-3"
    >
      <div className="flex items-center justify-between gap-2">
        <h2 id="receipt-budget-title" className="text-sm font-medium text-muted">
          {t('receipt.budget.label')}
        </h2>
        {budget !== null && !editing && (
          <button
            type="button"
            onClick={() => {
              setDraft(String(budget))
              setEditing(true)
            }}
            className="min-h-[44px] rounded-lg px-3 text-sm text-accent focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
          >
            {t('receipt.budget.edit')}
          </button>
        )}
      </div>

      {editing ? (
        <div className="flex flex-col gap-2">
          <label className="sr-only" htmlFor="receipt-budget-input">
            {t('receipt.budget.inputLabel')}
          </label>
          <input
            id="receipt-budget-input"
            inputMode="decimal"
            value={draft}
            placeholder={t('receipt.budget.placeholder')}
            onChange={(event) => setDraft(event.target.value)}
            className="min-h-[48px] rounded-xl border border-fg/15 bg-surface px-3 text-fg focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
          />
          {invalid && (
            <p className="text-sm text-red-600 dark:text-red-400">{t('receipt.budget.invalid')}</p>
          )}
          <div className="flex gap-2">
            <button
              type="button"
              onClick={save}
              disabled={invalid}
              className="min-h-[44px] flex-1 rounded-xl bg-accent px-3 text-sm font-semibold text-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent disabled:opacity-40"
            >
              {t('receipt.budget.save')}
            </button>
            <button
              type="button"
              onClick={() => {
                setBudget(null)
                setDraft('')
                setEditing(true)
              }}
              className="min-h-[44px] rounded-xl border border-fg/15 px-3 text-sm text-muted focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
            >
              {t('receipt.budget.clear')}
            </button>
          </div>
        </div>
      ) : status === null ? (
        <button
          type="button"
          onClick={() => setEditing(true)}
          className="min-h-[44px] rounded-xl border border-dashed border-fg/20 px-3 text-sm text-muted focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
        >
          {t('receipt.budget.set')}
        </button>
      ) : (
        <div className="flex flex-col gap-2" aria-live="polite">
          <p className="text-sm text-fg">
            {t('receipt.budget.summary', { amount: formatPrice(status.budget, locale) })}
          </p>
          <div
            className="h-2 overflow-hidden rounded-full bg-fg/10"
            role="progressbar"
            aria-valuemin={0}
            aria-valuemax={100}
            aria-valuenow={Math.round(status.ratio * 100)}
            aria-label={t('receipt.budget.progressLabel')}
          >
            <div
              className={
                status.over
                  ? 'h-full rounded-full bg-red-500'
                  : 'h-full rounded-full bg-accent'
              }
              style={{ width: `${Math.round(status.ratio * 100)}%` }}
            />
          </div>
          <p
            className={
              status.over
                ? 'text-sm font-medium text-red-600 dark:text-red-400'
                : 'text-sm text-muted'
            }
          >
            {status.over
              ? t('receipt.budget.over', {
                  amount: formatPrice(Math.abs(status.remaining), locale),
                })
              : t('receipt.budget.remaining', {
                  amount: formatPrice(status.remaining, locale),
                })}
          </p>
        </div>
      )}
    </section>
  )
}
