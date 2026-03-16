"use client"

import Link from "next/link"
import Image from "next/image"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { LanguageProvider, useLanguage } from "@/lib/language-context"
import type { Language } from "@/lib/translations"
import type { BlogPost, BlogPostLanguagePaths } from "@/lib/blog-posts"

function BlogPostContent({ post, languagePathOverrides }: { post: BlogPost; languagePathOverrides?: BlogPostLanguagePaths }) {
  const { language, t } = useLanguage()

  return (
    <main className="min-h-screen bg-background">
      <Header languagePathOverrides={languagePathOverrides} />
      <article className="pt-28 pb-16 container mx-auto px-6">
        <div className="max-w-3xl mx-auto">
          <Link href={`/${language}/blog`} className="text-sm text-muted-foreground hover:text-primary transition-colors mb-6 inline-block">
            ← {t("backToBlog")}
          </Link>

          {post.category && (
            <span className="inline-block bg-primary text-primary-foreground text-xs font-medium px-3 py-1 rounded-full mb-4">
              {post.category}
            </span>
          )}

          <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-4 leading-tight">{post.title}</h1>

          <div className="flex items-center gap-4 text-sm text-muted-foreground mb-8">
            {post.author_image && (
              <img src={post.author_image} alt={post.author || ''} width={40} height={40} className="rounded-full" />
            )}
            <div>
              {post.author && (
                post.author_linkedin ? (
                  <a href={post.author_linkedin} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline font-medium">
                    {post.author}
                  </a>
                ) : (
                  <span className="font-medium text-foreground">{post.author}</span>
                )
              )}
              {post.author_bio && <p className="text-xs text-muted-foreground">{post.author_bio}</p>}
            </div>
            {post.published_at && (
              <span className="ml-auto">{new Date(post.published_at).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })}</span>
            )}
            {post.read_time && <span>{post.read_time}</span>}
          </div>

          {post.featured_image && (
            <div className="relative aspect-video rounded-xl overflow-hidden mb-10">
              <Image src={post.featured_image} alt={post.title} fill className="object-cover" />
            </div>
          )}

          <div
            className="prose prose-lg max-w-none
                prose-headings:text-foreground prose-p:text-muted-foreground
                prose-a:text-primary prose-strong:text-foreground
                prose-code:bg-secondary prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded
                prose-pre:bg-secondary prose-pre:border prose-pre:border-border
                prose-blockquote:border-primary prose-blockquote:text-muted-foreground
                prose-img:rounded-xl"
            dangerouslySetInnerHTML={{ __html: post.content }}
          />

          {post.tags && post.tags.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-10 pt-6 border-t border-border">
              {post.tags.map((tag) => (
                <span key={tag} className="px-3 py-1 rounded-full bg-secondary text-xs text-muted-foreground">
                  #{tag}
                </span>
              ))}
            </div>
          )}
        </div>
      </article>
      <Footer />
    </main>
  )
}

export function BlogPostPage({
  initialLanguage,
  post,
  languagePathOverrides,
}: {
  initialLanguage: Language
  post: BlogPost
  languagePathOverrides?: BlogPostLanguagePaths
}) {
  return (
    <LanguageProvider initialLanguage={initialLanguage}>
      <BlogPostContent post={post} languagePathOverrides={languagePathOverrides} />
    </LanguageProvider>
  )
}
