"use client"

import { Header } from "@/components/header"
import { Hero } from "@/components/hero"
import { Features } from "@/components/features"
import { Pricing } from "@/components/pricing"
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
        <BlogPreview posts={posts} />
        <Pricing />
        <Footer />
      </main>
    </LanguageProvider>
  )
}
