import { notFound } from "next/navigation"
import { BlogPostPage } from "@/components/pages/blog-post-page"
import { isLanguage } from "@/lib/i18n-routing"
import { getBlogPostLanguagePaths, getPublishedBlogPostBySlug } from "@/lib/blog-posts"

export const dynamic = "force-dynamic"

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

  return <BlogPostPage initialLanguage={lang} post={post} languagePathOverrides={languagePathOverrides} />
}
