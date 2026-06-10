import { notFound } from "next/navigation"
import type { Metadata } from "next"
import { PlatformVpnPage } from "@/components/pages/platform-vpn-page"
import { isLanguage, getLanguageOrDefault } from "@/lib/i18n-routing"

export async function generateMetadata({ params }: { params: Promise<{ lang: string }> }): Promise<Metadata> {
  const { lang } = await params
  return {
    title: "VPN for macOS — FoxyWall",
    description:
      "Why FoxyWall on macOS: a native, Apple-notarized app with VLESS+Reality that bypasses deep-packet inspection, unlimited speed, 200+ servers, and a strict no-logs policy.",
    alternates: { canonical: `https://www.foxywall.xyz/${lang}/macos` },
  }
}

export default async function LocalizedMacosPage({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params
  if (!isLanguage(lang)) notFound()
  return <PlatformVpnPage platform="macos" initialLanguage={getLanguageOrDefault(lang)} />
}
