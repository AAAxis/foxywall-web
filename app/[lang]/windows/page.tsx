import { notFound } from "next/navigation"
import type { Metadata } from "next"
import { PlatformVpnPage } from "@/components/pages/platform-vpn-page"
import { isLanguage, getLanguageOrDefault } from "@/lib/i18n-routing"

export async function generateMetadata({ params }: { params: Promise<{ lang: string }> }): Promise<Metadata> {
  const { lang } = await params
  return {
    title: "VPN for Windows 10 & 11 — FoxyWall",
    description:
      "Why FoxyWall on Windows: VLESS+Reality that slips past deep-packet inspection and censorship, unlimited speed, 200+ servers, and a native, no-logs Windows 10/11 app.",
    alternates: { canonical: `https://www.foxywall.xyz/${lang}/windows` },
  }
}

export default async function LocalizedWindowsPage({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params
  if (!isLanguage(lang)) notFound()
  return <PlatformVpnPage platform="windows" initialLanguage={getLanguageOrDefault(lang)} />
}
