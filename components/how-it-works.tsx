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

        <div className="relative max-w-4xl mx-auto">
          {/* Connecting line */}
          <div className="hidden md:block absolute top-1/2 left-0 right-0 h-0.5 bg-gradient-to-r from-orange-500/20 via-orange-500/40 to-amber-500/20 -translate-y-1/2" />

          <div className="grid md:grid-cols-3 gap-8 md:gap-12">
            {steps.map((step, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 40 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.5, delay: index * 0.15 }}
                className="relative text-center"
              >
                {/* Step number */}
                <motion.div
                  whileHover={{ scale: 1.1, transition: { duration: 0.2 } }}
                  className="relative z-10 w-20 h-20 rounded-2xl bg-gradient-to-br from-orange-500 to-amber-500 flex items-center justify-center mx-auto mb-6 shadow-lg shadow-orange-500/20"
                >
                  <step.icon className="w-9 h-9 text-white" />
                </motion.div>

                {/* Step indicator */}
                <span className="inline-block text-xs font-bold text-primary uppercase tracking-widest mb-2">
                  {step.number}
                </span>

                <h3 className="text-foreground font-semibold text-xl mb-2">{step.title}</h3>
                <p className="text-muted-foreground text-sm leading-relaxed max-w-xs mx-auto">{step.description}</p>

                {/* Arrow for mobile */}
                {index < steps.length - 1 && (
                  <div className="md:hidden flex justify-center my-4">
                    <div className="w-0.5 h-8 bg-gradient-to-b from-orange-500/40 to-amber-500/20" />
                  </div>
                )}
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
