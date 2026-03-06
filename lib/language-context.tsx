"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"
import { type Language, translations, languages } from "./translations"

type LanguageContextType = {
  language: Language
  setLanguage: (lang: Language) => void
  t: (key: string) => string
  languages: typeof languages
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined)

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguage] = useState<Language>("en")

  useEffect(() => {
    const browserLang = navigator.language || (navigator as any).userLanguage || ""
    if (browserLang.startsWith("ru")) {
      setLanguage("ru")
    }
  }, [])

  const t = (key: string) => {
    const translation = translations[language] as Record<string, string>
    return translation[key] || key
  }

  return <LanguageContext.Provider value={{ language, setLanguage, t, languages }}>{children}</LanguageContext.Provider>
}

export function useLanguage() {
  const context = useContext(LanguageContext)
  if (!context) {
    throw new Error("useLanguage must be used within a LanguageProvider")
  }
  return context
}
