"use client"

import { useRef } from "react"
import { motion, useInView } from "framer-motion"
import { FileX, MapPinOff, DatabaseZap, ActivitySquare } from "lucide-react"
import { useLanguage } from "@/lib/language-context"

export function PrivacyPromise() {
  const { t } = useLanguage()
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: "-100px" })

  const items = [
    { icon: FileX, title: t("privacyItem1Title"), description: t("privacyItem1Desc") },
    { icon: MapPinOff, title: t("privacyItem2Title"), description: t("privacyItem2Desc") },
    { icon: DatabaseZap, title: t("privacyItem3Title"), description: t("privacyItem3Desc") },
    { icon: ActivitySquare, title: t("privacyItem4Title"), description: t("privacyItem4Desc") },
  ]

  return (
    <section id="privacy-promise" className="py-20 md:py-28 border-y border-border" ref={ref}>
      <div className="container mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <span className="inline-block text-sm font-semibold text-primary uppercase tracking-wider mb-3">
            {t("privacySectionTitle")}
          </span>
          <h2 className="text-3xl md:text-5xl font-bold text-foreground mb-4">
            {t("privacyHeading")}
          </h2>
          <p className="text-muted-foreground text-lg max-w-lg mx-auto">
            {t("privacySubtitle")}
          </p>
        </motion.div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 max-w-5xl mx-auto">
          {items.map((item, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: index * 0.08 }}
              className="bg-card border border-border rounded-xl p-6"
            >
              <div className="w-10 h-10 rounded-lg border border-border flex items-center justify-center mb-4">
                <item.icon className="w-5 h-5 text-primary" />
              </div>
              <h3 className="text-foreground font-semibold mb-2">{item.title}</h3>
              <p className="text-muted-foreground text-sm leading-relaxed">{item.description}</p>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="mt-16 text-center"
        >
          <p className="text-xl md:text-2xl font-medium text-foreground max-w-2xl mx-auto">
            {t("privacyStatement")}
          </p>
        </motion.div>
      </div>
    </section>
  )
}
