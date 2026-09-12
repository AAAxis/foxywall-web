"use client"

import { motion } from "framer-motion"
import { ArrowRight, Shield, Zap, Globe } from "lucide-react"
import Link from "next/link"
import { useLanguage } from "@/lib/language-context"

export function Hero() {
  const { t, language } = useLanguage()

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
            className="inline-block bg-primary text-primary-foreground rounded-full px-10 py-4 text-lg font-semibold"
          >
            {t("comingSoon")}
          </motion.div>
        </div>
      </div>
    </section>
  )
}
