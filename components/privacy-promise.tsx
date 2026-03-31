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
    <section id="privacy-promise" className="py-20 md:py-28 bg-foreground dark:bg-secondary/50" ref={ref}>
      <div className="container mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <span className="inline-block text-sm font-semibold text-orange-400 uppercase tracking-wider mb-3">
            {t("privacySectionTitle")}
          </span>
          <h2 className="text-3xl md:text-5xl font-bold text-background dark:text-foreground mb-4">
            {t("privacyHeading")}
          </h2>
          <p className="text-background/60 dark:text-muted-foreground text-lg max-w-lg mx-auto">
            {t("privacySubtitle")}
          </p>
        </motion.div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 max-w-5xl mx-auto">
          {items.map((item, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 40 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="text-center p-6"
            >
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-orange-500 to-amber-500 flex items-center justify-center mx-auto mb-5 shadow-lg shadow-orange-500/20">
                <item.icon className="w-7 h-7 text-white" />
              </div>
              <h3 className="text-background dark:text-foreground font-semibold text-lg mb-2">{item.title}</h3>
              <p className="text-background/50 dark:text-muted-foreground text-sm leading-relaxed">{item.description}</p>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="mt-16 text-center"
        >
          <p className="text-xl md:text-2xl font-bold bg-gradient-to-r from-orange-400 to-amber-400 bg-clip-text text-transparent max-w-2xl mx-auto">
            {t("privacyStatement")}
          </p>
        </motion.div>
      </div>
    </section>
  )
}
