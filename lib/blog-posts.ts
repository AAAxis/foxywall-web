import { createClient } from "@supabase/supabase-js"
import type { Language } from "@/lib/translations"

export type BlogListItem = {
  id: string
  title: string
  slug: string
  excerpt: string
  featured_image: string
  category: string
  published_at: string
  read_time: number
  language: string
  brand: string
}

export type BlogPost = {
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
  language: string
  brand: string
}

function getServerSupabase() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  if (!url || !key) {
    throw new Error("Supabase env vars not set")
  }

  return createClient(url, key)
}

export async function getPublishedBlogPosts(language: Language): Promise<BlogListItem[]> {
  const supabase = getServerSupabase()
  const { data, error } = await supabase
    .from("blog_posts")
    .select("id, title, slug, excerpt, featured_image, category, published_at, read_time, language, brand")
    .eq("status", "published")
    .eq("brand", "vpn")
    .eq("language", language)
    .order("published_at", { ascending: false })

  if (error || !data) {
    return []
  }

  return data
}

export async function getPublishedBlogPostBySlug(language: Language, slug: string): Promise<BlogPost | null> {
  const supabase = getServerSupabase()
  const { data, error } = await supabase
    .from("blog_posts")
    .select("*")
    .eq("slug", slug)
    .eq("status", "published")
    .eq("brand", "vpn")
    .eq("language", language)
    .maybeSingle()

  if (error || !data) {
    return null
  }

  return data
}
