"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Menu, X, Send, ChevronDown } from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { useLanguage } from "@/lib/language-context"
import { getStoreUrl } from "@/lib/device-utils"

export function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const { language, setLanguage, t, languages } = useLanguage()

  const currentLang = languages.find((l) => l.code === language) || languages[0]

  const handleStartClick = () => {
    const url = getStoreUrl()
    window.open(url, "_blank", "noopener,noreferrer")
  }

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-background/90 backdrop-blur-sm">
      <nav className="container mx-auto px-6 h-20 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2">
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
        </Link>

        <div className="hidden md:flex items-center gap-6">
          <Link href="#features" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
            {t("features")}
          </Link>
          <Link href="#pricing" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
            {t("pricing")}
          </Link>
          <Link href="#download" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
            {t("download")}
          </Link>
          <Link href="/blog" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
            Blog
          </Link>
        </div>

        <div className="hidden md:flex items-center gap-3">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm" className="text-foreground gap-1.5">
                <span className="text-xl">{currentLang.flag}</span>
                <ChevronDown className="w-3 h-3 opacity-50" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="bg-card border-border min-w-[160px]">
              {languages.map((lang) => (
                <DropdownMenuItem
                  key={lang.code}
                  onClick={() => setLanguage(lang.code)}
                  className={`cursor-pointer gap-3 ${language === lang.code ? "bg-primary/10 text-primary" : ""}`}
                >
                  <span className="text-lg">{lang.flag}</span>
                  <span>{lang.name}</span>
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
          <Button
            size="sm"
            className="bg-primary text-primary-foreground hover:bg-primary/90 gap-2 rounded-full px-5"
            onClick={handleStartClick}
          >
            {t("start")}
            <Send className="w-4 h-4" />
          </Button>
        </div>

        <button className="md:hidden text-foreground" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
          {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </nav>

      {mobileMenuOpen && (
        <div className="md:hidden bg-background border-b border-border">
          <div className="container mx-auto px-6 py-4 flex flex-col gap-4">
            <Link
              href="#features"
              className="text-muted-foreground hover:text-foreground transition-colors py-2"
              onClick={() => setMobileMenuOpen(false)}
            >
              {t("features")}
            </Link>
            <Link
              href="#pricing"
              className="text-muted-foreground hover:text-foreground transition-colors py-2"
              onClick={() => setMobileMenuOpen(false)}
            >
              {t("pricing")}
            </Link>
            <Link
              href="#download"
              className="text-muted-foreground hover:text-foreground transition-colors py-2"
              onClick={() => setMobileMenuOpen(false)}
            >
              {t("download")}
            </Link>
            <Link
              href="/blog"
              className="text-muted-foreground hover:text-foreground transition-colors py-2"
              onClick={() => setMobileMenuOpen(false)}
            >
              Blog
            </Link>
            <div className="pt-4 border-t border-border">
              <p className="text-xs text-muted-foreground mb-3">{t("language")}</p>
              <div className="grid grid-cols-2 gap-2">
                {languages.map((lang) => (
                  <button
                    key={lang.code}
                    onClick={() => setLanguage(lang.code)}
                    className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm transition-colors ${
                      language === lang.code ? "bg-primary/20 text-primary" : "bg-card hover:bg-card/80 text-foreground"
                    }`}
                  >
                    <span>{lang.flag}</span>
                    <span>{lang.name}</span>
                  </button>
                ))}
              </div>
            </div>
            <div className="flex flex-col gap-2 pt-4 border-t border-border">
              <Button
                className="w-full bg-primary text-primary-foreground hover:bg-primary/90 gap-2 rounded-full"
                onClick={handleStartClick}
              >
                {t("start")}
                <Send className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>
      )}
    </header>
  )
}
