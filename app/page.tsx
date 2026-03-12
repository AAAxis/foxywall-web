"use client"

import { LanguageProvider } from "@/lib/language-context"
import { Header } from "@/components/header"
import { Hero } from "@/components/hero"
import { Features } from "@/components/features"
import { PromoBanner } from "@/components/promo-banner"
import { Pricing } from "@/components/pricing"
import { Footer } from "@/components/footer"

export default function Home() {
  return (
    <LanguageProvider>
      <main className="min-h-screen bg-background">
        <Header />
        <Hero />
        <PromoBanner />
        <Features />
        <Pricing />
        <Footer />
      </main>
    </LanguageProvider>
  )
}
