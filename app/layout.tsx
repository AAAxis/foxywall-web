import type React from "react"
import type { Metadata, Viewport } from "next"
import { Inter, Geist_Mono } from "next/font/google"
import { Analytics } from "@vercel/analytics/next"
import "./globals.css"

const _inter = Inter({ subsets: ["latin"] })
const _geistMono = Geist_Mono({ subsets: ["latin"] })

const BASE_URL = "https://www.foxywall.xyz"

const TITLE = "FoxyWall — Secure No-Logs VPN for Privacy & Censorship Bypass"
const DESCRIPTION =
  "FoxyWall — fast, private VPN with DPI-resistant encryption. No logs, 200+ servers, works in restricted regions. Available on iOS, Android & Chrome."

const LOCALES: Array<{ hreflang: string; og: string }> = [
  { hreflang: "en", og: "en_US" },
  { hreflang: "ru", og: "ru_RU" },
  { hreflang: "zh-Hans", og: "zh_CN" },
]

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#0a0a0a" },
    { media: "(prefers-color-scheme: dark)", color: "#0a0a0a" },
  ],
}

export const metadata: Metadata = {
  title: { default: TITLE, template: "%s | FoxyWall" },
  description: DESCRIPTION,
  keywords: [
    "VPN",
    "no-logs VPN",
    "DPI-resistant VPN",
    "censorship bypass",
    "privacy",
    "FoxyWall",
    "secure browsing",
    "VPN for China",
    "VPN for Russia",
    "VPN for Iran",
  ],
  authors: [{ name: "FoxyWall Team" }],
  creator: "FoxyWall",
  publisher: "FoxyWall",
  metadataBase: new URL(BASE_URL),
  alternates: {
    canonical: "/",
    languages: {
      ...Object.fromEntries(LOCALES.map((l) => [l.hreflang, `/${l.hreflang}`])),
      "x-default": "/en",
    },
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    alternateLocale: LOCALES.filter((l) => l.og !== "en_US").map((l) => l.og),
    url: "/",
    title: TITLE,
    description: DESCRIPTION,
    siteName: "FoxyWall",
    images: [{ url: "/unnamed.jpeg", width: 1200, height: 630, alt: "FoxyWall — Fast & Secure VPN" }],
  },
  twitter: {
    card: "summary_large_image",
    title: TITLE,
    description: DESCRIPTION,
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

const organizationLd = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: "FoxyWall",
  url: BASE_URL,
  logo: `${BASE_URL}/unnamed.jpeg`,
  image: `${BASE_URL}/unnamed.jpeg`,
  description: DESCRIPTION,
  sameAs: [
    "https://apps.apple.com/app/id6757646633",
    "https://play.google.com/store/apps/details?id=com.theholylabs.rock",
  ],
}

const websiteLd = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  name: "FoxyWall",
  url: BASE_URL,
  inLanguage: "en-US",
  publisher: { "@type": "Organization", name: "FoxyWall", url: BASE_URL },
}

const softwareApplicationLd = {
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  name: "FoxyWall VPN",
  image: `${BASE_URL}/unnamed.jpeg`,
  applicationCategory: "SecurityApplication",
  operatingSystem: "iOS, Android, Chrome",
  description: DESCRIPTION,
  inLanguage: "en-US",
  offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
  featureList: [
    "No-Registration VPN",
    "DPI-Resistant Encryption",
    "No-Logs Policy",
    "Multi-Device Support",
    "Kill Switch",
    "200+ Servers in 50+ Countries",
  ],
}

const productLd = {
  "@context": "https://schema.org",
  "@type": "Product",
  name: "FoxyWall VPN",
  image: `${BASE_URL}/unnamed.jpeg`,
  description: DESCRIPTION,
  brand: { "@type": "Brand", name: "FoxyWall" },
  offers: [
    {
      "@type": "Offer",
      name: "1 Month",
      price: "4.99",
      priceCurrency: "USD",
      availability: "https://schema.org/InStock",
      url: BASE_URL,
    },
    {
      "@type": "Offer",
      name: "12 Months",
      price: "39.99",
      priceCurrency: "USD",
      availability: "https://schema.org/InStock",
      url: BASE_URL,
    },
  ],
}

const faqLd = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    {
      "@type": "Question",
      name: "What is FoxyWall VPN?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "FoxyWall is a privacy-focused VPN service with DPI-resistant encryption, designed to work in countries with heavy internet censorship like China, Russia, and Iran. Unlike traditional VPNs, FoxyWall doesn't require registration and stores zero user data.",
      },
    },
    {
      "@type": "Question",
      name: "Does FoxyWall keep any logs?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "No. FoxyWall operates under a strict zero-logs policy. We don't record browsing history, IP addresses, DNS queries, or connection metadata.",
      },
    },
    {
      "@type": "Question",
      name: "Which devices does FoxyWall support?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "FoxyWall is available on iOS, Android, and as a Chrome browser extension.",
      },
    },
    {
      "@type": "Question",
      name: "Can I use FoxyWall in China, Russia, or Iran?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Yes. FoxyWall uses DPI-resistant protocols specifically engineered to bypass deep packet inspection and government firewalls.",
      },
    },
    {
      "@type": "Question",
      name: "How many devices can I connect simultaneously?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "There is no device limit. A single FoxyWall subscription covers unlimited devices.",
      },
    },
    {
      "@type": "Question",
      name: "Is there a free trial?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Yes. FoxyWall offers free server locations that you can use without a subscription. Premium plans unlock 200+ servers across 50+ countries.",
      },
    },
    {
      "@type": "Question",
      name: "How do I cancel my subscription?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "You can cancel anytime through your App Store or Google Play account settings. There are no cancellation fees, and your subscription remains active until the end of your billing period.",
      },
    },
  ],
}

const jsonLdBlocks = [organizationLd, websiteLd, softwareApplicationLd, productLd, faqLd]

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <head>
        {jsonLdBlocks.map((block, i) => (
          <script
            key={i}
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: JSON.stringify(block) }}
          />
        ))}
      </head>
      <body className={`font-sans antialiased`}>
        {children}
        <Analytics />
      </body>
    </html>
  )
}
