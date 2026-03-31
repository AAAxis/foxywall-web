"use client"

import { Header } from "@/components/header"
import { Hero } from "@/components/hero"
import { Features } from "@/components/features"
import { Comparison } from "@/components/comparison"
import { WhoUses } from "@/components/who-uses"
import { HowItWorks } from "@/components/how-it-works"
import { PrivacyPromise } from "@/components/privacy-promise"
import { Pricing } from "@/components/pricing"
import { Faq } from "@/components/faq"
import { BlogPreview } from "@/components/blog-preview"
import { Footer } from "@/components/footer"
import { LanguageProvider } from "@/lib/language-context"
import type { Language } from "@/lib/translations"
import type { BlogListItem } from "@/lib/blog-posts"

export function HomePage({ initialLanguage, posts }: { initialLanguage: Language; posts: BlogListItem[] }) {
  return (
    <LanguageProvider initialLanguage={initialLanguage}>
      <main className="min-h-screen bg-background">
        <Header />
        <Hero />
        <Features />
        <Comparison />
        <WhoUses />
        <PrivacyPromise />
        <HowItWorks />
        <Pricing />
        <Faq />
        <BlogPreview posts={posts} />
        <Footer />
      </main>
    </LanguageProvider>
  )
}
