"use client"

import { useRef } from "react"
import { motion, useInView } from "framer-motion"
import { CreditCard, Download, Wifi } from "lucide-react"
import { useLanguage } from "@/lib/language-context"

export function HowItWorks() {
  const { t } = useLanguage()
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: "-100px" })

  const steps = [
    { icon: CreditCard, title: t("howStep1Title"), description: t("howStep1Desc"), number: "01" },
    { icon: Download, title: t("howStep2Title"), description: t("howStep2Desc"), number: "02" },
    { icon: Wifi, title: t("howStep3Title"), description: t("howStep3Desc"), number: "03" },
  ]

  return (
    <section id="how-it-works" className="py-20 md:py-28" ref={ref}>
      <div className="container mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <span className="inline-block text-sm font-semibold text-primary uppercase tracking-wider mb-3">
            {t("howSectionTitle")}
          </span>
          <h2 className="text-3xl md:text-5xl font-bold text-foreground mb-4">
            {t("howHeading")}
          </h2>
          <p className="text-muted-foreground text-lg max-w-lg mx-auto">
            {t("howSubtitle")}
          </p>
        </motion.div>

        <div className="max-w-5xl mx-auto grid md:grid-cols-3 gap-6">
          {steps.map((step, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="bg-card border border-border rounded-xl p-8"
            >
              <div className="flex items-center justify-between mb-6">
                <span className="text-xs font-mono text-muted-foreground tracking-widest">{step.number}</span>
                <step.icon className="w-5 h-5 text-primary" />
              </div>
              <h3 className="text-foreground font-semibold text-lg mb-2">{step.title}</h3>
              <p className="text-muted-foreground text-sm leading-relaxed">{step.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
