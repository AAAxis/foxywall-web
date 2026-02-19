"use client"

import Link from "next/link"
import Image from "next/image"
import { useLanguage } from "@/lib/language-context"

export function Footer() {
  const { t } = useLanguage()

  return (
    <footer className="border-t border-border py-12">
      <div className="container mx-auto px-6">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-8">
          <div className="flex items-center gap-2">
            <Image
              src="/unnamed.jpeg"
              alt="FoxyWall Logo"
              width={40}
              height={40}
              className="w-10 h-10 rounded-full object-cover"
            />
            <div className="flex flex-col leading-none">
              <span className="text-lg font-semibold text-foreground">Foxy</span>
              <span className="text-xs text-muted-foreground">Wall</span>
            </div>
          </div>

          <div className="flex flex-wrap gap-6 text-sm">
            <Link href="#features" className="text-muted-foreground hover:text-foreground transition-colors">
              {t("features")}
            </Link>
            <Link href="#pricing" className="text-muted-foreground hover:text-foreground transition-colors">
              {t("pricing")}
            </Link>
            <Link
              href="https://holylabs.net/privacy"
              target="_blank"
              rel="noopener noreferrer"
              className="text-muted-foreground hover:text-foreground transition-colors"
            >
              {t("privacyPolicy")}
            </Link>
            <Link
              href="https://www.apple.com/legal/internet-services/itunes/dev/stdeula/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-muted-foreground hover:text-foreground transition-colors"
            >
              {t("terms")}
            </Link>
          </div>
        </div>

        <div className="mt-8 pt-8 border-t border-border">
          <p className="text-sm text-muted-foreground">
            © {new Date().getFullYear()} Holylabs Ltd. {t("allRightsReserved")}
          </p>
        </div>
      </div>
    </footer>
  )
}
