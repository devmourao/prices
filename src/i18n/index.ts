import i18n from 'i18next'
import LanguageDetector from 'i18next-browser-languagedetector'
import { initReactI18next } from 'react-i18next'
import en from './locales/en.json'
import ptBR from './locales/pt-BR.json'

void i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources: {
      en: { translation: en },
      'pt-BR': { translation: ptBR },
    },
    fallbackLng: 'en',
    supportedLngs: ['en', 'pt-BR'],
    detection: {
      order: ['localStorage', 'navigator'],
      lookupLocalStorage: 'prices-locale',
      caches: ['localStorage'],
    },
    interpolation: {
      escapeValue: false,
    },
  })

export default i18n

const LOCALE_STORAGE_KEY = 'prices-locale'

// The detector reads this key on boot; mirroring every change here keeps
// persistence explicit instead of relying on detector internals.
i18n.on('languageChanged', (lng) => {
  try {
    localStorage.setItem(LOCALE_STORAGE_KEY, lng)
  } catch {
    // Storage unavailable: locale still applies for this session.
  }
  if (typeof document !== 'undefined') {
    document.documentElement.lang = lng === 'pt-BR' ? 'pt-BR' : 'en'
  }
})
