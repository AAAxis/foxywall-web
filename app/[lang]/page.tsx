import { notFound } from "next/navigation"
import { HomePage } from "@/components/pages/home-page"
import { isLanguage } from "@/lib/i18n-routing"
import { getPublishedBlogPosts } from "@/lib/blog-posts"

export const dynamic = "force-dynamic"

export default async function LocalizedHomePage({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params

  if (!isLanguage(lang)) {
    notFound()
  }

  const posts = await getPublishedBlogPosts(lang)

  return <HomePage initialLanguage={lang} posts={posts.slice(0, 3)} />
}
