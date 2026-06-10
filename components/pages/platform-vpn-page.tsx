"use client"

import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import { LanguageProvider, useLanguage } from "@/lib/language-context"
import type { Language } from "@/lib/translations"
import {
  Monitor, Apple, Chrome, Smartphone, ShieldCheck, EyeOff,
  Infinity as InfinityIcon, Globe, Users, ArrowRight, Puzzle, BadgeCheck,
} from "lucide-react"

export type VpnPlatform = "windows" | "macos" | "chrome" | "android" | "ios"

const WINDOWS_DOWNLOAD_URL =
  "https://github.com/AAAxis/foxywall-downloads/releases/latest/download/FoxyWallVPN-Setup.exe"
const MACOS_DOWNLOAD_URL =
  "https://github.com/AAAxis/foxywall-downloads/releases/latest/download/FoxyWall.pkg"
const CHROME_EXTENSION_URL =
  "https://github.com/AAAxis/foxywall-downloads/releases/latest/download/FoxyWallProxy.zip"
const APP_STORE_URL = "https://apps.apple.com/app/id6757646633"
const GOOGLE_PLAY_URL = "https://play.google.com/store/apps/details?id=com.theholylabs.rock"

const CONFIG = {
  windows: {
    url: WINDOWS_DOWNLOAD_URL, external: false, icon: Monitor, highlightIcon: BadgeCheck, name: "Windows",
    downloadKey: "downloadForWindows",
    titleKey: "windowsTitle", subtitleKey: "windowsSubtitle", requirementsKey: "windowsRequirements",
    installKey: "windowsInstall", highlightTitleKey: "windowsHighlightTitle", highlightBodyKey: "windowsHighlightBody",
  },
  macos: {
    url: MACOS_DOWNLOAD_URL, external: false, icon: Apple, highlightIcon: BadgeCheck, name: "macOS",
    downloadKey: "downloadForMacOS",
    titleKey: "macosTitle", subtitleKey: "macosSubtitle", requirementsKey: "macosRequirements",
    installKey: "macosInstall", highlightTitleKey: "macosHighlightTitle", highlightBodyKey: "macosHighlightBody",
  },
  chrome: {
    url: CHROME_EXTENSION_URL, external: false, icon: Chrome, highlightIcon: Puzzle, name: "Google Chrome",
    downloadKey: "downloadExtension",
    titleKey: "chromeTitle", subtitleKey: "chromeSubtitle", requirementsKey: "chromeRequirements",
    installKey: "chromeInstall", highlightTitleKey: "chromeHighlightTitle", highlightBodyKey: "chromeHighlightBody",
  },
  android: {
    url: GOOGLE_PLAY_URL, external: true, icon: Smartphone, highlightIcon: Smartphone, name: "Android",
    downloadKey: "googlePlay",
    titleKey: "androidTitle", subtitleKey: "androidSubtitle", requirementsKey: "androidRequirements",
    installKey: "androidInstall", highlightTitleKey: "androidHighlightTitle", highlightBodyKey: "androidHighlightBody",
  },
  ios: {
    url: APP_STORE_URL, external: true, icon: Apple, highlightIcon: Smartphone, name: "iOS",
    downloadKey: "appStore",
    titleKey: "iosTitle", subtitleKey: "iosSubtitle", requirementsKey: "iosRequirements",
    installKey: "iosInstall", highlightTitleKey: "iosHighlightTitle", highlightBodyKey: "iosHighlightBody",
  },
} as const

function Content({ platform }: { platform: VpnPlatform }) {
  const { t } = useLanguage()
  const c = CONFIG[platform]
  const Icon = c.icon
  const HighlightIcon = c.highlightIcon

  const reasons = [
    { icon: EyeOff, title: t("vpnWhy1Title"), body: t("vpnWhy1Body") },
    { icon: InfinityIcon, title: t("vpnWhy2Title"), body: t("vpnWhy2Body") },
    { icon: Globe, title: t("vpnWhy3Title"), body: t("vpnWhy3Body") },
    { icon: ShieldCheck, title: t("vpnWhy4Title"), body: t("vpnWhy4Body") },
    { icon: Users, title: t("vpnWhy5Title"), body: t("vpnWhy5Body") },
    { icon: HighlightIcon, title: t(c.highlightTitleKey), body: t(c.highlightBodyKey) },
  ]

  const downloadButton = (withArrow = false) => (
    <a href={c.url} {...(c.external ? { target: "_blank", rel: "noopener noreferrer" } : {})}>
      <Button className="bg-primary text-primary-foreground hover:bg-primary/90 rounded-full px-8 py-3 font-semibold gap-2 hover:scale-105 transition-transform">
        <Icon className="w-5 h-5" />
        {t(c.downloadKey)}
        {withArrow && <ArrowRight className="w-4 h-4" />}
      </Button>
    </a>
  )

  return (
    <section className="pt-28 pb-20 md:pt-36">
      <div className="container mx-auto px-6">
        {/* Hero */}
        <div className="max-w-3xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 border border-border text-muted-foreground rounded-full px-4 py-1.5 text-xs font-medium tracking-wider uppercase mb-6">
            <Icon className="w-3.5 h-3.5" /> {c.name}
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-foreground leading-[1.1] mb-6 tracking-tight">
            {t(c.titleKey)}
          </h1>
          <p className="text-lg text-muted-foreground mb-8 max-w-xl mx-auto leading-relaxed">
            {t(c.subtitleKey)}
          </p>
          <div className="flex justify-center">{downloadButton()}</div>
          <p className="text-xs text-muted-foreground mt-4">{t(c.requirementsKey)}</p>
        </div>

        {/* Why grid */}
        <div className="max-w-5xl mx-auto mt-20 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {reasons.map((r, i) => (
            <div key={i} className="bg-secondary/40 border border-border rounded-2xl p-6">
              <div className="w-11 h-11 rounded-xl bg-primary/10 flex items-center justify-center mb-4">
                <r.icon className="w-5 h-5 text-primary" />
              </div>
              <h3 className="text-lg font-semibold text-foreground mb-2">{r.title}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">{r.body}</p>
            </div>
          ))}
        </div>

        {/* Install + CTA */}
        <div className="max-w-3xl mx-auto mt-20 text-center">
          <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-4">{t("vpnGetTitle")}</h2>
          <p className="text-sm text-muted-foreground mb-8 leading-relaxed">{t(c.installKey)}</p>
          <div className="flex justify-center">{downloadButton(true)}</div>
        </div>
      </div>
    </section>
  )
}

export function PlatformVpnPage({
  platform,
  initialLanguage,
}: {
  platform: VpnPlatform
  initialLanguage?: Language
}) {
  return (
    <LanguageProvider initialLanguage={initialLanguage}>
      <main className="min-h-screen bg-background">
        <Header />
        <Content platform={platform} />
        <Footer />
      </main>
    </LanguageProvider>
  )
}
