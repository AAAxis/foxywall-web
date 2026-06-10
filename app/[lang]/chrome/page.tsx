import { notFound } from "next/navigation"
import type { Metadata } from "next"
import { PlatformVpnPage } from "@/components/pages/platform-vpn-page"
import { isLanguage, getLanguageOrDefault } from "@/lib/i18n-routing"

export async function generateMetadata({ params }: { params: Promise<{ lang: string }> }): Promise<Metadata> {
  const { lang } = await params
  return {
    title: "VPN Proxy for Google Chrome — FoxyWall",
    description:
      "Why FoxyWall for Chrome: route your browser through a censorship-resistant proxy network, unblock sites in one click, 200+ servers, and a strict no-logs policy — no full VPN install.",
    alternates: { canonical: `https://www.foxywall.xyz/${lang}/chrome` },
  }
}

export default async function LocalizedChromePage({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params
  if (!isLanguage(lang)) notFound()
  return <PlatformVpnPage platform="chrome" initialLanguage={getLanguageOrDefault(lang)} />
}
