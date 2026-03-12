import { notFound } from "next/navigation"
import { BlogPage } from "@/components/pages/blog-page"
import { isLanguage } from "@/lib/i18n-routing"
import { getPublishedBlogPosts } from "@/lib/blog-posts"

export const dynamic = "force-dynamic"

export default async function LocalizedBlogPage({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params

  if (!isLanguage(lang)) {
    notFound()
  }

  const posts = await getPublishedBlogPosts(lang)

  return <BlogPage initialLanguage={lang} posts={posts} />
}
