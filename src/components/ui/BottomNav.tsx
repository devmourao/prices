import { NavLink } from 'react-router'
import { useTranslation } from 'react-i18next'
import { Calculator, ListChecks } from 'lucide-react'

const linkClass = ({ isActive }: { isActive: boolean }) =>
  [
    'flex min-h-[48px] flex-1 flex-col items-center justify-center gap-0.5 rounded-xl text-xs font-medium transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent',
    isActive ? 'bg-accent/15 text-accent' : 'text-muted hover:text-fg',
  ].join(' ')

/**
 * Two-destination thumb nav: List (plan/execute) and Compare (decide).
 * Fixed above the safe-area inset so aisle use stays one-handed.
 */
export function BottomNav() {
  const { t } = useTranslation()

  return (
    <nav
      aria-label={t('nav.label')}
      className="fixed inset-x-0 bottom-0 z-40 border-t border-fg/15 bg-bg/95 pb-[env(safe-area-inset-bottom)] backdrop-blur"
    >
      <div className="mx-auto flex w-full max-w-xl gap-1 px-3 py-2">
        <NavLink to="/" end className={linkClass}>
          <ListChecks size={20} aria-hidden="true" />
          {t('nav.list')}
        </NavLink>
        <NavLink to="/compare" className={linkClass}>
          <Calculator size={20} aria-hidden="true" />
          {t('nav.compare')}
        </NavLink>
      </div>
    </nav>
  )
}
