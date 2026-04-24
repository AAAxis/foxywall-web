import type { MetadataRoute } from "next"
import { getPublishedBlogPosts } from "@/lib/blog-posts"
import { languages, type Language } from "@/lib/translations"

const BASE_URL = "https://www.foxywall.xyz"

const BLOG_LOCALES: Language[] = ["en", "ru", "zh-Hans"]

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const now = new Date()

  // Static pages for each language
  const staticEntries: MetadataRoute.Sitemap = []

  for (const lang of languages) {
    // Home page
    staticEntries.push({
      url: `${BASE_URL}/${lang.code}`,
      lastModified: now,
      changeFrequency: "weekly",
      priority: lang.code === "en" ? 1.0 : 0.8,
    })

    // Blog listing
    staticEntries.push({
      url: `${BASE_URL}/${lang.code}/blog`,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 0.8,
    })

    // Referral page
    staticEntries.push({
      url: `${BASE_URL}/${lang.code}/refer`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.6,
    })
  }

  // Legal pages (English only)
  for (const page of ["privacy-policy", "terms-of-service", "refund-policy"]) {
    staticEntries.push({
      url: `${BASE_URL}/${page}`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.4,
    })
  }

  // Blog post entries — fetch from DB
  const blogEntries: MetadataRoute.Sitemap = []
  const seenUrls = new Set<string>()

  for (const locale of BLOG_LOCALES) {
    try {
      const posts = await getPublishedBlogPosts(locale)
      for (const post of posts) {
        const url = `${BASE_URL}/${locale}/blog/${post.slug}`
        if (seenUrls.has(url)) continue
        seenUrls.add(url)

        blogEntries.push({
          url,
          lastModified: post.published_at ? new Date(post.published_at) : now,
          changeFrequency: "monthly",
          priority: 0.7,
        })
      }
    } catch (error) {
      console.error(`Sitemap blog fetch failed for ${locale}:`, error)
    }
  }

  return [...staticEntries, ...blogEntries]
}
