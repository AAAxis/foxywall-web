import { defaultLanguage, type Language, languages } from "@/lib/translations"

const languageCodes = new Set(languages.map((language) => language.code))

export function isLanguage(value: string): value is Language {
  return languageCodes.has(value as Language)
}

export function getLanguageOrDefault(value?: string): Language {
  if (value && isLanguage(value)) {
    return value
  }

  return defaultLanguage
}

export function replaceLocaleInPathname(pathname: string, language: Language): string {
  const segments = pathname.split("/").filter(Boolean)

  if (segments.length > 0 && isLanguage(segments[0])) {
    segments[0] = language
  } else {
    segments.unshift(language)
  }

  return `/${segments.join("/")}`
}
