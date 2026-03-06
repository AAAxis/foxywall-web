"use client"

import { Header } from "@/components/header"
import { Hero } from "@/components/hero"
import { Features } from "@/components/features"
import { Pricing } from "@/components/pricing"
import { Footer } from "@/components/footer"
import { LanguageProvider } from "@/lib/language-context"
import type { Language } from "@/lib/translations"

export function HomePage({ initialLanguage }: { initialLanguage: Language }) {
  return (
    <LanguageProvider initialLanguage={initialLanguage}>
      <main className="min-h-screen bg-background">
        <Header />
        <Hero />
        <Features />
        <Pricing />
        <Footer />
      </main>
    </LanguageProvider>
  )
}
