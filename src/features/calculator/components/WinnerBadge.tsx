import { Trophy } from 'lucide-react'
import { useTranslation } from 'react-i18next'

/** Highlight attached to the cheapest comparable product. */
export function WinnerBadge() {
  const { t } = useTranslation()
  return (
    <span className="inline-flex animate-rise items-center gap-1.5 rounded-full bg-accent px-3 py-1.5 text-sm font-bold text-white shadow-md">
      <Trophy size={14} aria-hidden="true" />
      {t('calculator.results.bestValue')}
    </span>
  )
}
