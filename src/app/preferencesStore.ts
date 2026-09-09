import { create } from 'zustand'

export type Theme = 'light' | 'dark'

const STORAGE_KEY = 'prices-theme'

function systemTheme(): Theme {
  if (typeof window !== 'undefined' && typeof window.matchMedia === 'function') {
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
  }
  return 'light'
}

function initialTheme(): Theme {
  try {
    const stored = typeof localStorage !== 'undefined' ? localStorage.getItem(STORAGE_KEY) : null
    if (stored === 'dark' || stored === 'light') return stored
  } catch {
    // Storage unavailable (e.g. private mode): fall through to system.
  }
  return systemTheme()
}

function applyTheme(theme: Theme): void {
  if (typeof document !== 'undefined') {
    document.documentElement.classList.toggle('dark', theme === 'dark')
  }
  try {
    localStorage.setItem(STORAGE_KEY, theme)
  } catch {
    // Storage unavailable: theme still applies for this session.
  }
}

interface PreferencesState {
  readonly theme: Theme
  setTheme: (theme: Theme) => void
  toggleTheme: () => void
}

/**
 * App preferences. localStorage is synced manually (not via persist
 * middleware) because the pre-paint guard in index.html shares the
 * same key and must stay the single source of truth against FOUC.
 */
export const usePreferencesStore = create<PreferencesState>()((set) => {
  const initial = initialTheme()
  applyTheme(initial)
  return {
    theme: initial,
    setTheme: (theme) => {
      applyTheme(theme)
      set({ theme })
    },
    toggleTheme: () => {
      const next: Theme = usePreferencesStore.getState().theme === 'dark' ? 'light' : 'dark'
      applyTheme(next)
      set({ theme: next })
    },
  }
})

export function useTheme() {
  return usePreferencesStore((state) => state.theme)
}
