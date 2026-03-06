import { notFound } from "next/navigation"
import { ReferPage } from "@/components/pages/refer-page"
import { isLanguage } from "@/lib/i18n-routing"

export default async function LocalizedReferPage({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params

  if (!isLanguage(lang)) {
    notFound()
  }

  return <ReferPage />
}
