import { useTranslation } from 'react-i18next'
import { SegmentedControl } from './SegmentedControl'

type SupportedLocale = 'en' | 'pt-BR'

/**
 * EN ⇄ PT-BR switch. Persistence is handled by the configured language
 * detector cache (localStorage); the <html> lang follows the selection.
 */
export function LanguageToggle() {
  const { t, i18n } = useTranslation()
  const current: SupportedLocale = i18n.language?.startsWith('pt') ? 'pt-BR' : 'en'

  return (
    <SegmentedControl<SupportedLocale>
      label={t('locale.label')}
      options={[
        { value: 'en', label: t('locale.en') },
        { value: 'pt-BR', label: t('locale.ptBR') },
      ]}
      value={current}
      onChange={(locale) => void i18n.changeLanguage(locale)}
    />
  )
}
