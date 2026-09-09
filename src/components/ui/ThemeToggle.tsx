import { Moon, Sun } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { usePreferencesStore, useTheme } from '../../app/preferencesStore'

/** Light/dark switch. Persists across reloads; announces its state. */
export function ThemeToggle() {
  const { t } = useTranslation()
  const theme = useTheme()
  const toggleTheme = usePreferencesStore((state) => state.toggleTheme)
  const dark = theme === 'dark'

  return (
    <button
      type="button"
      onClick={toggleTheme}
      aria-pressed={dark}
      aria-label={dark ? t('theme.switchToLight') : t('theme.switchToDark')}
      title={dark ? t('theme.switchToLight') : t('theme.switchToDark')}
      className="flex min-h-[44px] min-w-[44px] items-center justify-center rounded-lg border border-fg/15 text-muted transition-colors hover:text-fg focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
    >
      {dark ? <Sun size={20} aria-hidden="true" /> : <Moon size={20} aria-hidden="true" />}
    </button>
  )
}
