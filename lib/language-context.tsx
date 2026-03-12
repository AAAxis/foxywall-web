"use client"

import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from "react"
import { defaultLanguage, type Language, translations, languages } from "./translations"

type LanguageContextType = {
  language: Language
  setLanguage: (lang: Language) => void
  t: (key: string) => string
  languages: typeof languages
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined)

export function LanguageProvider({
  children,
  initialLanguage = defaultLanguage,
}: {
  children: ReactNode
  initialLanguage?: Language
}) {
  const [language, setLanguage] = useState<Language>(initialLanguage)

  useEffect(() => {
    setLanguage(initialLanguage)
  }, [initialLanguage])

  useEffect(() => {
    if (initialLanguage !== defaultLanguage) {
      return
    }

    const browserLang = navigator.language || (navigator as any).userLanguage || ""
    if (browserLang.startsWith("ru")) {
      setLanguage("ru")
    }
  }, [initialLanguage])

  const t = useMemo(
    () => (key: string) => {
      const translation = translations[language] as Record<string, string>
      const englishFallback = translations.en as Record<string, string>
      return translation[key] || englishFallback[key] || key
    },
    [language],
  )

  return <LanguageContext.Provider value={{ language, setLanguage, t, languages }}>{children}</LanguageContext.Provider>
}

export function useLanguage() {
  const context = useContext(LanguageContext)
  if (!context) {
    throw new Error("useLanguage must be used within a LanguageProvider")
  }
  return context
}
