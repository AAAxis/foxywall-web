import { redirect } from "next/navigation"
import { defaultLanguage } from "@/lib/translations"

export default async function BlogSlugRedirectPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  redirect(`/${defaultLanguage}/blog/${slug}`)
}
