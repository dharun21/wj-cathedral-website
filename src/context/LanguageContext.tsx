import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from 'react'
import en, { type TranslationKey } from '../locales/en'
import ta from '../locales/ta'
import type { Language, LocalizedText } from '../types/content'

const dictionaries = { en, ta }
const STORAGE_KEY = 'wj-cathedral-language'

interface LanguageContextValue {
  language: Language
  setLanguage: (language: Language) => void
  toggleLanguage: () => void
  t: (key: TranslationKey) => string
  localize: (value: LocalizedText) => string
}

const LanguageContext = createContext<LanguageContextValue | null>(null)

function getInitialLanguage(): Language {
  try {
    const saved = window.localStorage.getItem(STORAGE_KEY)
    return saved === 'ta' ? 'ta' : 'en'
  } catch {
    return 'en'
  }
}

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguage] = useState<Language>(getInitialLanguage)

  useEffect(() => {
    document.documentElement.lang = language
    document.documentElement.dataset.language = language
    try {
      window.localStorage.setItem(STORAGE_KEY, language)
    } catch {
      // Storage can be unavailable in privacy modes; language still works for this session.
    }
  }, [language])

  const value = useMemo<LanguageContextValue>(
    () => ({
      language,
      setLanguage,
      toggleLanguage: () => setLanguage((current) => (current === 'en' ? 'ta' : 'en')),
      t: (key) => dictionaries[language][key],
      localize: (text) => text[language],
    }),
    [language],
  )

  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>
}

// oxlint-disable-next-line react/only-export-components -- Provider and its colocated hook are one public context API.
export function useLanguage() {
  const context = useContext(LanguageContext)
  if (!context) throw new Error('useLanguage must be used inside LanguageProvider')
  return context
}

