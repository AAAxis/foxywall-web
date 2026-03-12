"use client"

import Link from "next/link"
import Image from "next/image"
import { useLanguage } from "@/lib/language-context"

export function Footer() {
  const { t, language } = useLanguage()

  return (
    <footer className="border-t border-border py-12 bg-background">
      <div className="container mx-auto px-6">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-8">
          <div className="flex items-center gap-2.5">
            <Image
              src="/unnamed.jpeg"
              alt="FoxyWall Logo"
              width={32}
              height={32}
              className="w-8 h-8 rounded-lg object-cover"
            />
            <span className="text-lg font-bold text-foreground">FoxyWall</span>
          </div>

          <div className="flex flex-wrap gap-6 text-sm">
            <Link href={`/${language}#features`} className="text-muted-foreground hover:text-foreground transition-colors">{t("features")}</Link>
            <Link href={`/${language}#pricing`} className="text-muted-foreground hover:text-foreground transition-colors">{t("pricing")}</Link>
            <Link href={`/${language}/blog`} className="text-muted-foreground hover:text-foreground transition-colors">{t("blog")}</Link>
            <Link href="https://holylabs.net/privacy" target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-foreground transition-colors">{t("privacyPolicy")}</Link>
            <Link href="https://www.apple.com/legal/internet-services/itunes/dev/stdeula/" target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-foreground transition-colors">{t("terms")}</Link>
          </div>
        </div>

        <div className="mt-8 pt-8 border-t border-border flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-sm text-muted-foreground">© {new Date().getFullYear()} FoxyWall. All rights reserved.</p>
          <p className="text-sm text-muted-foreground">
            Made by <Link href="https://holylabs.net" target="_blank" className="text-primary hover:underline">Holylabs</Link>
          </p>
        </div>
      </div>
    </footer>
  )
}
