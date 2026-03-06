"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Menu, X, ChevronDown } from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { useLanguage } from "@/lib/language-context"
import { getStoreUrl } from "@/lib/device-utils"
import { usePathname, useRouter } from "next/navigation"
import { replaceLocaleInPathname } from "@/lib/i18n-routing"

export function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const { language, setLanguage, t, languages } = useLanguage()
  const pathname = usePathname()
  const router = useRouter()
  const currentLang = languages.find((l) => l.code === language) || languages[0]

  const handleStartClick = () => {
    const url = getStoreUrl()
    window.open(url, "_blank", "noopener,noreferrer")
  }

  const handleLanguageChange = (nextLanguage: typeof language) => {
    setLanguage(nextLanguage)
    router.push(replaceLocaleInPathname(pathname, nextLanguage))
  }

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-md border-b border-border">
      <nav className="container mx-auto px-6 h-16 flex items-center justify-between">
        <Link href={`/${language}`} className="flex items-center gap-2.5">
          <Image
            src="/unnamed.jpeg"
            alt="FoxyWall Logo"
            width={36}
            height={36}
            className="w-9 h-9 rounded-lg object-cover"
          />
          <span className="text-xl font-bold text-foreground">FoxyWall</span>
        </Link>

        <div className="hidden md:flex items-center gap-8">
          <Link href={`/${language}#features`} className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
            {t("features")}
          </Link>
          <Link href={`/${language}#pricing`} className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
            {t("pricing")}
          </Link>
          <Link href={`/${language}/blog`} className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
            {t("blog")}
          </Link>
        </div>

        <div className="hidden md:flex items-center gap-3">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm" className="text-foreground gap-1.5">
                <span className="text-base">{currentLang.flag}</span>
                <ChevronDown className="w-3 h-3 opacity-50" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="bg-background border-border min-w-[160px]">
              {languages.map((lang) => (
                <DropdownMenuItem
                  key={lang.code}
                  onClick={() => handleLanguageChange(lang.code)}
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
            className="bg-primary text-primary-foreground hover:bg-primary/90 rounded-full px-6 font-semibold"
            onClick={handleStartClick}
          >
            {t("start")}
          </Button>
        </div>

        <button className="md:hidden text-foreground" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
          {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </nav>

      {mobileMenuOpen && (
        <div className="md:hidden bg-background border-b border-border">
          <div className="container mx-auto px-6 py-4 flex flex-col gap-3">
            <Link href={`/${language}#features`} className="text-muted-foreground hover:text-foreground py-2 font-medium" onClick={() => setMobileMenuOpen(false)}>{t("features")}</Link>
            <Link href={`/${language}#pricing`} className="text-muted-foreground hover:text-foreground py-2 font-medium" onClick={() => setMobileMenuOpen(false)}>{t("pricing")}</Link>
            <Link href={`/${language}/blog`} className="text-muted-foreground hover:text-foreground py-2 font-medium" onClick={() => setMobileMenuOpen(false)}>{t("blog")}</Link>
            <div className="pt-3 border-t border-border">
              <div className="grid grid-cols-2 gap-2 mb-4">
                {languages.map((lang) => (
                  <button key={lang.code} onClick={() => handleLanguageChange(lang.code)}
                    className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm transition-colors ${language === lang.code ? "bg-primary/10 text-primary" : "hover:bg-secondary text-foreground"}`}>
                    <span>{lang.flag}</span><span>{lang.name}</span>
                  </button>
                ))}
              </div>
              <Button className="w-full bg-primary text-primary-foreground hover:bg-primary/90 rounded-full font-semibold" onClick={handleStartClick}>
                {t("start")}
              </Button>
            </div>
          </div>
        </div>
      )}
    </header>
  )
}
