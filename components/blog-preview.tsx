"use client"

import Image from "next/image"
import Link from "next/link"
import { ArrowRight } from "lucide-react"
import { useLanguage } from "@/lib/language-context"
import type { BlogListItem } from "@/lib/blog-posts"

export function BlogPreview({ posts }: { posts: BlogListItem[] }) {
  const { language, t } = useLanguage()

  if (posts.length === 0) {
    return null
  }

  return (
    <section className="py-20 md:py-28">
      <div className="container mx-auto px-6">
        <div className="flex flex-col gap-5 md:flex-row md:items-end md:justify-between mb-12">
          <div className="max-w-2xl">
            <span className="inline-block text-sm font-semibold text-primary uppercase tracking-wider mb-3">{t("blog")}</span>
            <h2 className="text-3xl md:text-5xl font-bold text-foreground mb-4">{t("latestFromBlog")}</h2>
            <p className="text-muted-foreground text-lg">{t("blogDescription")}</p>
          </div>

          <Link
            href={`/${language}/blog`}
            className="inline-flex items-center gap-2 text-sm font-semibold text-primary hover:text-primary/80 transition-colors"
          >
            {t("viewAllPosts")}
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          {posts.map((post) => (
            <Link
              key={post.id}
              href={`/${language}/blog/${post.slug}`}
              className="group overflow-hidden rounded-3xl border border-border bg-background shadow-sm transition-all hover:-translate-y-1 hover:border-primary/30 hover:shadow-xl hover:shadow-primary/5"
            >
              {post.featured_image && (
                <div className="relative aspect-[16/10] overflow-hidden">
                  <Image
                    src={post.featured_image}
                    alt={post.title}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                </div>
              )}

              <div className="p-6">
                {post.category && (
                  <span className="inline-flex rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold text-primary mb-4">
                    {post.category}
                  </span>
                )}

                <h3 className="text-xl font-semibold text-foreground mb-3 line-clamp-2 group-hover:text-primary transition-colors">
                  {post.title}
                </h3>
                <p className="text-sm text-muted-foreground line-clamp-3 mb-5">{post.excerpt}</p>

                <div className="flex items-center justify-between text-xs text-muted-foreground">
                  <span>{new Date(post.published_at).toLocaleDateString()}</span>
                  <span>{post.read_time} {t("readTimeSuffix")}</span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}
