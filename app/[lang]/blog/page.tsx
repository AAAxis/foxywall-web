import type { Metadata } from "next"
import { notFound } from "next/navigation"
import { BlogPage } from "@/components/pages/blog-page"
import { isLanguage } from "@/lib/i18n-routing"
import { getPublishedBlogPosts } from "@/lib/blog-posts"

// ISR: revalidate every hour
export const revalidate = 3600

const BASE_URL = "https://www.foxywall.xyz"

export async function generateMetadata({ params }: { params: Promise<{ lang: string }> }): Promise<Metadata> {
  const { lang } = await params
  const canonicalUrl = `${BASE_URL}/${lang}/blog`

  return {
    title: "VPN Blog - Privacy & Security Tips | FoxyWall",
    description: "Read the latest articles about VPN technology, online privacy, cybersecurity tips, and digital freedom from the FoxyWall team.",
    alternates: {
      canonical: canonicalUrl,
    },
    openGraph: {
      title: "VPN Blog - Privacy & Security Tips | FoxyWall",
      description: "Read the latest articles about VPN technology, online privacy, and cybersecurity tips.",
      url: canonicalUrl,
      siteName: "FoxyWall",
      type: "website",
    },
  }
}

export default async function LocalizedBlogPage({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params

  if (!isLanguage(lang)) {
    notFound()
  }

  const posts = await getPublishedBlogPosts(lang)

  return <BlogPage initialLanguage={lang} posts={posts} />
}
