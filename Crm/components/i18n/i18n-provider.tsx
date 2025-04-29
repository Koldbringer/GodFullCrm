"use client"

import { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import i18next from 'i18next'
import { initReactI18next, useTranslation as useTranslationOriginal } from 'react-i18next'
import resourcesToBackend from 'i18next-resources-to-backend'

// Inicjalizacja i18next
i18next
  .use(initReactI18next)
  .use(resourcesToBackend((language: string, namespace: string) =>
    import(`../../public/locales/${language}/${namespace}.json`)
  ))
  .init({
    lng: 'pl',
    fallbackLng: 'pl',
    supportedLngs: ['pl', 'en'],
    defaultNS: 'common',
    fallbackNS: 'common',
    react: {
      useSuspense: false,
    },
    interpolation: {
      escapeValue: false,
    },
  })

// Kontekst dla i18n
type I18nContextType = {
  locale: string
  changeLocale: (locale: string) => void
}

const I18nContext = createContext<I18nContextType>({
  locale: 'pl',
  changeLocale: () => {},
})

// Hook do używania tłumaczeń
export const useTranslation = () => {
  const { t, i18n } = useTranslationOriginal()
  const { locale } = useI18n()

  useEffect(() => {
    if (i18n.language !== locale) {
      i18n.changeLanguage(locale)
    }
  }, [locale, i18n])

  return { t, i18n }
}

// Hook do używania kontekstu i18n
export const useI18n = () => useContext(I18nContext)

// Provider dla i18n
export function I18nProvider({ children }: { children: ReactNode }) {
  const [locale, setLocale] = useState('pl')
  const router = useRouter()
  const pathname = usePathname()

  const changeLocale = (newLocale: string) => {
    if (newLocale !== locale && ['pl', 'en'].includes(newLocale)) {
      setLocale(newLocale)
      // Don't modify the HTML element to avoid hydration issues
      // document.documentElement.lang = newLocale
      localStorage.setItem('locale', newLocale)

      // Opcjonalnie: przekierowanie na tę samą stronę z nowym językiem
      // router.push(pathname)
    }
  }

  useEffect(() => {
    // Sprawdź, czy jest zapisany język w localStorage
    const savedLocale = localStorage.getItem('locale')
    if (savedLocale && ['pl', 'en'].includes(savedLocale)) {
      setLocale(savedLocale)
      // Don't modify the HTML element to avoid hydration issues
      // document.documentElement.lang = savedLocale
    } else {
      // Sprawdź język przeglądarki
      const browserLang = navigator.language.split('-')[0]
      if (['pl', 'en'].includes(browserLang)) {
        setLocale(browserLang)
        // Don't modify the HTML element to avoid hydration issues
        // document.documentElement.lang = browserLang
      }
    }
  }, [])

  return (
    <I18nContext.Provider value={{ locale, changeLocale }}>
      {children}
    </I18nContext.Provider>
  )
}
