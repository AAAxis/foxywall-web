"use client"

import { useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { LanguageProvider, useLanguage } from "@/lib/language-context"
import type { Language } from "@/lib/translations"
import type { BlogListItem } from "@/lib/blog-posts"

function BlogContent({ posts }: { posts: BlogListItem[] }) {
  const { language, t } = useLanguage()
  const allCategoryValue = "__all__"
  const [search, setSearch] = useState("")
  const [category, setCategory] = useState(allCategoryValue)

  const categories = [allCategoryValue, ...new Set(posts.map((p) => p.category).filter(Boolean))]

  const filtered = posts.filter((p) => {
    const matchSearch = p.title.toLowerCase().includes(search.toLowerCase()) || p.excerpt?.toLowerCase().includes(search.toLowerCase())
    const matchCat = category === allCategoryValue || p.category === category
    return matchSearch && matchCat
  })

  return (
    <main className="min-h-screen bg-background">
      <Header />
      <section className="pt-28 pb-16 container mx-auto px-6">
        <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-2">{t("blog")}</h1>
        <p className="text-muted-foreground mb-8">{t("blogDescription")}</p>

        <div className="flex flex-col sm:flex-row gap-4 mb-10">
          <input
            type="text"
            placeholder={t("searchPostsPlaceholder")}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="flex-1 px-4 py-2.5 rounded-lg bg-secondary text-foreground border border-border focus:outline-none focus:ring-2 focus:ring-primary"
          />
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="px-4 py-2.5 rounded-lg bg-secondary text-foreground border border-border focus:outline-none focus:ring-2 focus:ring-primary"
          >
            {categories.map((c) => (
              <option key={c} value={c}>
                {c === allCategoryValue ? t("allCategories") : c}
              </option>
            ))}
          </select>
        </div>

        {filtered.length === 0 ? (
          <p className="text-muted-foreground">{t("noPostsFound")}</p>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filtered.map((post) => (
              <Link key={post.id} href={`/${language}/blog/${post.slug}`} className="group">
                <div className="bg-secondary/50 border border-border rounded-xl overflow-hidden hover:border-primary/50 transition-all">
                  {post.featured_image && (
                    <div className="relative aspect-video overflow-hidden">
                      <Image
                        src={post.featured_image}
                        alt={post.title}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                      {post.category && (
                        <span className="absolute top-3 left-3 bg-primary text-primary-foreground text-xs font-medium px-2.5 py-1 rounded-full">
                          {post.category}
                        </span>
                      )}
                    </div>
                  )}
                  <div className="p-5">
                    <h2 className="text-lg font-semibold text-foreground mb-2 group-hover:text-primary transition-colors line-clamp-2">
                      {post.title}
                    </h2>
                    <p className="text-sm text-muted-foreground line-clamp-2 mb-3">{post.excerpt}</p>
                    <div className="flex items-center gap-3 text-xs text-muted-foreground">
                      {post.published_at && <span>{new Date(post.published_at).toLocaleDateString()}</span>}
                      {post.read_time && <span>{post.read_time} {t("readTimeSuffix")}</span>}
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </section>
      <Footer />
    </main>
  )
}

export function BlogPage({ initialLanguage, posts }: { initialLanguage: Language; posts: BlogListItem[] }) {
  return (
    <LanguageProvider initialLanguage={initialLanguage}>
      <BlogContent posts={posts} />
    </LanguageProvider>
  )
}
