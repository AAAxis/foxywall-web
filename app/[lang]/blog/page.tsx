import { notFound } from "next/navigation"
import { BlogPage } from "@/components/pages/blog-page"
import { isLanguage } from "@/lib/i18n-routing"

export default async function LocalizedBlogPage({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params

  if (!isLanguage(lang)) {
    notFound()
  }

  return <BlogPage initialLanguage={lang} />
}
