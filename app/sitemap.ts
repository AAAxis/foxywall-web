import { createClient } from "@supabase/supabase-js"
import { MetadataRoute } from "next"
import { languages, type Language } from "@/lib/translations"

const baseUrl = "https://www.foxywall.xyz"
const languageCodes = new Set(languages.map(({ code }) => code))

type PublishedBlogPost = {
  slug: string
  language: string
  published_at: string | null
  updated_at?: string | null
}

type SitemapEntry = {
  url: string
  lastModified: string | Date
  changeFrequency: "weekly" | "monthly"
  priority: number
}

function buildUrl(path: string): string {
  return new URL(path, baseUrl).toString()
}

function dedupeEntries(entries: SitemapEntry[]): MetadataRoute.Sitemap {
  const byUrl = new Map<string, SitemapEntry>()

  for (const entry of entries) {
    const existing = byUrl.get(entry.url)

    if (!existing) {
      byUrl.set(entry.url, entry)
      continue
    }

    const existingLastModified = new Date(existing.lastModified).getTime()
    const nextLastModified = new Date(entry.lastModified).getTime()

    if (nextLastModified >= existingLastModified) {
      byUrl.set(entry.url, entry)
    }
  }

  return Array.from(byUrl.values())
}

function getStaticRoutes(): MetadataRoute.Sitemap {
  const localeRoutes = languages.flatMap(({ code }) => [`/${code}`, `/${code}/blog`, `/${code}/refer`])
  const routes = [...localeRoutes, "/privacy-policy", "/terms-of-service", "/refund-policy"]

  return routes.map((route) => ({
    url: buildUrl(route),
    lastModified: new Date(),
    changeFrequency: route.endsWith("/blog") ? "weekly" : "monthly",
    priority: route === "/en" ? 1 : 0.7,
  }))
}

async function getBlogPostRoutes(): Promise<MetadataRoute.Sitemap> {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  if (!url || !key) {
    return []
  }

  const supabase = createClient(url, key)
  const { data, error } = await supabase
    .from("blog_posts")
    .select("slug, language, published_at, updated_at")
    .eq("status", "published")
    .eq("brand", "vpn")

  if (error || !data) {
    return []
  }

  return data
    .filter((post): post is PublishedBlogPost & { language: Language } => Boolean(post.slug) && languageCodes.has(post.language as Language))
    .map((post) => ({
      url: buildUrl(`/${post.language}/blog/${post.slug}`),
      lastModified: post.updated_at ?? post.published_at ?? new Date().toISOString(),
      changeFrequency: "weekly",
      priority: 0.8,
    }))
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const staticRoutes = getStaticRoutes()

  try {
    const blogPostRoutes = await getBlogPostRoutes()
    return dedupeEntries([...staticRoutes, ...blogPostRoutes])
  } catch {
    return staticRoutes
  }
}
