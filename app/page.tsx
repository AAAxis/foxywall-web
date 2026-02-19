"use client"

import { LanguageProvider } from "@/lib/language-context"
import { Header } from "@/components/header"
import { Hero } from "@/components/hero"
import { Features } from "@/components/features"
import { Pricing } from "@/components/pricing"
import { Footer } from "@/components/footer"

import { useState, useEffect } from "react"

export default function Home() {
  const [isMounted, setIsMounted] = useState(false)

  useEffect(() => {
    setIsMounted(true)
  }, [])

  return (
    <LanguageProvider>
      <main className="min-h-screen bg-background relative overflow-hidden">
        <div className="fixed inset-0 pointer-events-none">
          <svg
            className="absolute right-0 top-0 h-full w-1/2 opacity-20"
            viewBox="0 0 500 1000"
            preserveAspectRatio="xMaxYMid slice"
          >
            {isMounted && Array.from({ length: 40 }).map((_, i) => (
              <line
                key={i}
                x1="500"
                y1="500"
                x2={500 - Math.cos((i * Math.PI) / 20) * 800}
                y2={500 - Math.sin((i * Math.PI) / 20) * 800}
                stroke="currentColor"
                strokeWidth="0.5"
                className="text-muted-foreground/30"
              />
            ))}
          </svg>
        </div>
        <Header />
        <Hero />
        <Features />
        <Pricing />
        <Footer />
      </main>
    </LanguageProvider>
  )
}
