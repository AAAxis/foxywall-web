"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Smartphone, Download, Chrome } from "lucide-react"
import Link from "next/link"
import { useLanguage } from "@/lib/language-context"

export function Hero() {
  const [activeTab, setActiveTab] = useState<"mobile" | "extension">("mobile")
  const { t } = useLanguage()

  return (
    <section className="pt-28 pb-16 md:pt-36 md:pb-24 relative">
      <div className="container mx-auto px-6">
        <div className="max-w-2xl">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-foreground leading-tight mb-6">
            {t("professionalVpn")}
            <br />
            {t("service")}
          </h1>

          <div className="flex flex-wrap gap-2 mb-8">
            <span className="px-4 py-1.5 rounded-full bg-secondary text-sm text-muted-foreground">{t("fast")}</span>
            <span className="px-4 py-1.5 rounded-full bg-secondary text-sm text-muted-foreground">{t("safe")}</span>
            <span className="px-4 py-1.5 rounded-full bg-secondary text-sm text-muted-foreground">{t("reliable")}</span>
          </div>

          <p className="text-muted-foreground mb-10 max-w-md">{t("heroDescription")}</p>

          <div className="inline-flex bg-secondary rounded-full p-1 mb-8">
            <button
              onClick={() => setActiveTab("mobile")}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-full text-sm transition-all ${
                activeTab === "mobile" ? "bg-card text-foreground" : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <Smartphone className="w-4 h-4" />
              {t("mobile")}
            </button>
            <button
              onClick={() => setActiveTab("extension")}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-full text-sm transition-all ${
                activeTab === "extension" ? "bg-card text-foreground" : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <Chrome className="w-4 h-4" />
              {t("extension")}
            </button>
          </div>

          <div className="mb-10">
            {activeTab === "mobile" ? (
              <div>
                <h2 className="text-xl font-semibold text-foreground mb-2">{t("montiVpnForMobile")}</h2>
                <p className="text-sm text-muted-foreground mb-4">{t("availableOnIosAndroid")}</p>
                <div className="flex flex-wrap gap-3">
                  <Link
                    href="https://apps.apple.com/us/app/foxywall/id6755795018"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <Button
                      variant="outline"
                      className="border-primary text-primary hover:bg-primary hover:text-primary-foreground gap-2 rounded-full bg-transparent"
                    >
                      <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z" />
                      </svg>
                      {t("appStore")}
                      <Download className="w-4 h-4" />
                    </Button>
                  </Link>
                  <Link
                    href="https://play.google.com/store/apps/details?id=com.theholylabs.rock"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <Button
                      variant="outline"
                      className="border-primary text-primary hover:bg-primary hover:text-primary-foreground gap-2 rounded-full bg-transparent"
                    >
                      <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M3,20.5V3.5C3,2.91 3.34,2.39 3.84,2.15L13.69,12L3.84,21.85C3.34,21.6 3,21.09 3,20.5M16.81,15.12L6.05,21.34L14.54,12.85L16.81,15.12M20.16,10.81C20.5,11.08 20.75,11.5 20.75,12C20.75,12.5 20.5,12.92 20.16,13.19L17.89,14.5L15.39,12L17.89,9.5L20.16,10.81M6.05,2.66L16.81,8.88L14.54,11.15L6.05,2.66Z" />
                      </svg>
                      {t("googlePlay")}
                      <Download className="w-4 h-4" />
                    </Button>
                  </Link>
                </div>
              </div>
            ) : (
              <div>
                <h2 className="text-xl font-semibold text-foreground mb-2">{t("montiVpnForExtension")}</h2>
                <p className="text-sm text-muted-foreground mb-4">{t("availableForChrome")}</p>
                <Link
                  href="https://bucket.roamjet.net/uploads/chrome-proxy.zip"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Button
                    variant="outline"
                    className="border-primary text-primary hover:bg-primary hover:text-primary-foreground gap-2 rounded-full bg-transparent"
                  >
                    <Chrome className="w-5 h-5" />
                    {t("downloadExtension")}
                    <Download className="w-4 h-4" />
                  </Button>
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  )
}
