import { notFound } from "next/navigation"
import type { Metadata } from "next"
import { PlatformVpnPage } from "@/components/pages/platform-vpn-page"
import { isLanguage, getLanguageOrDefault } from "@/lib/i18n-routing"

export async function generateMetadata({ params }: { params: Promise<{ lang: string }> }): Promise<Metadata> {
  const { lang } = await params
  return {
    title: "VPN for Android — FoxyWall",
    description:
      "Why FoxyWall on Android: a native, always-on VPN with a censorship-resistant protocol that bypasses deep-packet inspection, unlimited speed, 200+ servers, and zero logs.",
    alternates: { canonical: `https://www.foxywall.xyz/${lang}/android` },
  }
}

export default async function LocalizedAndroidPage({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params
  if (!isLanguage(lang)) notFound()
  return <PlatformVpnPage platform="android" initialLanguage={getLanguageOrDefault(lang)} />
}
