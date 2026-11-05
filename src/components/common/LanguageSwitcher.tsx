import { Languages } from 'lucide-react'
import { useLanguage } from '../../context/LanguageContext'

export function LanguageSwitcher({ mobile = false }: { mobile?: boolean }) {
  const { language, setLanguage, t } = useLanguage()

  return (
    <div className={`language-switcher ${mobile ? 'language-switcher--mobile' : ''}`} aria-label={t('a11y.languageSelection')}>
      <Languages size={17} strokeWidth={1.8} aria-hidden="true" />
      <button
        type="button"
        className={language === 'en' ? 'is-active' : ''}
        onClick={() => setLanguage('en')}
        aria-pressed={language === 'en'}
        lang="en"
      >
        EN
      </button>
      <span aria-hidden="true">/</span>
      <button
        type="button"
        className={language === 'ta' ? 'is-active' : ''}
        onClick={() => setLanguage('ta')}
        aria-pressed={language === 'ta'}
        lang="ta"
      >
        தமிழ்
      </button>
    </div>
  )
}

