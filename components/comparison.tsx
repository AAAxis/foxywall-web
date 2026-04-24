"use client"

import { useRef } from "react"
import { motion, useInView } from "framer-motion"
import { Check, X } from "lucide-react"
import { useLanguage } from "@/lib/language-context"

export function Comparison() {
  const { t } = useLanguage()
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: "-100px" })

  const rows = [
    { foxywall: t("comparisonFoxy1"), traditional: t("comparisonTraditional1") },
    { foxywall: t("comparisonFoxy2"), traditional: t("comparisonTraditional2") },
    { foxywall: t("comparisonFoxy3"), traditional: t("comparisonTraditional3") },
    { foxywall: t("comparisonFoxy4"), traditional: t("comparisonTraditional4") },
    { foxywall: t("comparisonFoxy5"), traditional: t("comparisonTraditional5") },
    { foxywall: t("comparisonFoxy6"), traditional: t("comparisonTraditional6") },
  ]

  return (
    <section id="comparison" className="py-20 md:py-28" ref={ref}>
      <div className="container mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <span className="inline-block text-sm font-semibold text-primary uppercase tracking-wider mb-3">
            {t("comparisonSectionTitle")}
          </span>
          <h2 className="text-3xl md:text-5xl font-bold text-foreground mb-4">
            {t("comparisonHeading")}
          </h2>
          <p className="text-muted-foreground text-lg max-w-lg mx-auto">
            {t("comparisonSubtitle")}
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="max-w-4xl mx-auto overflow-hidden rounded-2xl border border-border"
        >
          <div className="grid grid-cols-3 bg-card">
            <div className="p-4 md:p-6" />
            <div className="p-4 md:p-6 text-center">
              <span className="font-semibold text-foreground">FoxyWall</span>
            </div>
            <div className="p-4 md:p-6 text-center">
              <span className="font-semibold text-muted-foreground">
                {t("comparisonTraditionalLabel")}
              </span>
            </div>
          </div>

          {rows.map((row, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 10 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.3, delay: 0.2 + index * 0.05 }}
              className="grid grid-cols-3 border-t border-border"
            >
              <div className="p-4 md:p-6 flex items-center">
                <span className="text-sm md:text-base text-foreground">{row.foxywall}</span>
              </div>
              <div className="p-4 md:p-6 flex items-center justify-center">
                <Check className="w-5 h-5 text-primary" />
              </div>
              <div className="p-4 md:p-6 flex items-center justify-center">
                <X className="w-5 h-5 text-muted-foreground" />
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}
