import { Trophy } from 'lucide-react'
import { useTranslation } from 'react-i18next'

/** Highlight attached to the cheapest comparable product. */
export function WinnerBadge() {
  const { t } = useTranslation()
  return (
    <span className="inline-flex items-center gap-1 rounded-full bg-accent px-2.5 py-1 text-xs font-semibold text-white">
      <Trophy size={14} aria-hidden="true" />
      {t('calculator.results.bestValue')}
    </span>
  )
}
