import { notFound } from "next/navigation"
import { BlogPostPage } from "@/components/pages/blog-post-page"
import { isLanguage } from "@/lib/i18n-routing"

export default async function LocalizedBlogPostPage({ params }: { params: Promise<{ lang: string; slug: string }> }) {
  const { lang, slug } = await params

  if (!isLanguage(lang)) {
    notFound()
  }

  return <BlogPostPage initialLanguage={lang} slug={slug} />
}
