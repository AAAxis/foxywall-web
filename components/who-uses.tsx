"use client"

import { useRef } from "react"
import { motion, useInView } from "framer-motion"
import { ShieldAlert, Plane, Eye, Code } from "lucide-react"
import { useLanguage } from "@/lib/language-context"

export function WhoUses() {
  const { t } = useLanguage()
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: "-100px" })

  const personas = [
    { icon: ShieldAlert, title: t("whoUsesPersona1Title"), description: t("whoUsesPersona1Desc") },
    { icon: Plane, title: t("whoUsesPersona2Title"), description: t("whoUsesPersona2Desc") },
    { icon: Eye, title: t("whoUsesPersona3Title"), description: t("whoUsesPersona3Desc") },
    { icon: Code, title: t("whoUsesPersona4Title"), description: t("whoUsesPersona4Desc") },
  ]

  return (
    <section id="who-uses" className="py-20 md:py-28" ref={ref}>
      <div className="container mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <span className="inline-block text-sm font-semibold text-primary uppercase tracking-wider mb-3">
            {t("whoUsesSectionTitle")}
          </span>
          <h2 className="text-3xl md:text-5xl font-bold text-foreground mb-4">
            {t("whoUsesHeading")}
          </h2>
          <p className="text-muted-foreground text-lg max-w-lg mx-auto">
            {t("whoUsesSubtitle")}
          </p>
        </motion.div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
          {personas.map((persona, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 40 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="bg-card border border-border rounded-xl p-6 hover:border-foreground/20 transition-colors"
            >
              <div className="w-10 h-10 rounded-lg border border-border flex items-center justify-center mb-4">
                <persona.icon className="w-5 h-5 text-primary" />
              </div>
              <h3 className="text-foreground font-semibold text-lg mb-2">{persona.title}</h3>
              <p className="text-muted-foreground text-sm leading-relaxed">{persona.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
