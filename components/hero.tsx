"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Smartphone, Chrome, ArrowRight, Shield, Zap, Globe, Monitor, Apple } from "lucide-react"
import Link from "next/link"
import { useLanguage } from "@/lib/language-context"

const WINDOWS_DOWNLOAD_URL =
  "https://github.com/AAAxis/foxywall-downloads/releases/latest/download/FoxyWallVPN-Setup.exe"
const MACOS_DOWNLOAD_URL =
  "https://github.com/AAAxis/foxywall-downloads/releases/latest/download/FoxyWall.pkg"
const CHROME_EXTENSION_URL =
  "https://github.com/AAAxis/foxywall-downloads/releases/latest/download/FoxyWallProxy.zip"

export function Hero() {
  const [activeTab, setActiveTab] = useState<"mobile" | "web" | "desktop">("mobile")
  const [buildDate, setBuildDate] = useState<string | null>(null)
  const [macBuildDate, setMacBuildDate] = useState<string | null>(null)
  const { t, language } = useLanguage()

  // Show the latest desktop build dates — read from each GitHub release asset's
  // updated_at (bumped on every --clobber upload), so they stay current automatically.
  useEffect(() => {
    const fmt = (iso: string) =>
      new Date(iso).toLocaleDateString(undefined, { year: "numeric", month: "short", day: "numeric" })
    fetch("https://api.github.com/repos/AAAxis/foxywall-downloads/releases/latest")
      .then((r) => (r.ok ? r.json() : null))
      .then((d) => {
        if (!d) return
        const win = d.assets?.find((a: { name: string }) => a.name === "FoxyWallVPN-Setup.exe")
        const mac = d.assets?.find((a: { name: string }) => a.name === "FoxyWall.pkg")
        if (win?.updated_at || d.published_at) setBuildDate(fmt(win?.updated_at || d.published_at))
        if (mac?.updated_at) setMacBuildDate(fmt(mac.updated_at))
      })
      .catch(() => {})
  }, [])

  return (
    <section className="pt-24 pb-20 md:pt-32 md:pb-28 relative overflow-hidden">
      <div className="container mx-auto px-6 relative">
        <div className="max-w-3xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 border border-border text-muted-foreground rounded-full px-4 py-1.5 text-xs font-medium tracking-wider uppercase mb-6"
          >
            {t("trustedByThousands")}
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-5xl md:text-6xl lg:text-7xl font-bold text-foreground leading-[1.1] mb-6 tracking-tight"
          >
            {t("professionalVpn")}
            <br />
            <span className="text-primary">{t("service")}</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-lg text-muted-foreground mb-10 max-w-xl mx-auto leading-relaxed"
          >
            {t("heroDescription")}
          </motion.p>

          {/* Referral banner */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.25 }}
          >
            <Link
              href={`/${language}/refer`}
              className="inline-flex items-center gap-2 border border-border text-foreground rounded-full px-5 py-2 text-sm font-medium mb-6 hover:border-primary/50 transition-colors"
            >
              {t("referGiftCta")} <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </motion.div>

          {/* Floating trust badges */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="flex justify-center gap-6 mb-10"
          >
            {[
              { icon: Shield, label: t("safe") },
              { icon: Zap, label: t("fast") },
              { icon: Globe, label: t("serversCount") },
            ].map((badge, i) => (
              <motion.div
                key={i}
                whileHover={{ y: -4, scale: 1.05 }}
                className="flex items-center gap-2 bg-background border border-border rounded-full px-4 py-2 shadow-sm"
              >
                <badge.icon className="w-4 h-4 text-primary" />
                <span className="text-sm font-medium text-foreground">{badge.label}</span>
              </motion.div>
            ))}
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            <div className="inline-flex bg-secondary rounded-full p-1 mb-10">
              <button
                onClick={() => setActiveTab("mobile")}
                className={`flex items-center gap-2 px-6 py-2.5 rounded-full text-sm font-medium transition-all ${
                  activeTab === "mobile" ? "bg-background text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"
                }`}
              >
                <Smartphone className="w-4 h-4" />
                {t("mobile")}
              </button>
              <button
                onClick={() => setActiveTab("web")}
                className={`flex items-center gap-2 px-6 py-2.5 rounded-full text-sm font-medium transition-all ${
                  activeTab === "web" ? "bg-background text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"
                }`}
              >
                <Chrome className="w-4 h-4" />
                Web
              </button>
              <button
                onClick={() => setActiveTab("desktop")}
                className={`flex items-center gap-2 px-6 py-2.5 rounded-full text-sm font-medium transition-all ${
                  activeTab === "desktop" ? "bg-background text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"
                }`}
              >
                <Monitor className="w-4 h-4" />
                Desktop
              </button>
            </div>

            {activeTab === "mobile" && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3 }}
                className="space-y-4"
              >
                <p className="text-sm text-muted-foreground">{t("availableOnIosAndroid")}</p>
                <div className="flex flex-wrap justify-center gap-4">
                  <Link
                    href="https://apps.apple.com/app/id6757646633"
                    target="_blank"
                    className="inline-flex items-center gap-2 bg-foreground text-background px-6 py-3 rounded-xl font-semibold hover:opacity-90 transition-all hover:scale-105"
                  >
                    <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor"><path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.8-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z"/></svg>
                    {t("appStore")}
                  </Link>
                  <Link
                    href="https://play.google.com/store/apps/details?id=com.theholylabs.rock"
                    target="_blank"
                    className="inline-flex items-center gap-2 bg-foreground text-background px-6 py-3 rounded-xl font-semibold hover:opacity-90 transition-all hover:scale-105"
                  >
                    <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor"><path d="M3,20.5V3.5C3,2.91 3.34,2.39 3.84,2.15L13.69,12L3.84,21.85C3.34,21.61 3,21.09 3,20.5M16.81,15.12L6.05,21.34L14.54,12.85L16.81,15.12M20.16,10.81C20.5,11.08 20.75,11.5 20.75,12C20.75,12.5 20.53,12.9 20.18,13.18L17.89,14.5L15.39,12L17.89,9.5L20.16,10.81M6.05,2.66L16.81,8.88L14.54,11.15L6.05,2.66Z"/></svg>
                    {t("googlePlay")}
                  </Link>
                </div>
              </motion.div>
            )}

            {activeTab === "web" && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3 }}
                className="space-y-4"
              >
                <p className="text-sm text-muted-foreground">{t("availableForChrome")}</p>
                <a href={CHROME_EXTENSION_URL}>
                  <Button className="bg-primary text-primary-foreground hover:bg-primary/90 rounded-full px-8 py-3 font-semibold gap-2 hover:scale-105 transition-transform">
                    <Chrome className="w-5 h-5" />
                    {t("downloadExtension")}
                    <ArrowRight className="w-4 h-4" />
                  </Button>
                </a>
                <p className="text-xs text-muted-foreground max-w-md mx-auto leading-relaxed">
                  {t("extensionManualInstall")}
                </p>
              </motion.div>
            )}

            {activeTab === "desktop" && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3 }}
                className="space-y-4"
              >
                <p className="text-sm text-muted-foreground">{t("availableForDesktop")}</p>
                <div className="flex flex-wrap justify-center gap-4">
                  <div className="flex flex-col items-center gap-1.5">
                    <a href={WINDOWS_DOWNLOAD_URL}>
                      <Button className="bg-primary text-primary-foreground hover:bg-primary/90 rounded-full px-8 py-3 font-semibold gap-2 hover:scale-105 transition-transform">
                        <Monitor className="w-5 h-5" />
                        {t("downloadForWindows")}
                      </Button>
                    </a>
                    {buildDate && (
                      <p className="text-xs text-muted-foreground">Build: {buildDate}</p>
                    )}
                  </div>
                  <div className="flex flex-col items-center gap-1.5">
                    <a href={MACOS_DOWNLOAD_URL}>
                      <Button className="bg-primary text-primary-foreground hover:bg-primary/90 rounded-full px-8 py-3 font-semibold gap-2 hover:scale-105 transition-transform">
                        <Apple className="w-5 h-5" />
                        {t("downloadForMacOS")}
                      </Button>
                    </a>
                    {macBuildDate && (
                      <p className="text-xs text-muted-foreground">Build: {macBuildDate}</p>
                    )}
                  </div>
                </div>
              </motion.div>
            )}
          </motion.div>
        </div>
      </div>
    </section>
  )
}
