"use client"

import { useRef } from "react"
import { motion, useInView } from "framer-motion"
import { Shield, Globe, Zap, Lock, Users, Wifi, Eye, Server } from "lucide-react"
import { useLanguage } from "@/lib/language-context"

export function Features() {
  const { t } = useLanguage()
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: "-100px" })

  const features = [
    { icon: Shield, text: t("feature1") },
    { icon: Users, text: t("feature2") },
    { icon: Globe, text: t("feature3") },
    { icon: Wifi, text: t("feature4") },
    { icon: Lock, text: t("feature5") },
    { icon: Zap, text: t("feature6") },
    { icon: Eye, text: t("feature7") },
    { icon: Server, text: t("feature8") },
  ]

  return (
    <section id="features" className="py-20 md:py-28" ref={ref}>
      <div className="container mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <span className="inline-block text-sm font-semibold text-primary uppercase tracking-wider mb-3">{t("featuresSectionTitle")}</span>
          <h2 className="text-3xl md:text-5xl font-bold text-foreground mb-4">{t("featuresSectionSubtitle")}</h2>
          <p className="text-muted-foreground text-lg max-w-lg mx-auto">{t("featuresSectionDescription")}</p>
        </motion.div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5 max-w-6xl mx-auto">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 40 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: index * 0.08 }}
              className="bg-card border border-border rounded-xl p-6 hover:border-foreground/20 transition-colors"
            >
              <div className="w-10 h-10 rounded-lg border border-border flex items-center justify-center mb-4">
                <feature.icon className="w-5 h-5 text-primary" />
              </div>
              <p className="text-foreground leading-relaxed">{feature.text}</p>
            </motion.div>
          ))}
        </div>

        {/* Stats bar */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.8 }}
          className="mt-20 grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto"
        >
          {[
            { value: "5M+", label: t("downloadsLabel") },
            { value: "200+", label: t("serversLabel") },
            { value: "99.9%", label: t("uptimeLabel") },
            { value: "0", label: t("logsStoredLabel") },
          ].map((stat, i) => (
            <div
              key={i}
              className="text-center p-6 rounded-xl border border-border"
            >
              <div className="text-3xl md:text-4xl font-semibold text-foreground mb-1 tabular-nums">
                {stat.value}
              </div>
              <div className="text-sm text-muted-foreground">{stat.label}</div>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}
