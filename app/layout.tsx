import type React from "react"
import type { Metadata } from "next"
import { Inter, Geist_Mono } from "next/font/google"
import { Analytics } from "@vercel/analytics/next"
import "./globals.css"

const _inter = Inter({ subsets: ["latin"] })
const _geistMono = Geist_Mono({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: {
    default: "FoxyWall - Fast, Safe & Reliable VPN Service",
    template: "%s | FoxyWall",
  },
  description: "Fast, safe and reliable VPN service. Experience faster, safer and unlimited browsing with FoxyWall. Protect your privacy on any device.",
  keywords: ["VPN", "privacy", "security", "FoxyWall", "online privacy", "secure browsing", "fast VPN"],
  authors: [{ name: "FoxyWall Team" }],
  creator: "FoxyWall",
  publisher: "FoxyWall",
  metadataBase: new URL("https://www.foxywall.xyz"),
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "/",
    title: "FoxyWall - Fast, Safe & Reliable VPN Service",
    description: "Fast, safe and reliable VPN service. Protect your privacy on any device with FoxyWall.",
    siteName: "FoxyWall",
    images: [{ url: "/unnamed.jpeg", width: 1200, height: 630, alt: "FoxyWall VPN" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "FoxyWall - Fast, Safe & Reliable VPN Service",
    description: "Fast, safe and reliable VPN service. Protect your privacy on any device.",
    images: ["/unnamed.jpeg"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large" as const,
      "max-snippet": -1,
    },
  },
  icons: {
    icon: "/unnamed.jpeg",
    apple: "/unnamed.jpeg",
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <head>
        {/* Organization structured data */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Organization",
              name: "FoxyWall",
              url: "https://www.foxywall.xyz",
              logo: "https://www.foxywall.xyz/unnamed.jpeg",
              description: "Fast, safe and reliable VPN service for privacy-conscious users worldwide.",
              sameAs: [
                "https://apps.apple.com/us/app/foxywall-vpn/id6755795018",
                "https://play.google.com/store/apps/details?id=com.theholylabs.rock",
              ],
            }),
          }}
        />
      </head>
      <body className={`font-sans antialiased`}>
        {children}
        <Analytics />
      </body>
    </html>
  )
}
