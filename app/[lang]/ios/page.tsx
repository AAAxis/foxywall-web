import { notFound } from "next/navigation"
import type { Metadata } from "next"
import { PlatformVpnPage } from "@/components/pages/platform-vpn-page"
import { isLanguage, getLanguageOrDefault } from "@/lib/i18n-routing"

export async function generateMetadata({ params }: { params: Promise<{ lang: string }> }): Promise<Metadata> {
  const { lang } = await params
  return {
    title: "VPN for iPhone & iPad — FoxyWall",
    description:
      "Why FoxyWall on iOS: a native iPhone & iPad VPN with a censorship-resistant protocol that slips past firewalls, unlimited speed, 200+ servers, and a strict no-logs policy.",
    alternates: { canonical: `https://www.foxywall.xyz/${lang}/ios` },
  }
}

export default async function LocalizedIosPage({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params
  if (!isLanguage(lang)) notFound()
  return <PlatformVpnPage platform="ios" initialLanguage={getLanguageOrDefault(lang)} />
}
