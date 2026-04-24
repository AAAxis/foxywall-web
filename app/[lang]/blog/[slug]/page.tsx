import type { Metadata } from "next"
import { notFound } from "next/navigation"
import { BlogPostPage } from "@/components/pages/blog-post-page"
import { isLanguage } from "@/lib/i18n-routing"
import { getBlogPostLanguagePaths, getPublishedBlogPostBySlug } from "@/lib/blog-posts"
import { languages } from "@/lib/translations"

// ISR: revalidate every hour for fast Googlebot crawls + fresh content
export const revalidate = 3600

const BASE_URL = "https://www.foxywall.xyz"

const OG_LOCALE_MAP: Record<string, string> = {
  en: "en_US", ru: "ru_RU", "zh-Hans": "zh_CN",
}

export async function generateMetadata({ params }: { params: Promise<{ lang: string; slug: string }> }): Promise<Metadata> {
  const { lang, slug } = await params

  if (!isLanguage(lang)) {
    return { title: "Not Found | FoxyWall" }
  }

  const post = await getPublishedBlogPostBySlug(lang, slug)

  if (!post) {
    return {
      title: "Post Not Found | FoxyWall Blog",
      description: "The requested blog post could not be found.",
    }
  }

  const canonicalUrl = `${BASE_URL}/${lang}/blog/${post.slug}`

  // Build hreflang alternates from available language versions
  const languagePaths = await getBlogPostLanguagePaths(post)
  const alternateLanguages: Record<string, string> = {}
  for (const langItem of languages) {
    const path = languagePaths[langItem.code]
    if (path) {
      alternateLanguages[langItem.code] = `${BASE_URL}${path}`
    }
  }
  const enPath = languagePaths["en" as keyof typeof languagePaths]
  if (enPath) {
    alternateLanguages["x-default"] = `${BASE_URL}${enPath}`
  }

  return {
    title: `${post.title} | FoxyWall Blog`,
    description: post.excerpt,
    keywords: post.tags || ["VPN", "privacy", "FoxyWall"],
    openGraph: {
      title: post.title,
      description: post.excerpt,
      url: canonicalUrl,
      siteName: "FoxyWall",
      images: post.featured_image
        ? [{ url: post.featured_image, width: 1200, height: 630, alt: post.title }]
        : [],
      locale: OG_LOCALE_MAP[lang] || "en_US",
      type: "article",
      publishedTime: post.published_at,
      authors: [post.author || "FoxyWall Team"],
      tags: post.tags || [],
    },
    twitter: {
      card: "summary_large_image",
      title: post.title,
      description: post.excerpt,
      images: post.featured_image ? [post.featured_image] : [],
    },
    alternates: {
      canonical: canonicalUrl,
      languages: alternateLanguages,
    },
  }
}

export default async function LocalizedBlogPostPage({ params }: { params: Promise<{ lang: string; slug: string }> }) {
  const { lang, slug } = await params

  if (!isLanguage(lang)) {
    notFound()
  }

  const post = await getPublishedBlogPostBySlug(lang, slug)

  if (!post) {
    notFound()
  }

  const languagePathOverrides = await getBlogPostLanguagePaths(post)

  const articleJsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: post.title,
    description: post.excerpt,
    image: post.featured_image ? [post.featured_image] : [],
    datePublished: post.published_at,
    dateModified: post.published_at,
    author: { "@type": "Person", name: post.author || "FoxyWall Team" },
    publisher: {
      "@type": "Organization",
      name: "FoxyWall",
      logo: { "@type": "ImageObject", url: `${BASE_URL}/unnamed.jpeg` },
    },
    mainEntityOfPage: `${BASE_URL}/${lang}/blog/${post.slug}`,
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleJsonLd) }}
      />
      <BlogPostPage initialLanguage={lang} post={post} languagePathOverrides={languagePathOverrides} />
    </>
  )
}
