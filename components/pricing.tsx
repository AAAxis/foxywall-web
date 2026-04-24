"use client"

import { useRef } from "react"
import { motion, useInView } from "framer-motion"
import { Check, Sparkles } from "lucide-react"
import { useLanguage } from "@/lib/language-context"

const APP_STORE_URL = "https://apps.apple.com/app/id6757646633"
const GOOGLE_PLAY_URL = "https://play.google.com/store/apps/details?id=com.theholylabs.rock"

export function Pricing() {
  const { t } = useLanguage()
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: "-100px" })

  const plans = [
    {
      duration: t("oneMonth"),
      price: "$4.99",
      perMonth: "$4.99/mo",
      popular: false,
    },
    {
      duration: t("oneYear"),
      price: "$39.99",
      perMonth: "$3.33/mo",
      popular: true,
      savings: t("save33"),
    },
  ]

  const perks = [
    t("perkUnlimitedBandwidth"),
    t("perkAllServerLocations"),
    t("perkNoLogsPolicy"),
    t("perk24_7Support"),
    t("perkKillSwitch"),
    t("perkMultiDevice"),
  ]

  return (
    <section id="pricing" className="py-20 md:py-28 relative overflow-hidden" ref={ref}>
      {/* Background decoration */}
      <div className="absolute inset-0 bg-gradient-to-b from-secondary/30 via-secondary/50 to-secondary/30" />

      <div className="container mx-auto px-6 relative">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <span className="inline-block text-sm font-semibold text-primary uppercase tracking-wider mb-3">{t("pricingSectionTitle")}</span>
          <h2 className="text-3xl md:text-5xl font-bold text-foreground mb-4">{t("fairPricing")}</h2>
          <p className="text-muted-foreground text-lg max-w-lg mx-auto">{t("pricingDescription")}</p>
        </motion.div>

        <div className="grid sm:grid-cols-2 gap-8 max-w-2xl mx-auto">
          {plans.map((plan, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 40 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: index * 0.15 }}
              whileHover={{ y: -6, transition: { duration: 0.2 } }}
              className={`relative bg-background border-2 rounded-3xl p-8 transition-shadow ${
                plan.popular
                  ? "border-primary shadow-xl shadow-primary/10"
                  : "border-border hover:shadow-lg hover:border-border"
              }`}
            >
              {plan.popular && (
                <motion.div
                  initial={{ scale: 0 }}
                  animate={isInView ? { scale: 1 } : {}}
                  transition={{ duration: 0.4, delay: 0.5, type: "spring" }}
                  className="absolute -top-4 left-1/2 -translate-x-1/2"
                >
                  <span className="inline-flex items-center gap-1.5 bg-gradient-to-r from-orange-500 to-amber-500 text-white text-xs font-bold px-4 py-2 rounded-full uppercase tracking-wide shadow-lg">
                    <Sparkles className="w-3.5 h-3.5" />
                    {t("bestValue")}
                  </span>
                </motion.div>
              )}

              <div className="mb-8">
                <p className="text-sm font-medium text-muted-foreground mb-3">{plan.duration}</p>
                <div className="flex items-baseline gap-1">
                  <span className="text-5xl font-bold text-foreground">{plan.price}</span>
                </div>
                <p className="text-sm text-muted-foreground mt-2">{plan.perMonth}</p>
                {plan.savings && (
                  <motion.span
                    initial={{ opacity: 0, x: -10 }}
                    animate={isInView ? { opacity: 1, x: 0 } : {}}
                    transition={{ delay: 0.6 }}
                    className="inline-block mt-3 text-xs font-semibold text-primary bg-primary/10 px-3 py-1.5 rounded-full"
                  >
                    {plan.savings}
                  </motion.span>
                )}
              </div>

              <ul className="space-y-3.5 mb-8">
                {perks.map((perk, i) => (
                  <motion.li
                    key={perk}
                    initial={{ opacity: 0, x: -10 }}
                    animate={isInView ? { opacity: 1, x: 0 } : {}}
                    transition={{ delay: 0.3 + i * 0.05 }}
                    className="flex items-center gap-3 text-sm text-muted-foreground"
                  >
                    <div className="w-5 h-5 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                      <Check className="w-3 h-3 text-primary" />
                    </div>
                    {perk}
                  </motion.li>
                ))}
              </ul>

              <div className="flex flex-col sm:flex-row gap-3">
                <a
                  href={APP_STORE_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 inline-flex items-center justify-center gap-2 bg-foreground text-background px-4 py-3 rounded-full font-semibold hover:opacity-90 transition-all hover:scale-[1.02]"
                >
                  <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor"><path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.8-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z"/></svg>
                  {t("appStore")}
                </a>
                <a
                  href={GOOGLE_PLAY_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 inline-flex items-center justify-center gap-2 bg-foreground text-background px-4 py-3 rounded-full font-semibold hover:opacity-90 transition-all hover:scale-[1.02]"
                >
                  <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor"><path d="M3,20.5V3.5C3,2.91 3.34,2.39 3.84,2.15L13.69,12L3.84,21.85C3.34,21.61 3,21.09 3,20.5M16.81,15.12L6.05,21.34L14.54,12.85L16.81,15.12M20.16,10.81C20.5,11.08 20.75,11.5 20.75,12C20.75,12.5 20.53,12.9 20.18,13.18L17.89,14.5L15.39,12L17.89,9.5L20.16,10.81M6.05,2.66L16.81,8.88L14.54,11.15L6.05,2.66Z"/></svg>
                  {t("googlePlay")}
                </a>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
