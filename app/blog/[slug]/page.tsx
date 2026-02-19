"use client"

import { useEffect, useState } from "react"
import { useParams } from "next/navigation"
import Link from "next/link"
import Image from "next/image"
import { getSupabase } from "@/lib/supabase"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { LanguageProvider } from "@/lib/language-context"

interface BlogPost {
  id: string
  title: string
  slug: string
  content: string
  excerpt: string
  featured_image: string
  category: string
  author: string
  published_at: string
  read_time: number
  tags: string[]
}

export default function BlogPostPage() {
  const params = useParams()
  const [post, setPost] = useState<BlogPost | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchPost() {
      const { data, error } = await getSupabase()
        .from("blog_posts")
        .select("*")
        .eq("slug", params.slug)
        .eq("status", "published")
        .single()

      if (!error && data) setPost(data)
      setLoading(false)
    }
    if (params.slug) fetchPost()
  }, [params.slug])

  if (loading) {
    return (
      <LanguageProvider>
        <main className="min-h-screen bg-background">
          <Header />
          <div className="pt-28 pb-16 container mx-auto px-6">
            <p className="text-muted-foreground">Loading...</p>
          </div>
          <Footer />
        </main>
      </LanguageProvider>
    )
  }

  if (!post) {
    return (
      <LanguageProvider>
        <main className="min-h-screen bg-background">
          <Header />
          <div className="pt-28 pb-16 container mx-auto px-6 text-center">
            <h1 className="text-3xl font-bold text-foreground mb-4">Post not found</h1>
            <Link href="/blog" className="text-primary hover:underline">← Back to blog</Link>
          </div>
          <Footer />
        </main>
      </LanguageProvider>
    )
  }

  return (
    <LanguageProvider>
      <main className="min-h-screen bg-background">
        <Header />
        <article className="pt-28 pb-16 container mx-auto px-6">
          <div className="max-w-3xl mx-auto">
            <Link href="/blog" className="text-sm text-muted-foreground hover:text-primary transition-colors mb-6 inline-block">
              ← Back to blog
            </Link>

            {post.category && (
              <span className="inline-block bg-primary text-primary-foreground text-xs font-medium px-3 py-1 rounded-full mb-4">
                {post.category}
              </span>
            )}

            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-4 leading-tight">
              {post.title}
            </h1>

            <div className="flex items-center gap-4 text-sm text-muted-foreground mb-8">
              {post.author && <span>By {post.author}</span>}
              {post.published_at && (
                <span>{new Date(post.published_at).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })}</span>
              )}
              {post.read_time && <span>{post.read_time} min read</span>}
            </div>

            {post.featured_image && (
              <div className="relative aspect-video rounded-xl overflow-hidden mb-10">
                <Image src={post.featured_image} alt={post.title} fill className="object-cover" />
              </div>
            )}

            <div
              className="prose prose-invert prose-lg max-w-none
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
    </LanguageProvider>
  )
}
