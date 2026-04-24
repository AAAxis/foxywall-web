"use client"

import { useEffect, useRef, useState } from "react"
import { motion, useInView } from "framer-motion"
import { Check, Download } from "lucide-react"
import { useLanguage } from "@/lib/language-context"
import { getStoreUrl } from "@/lib/device-utils"

const DEFAULT_STORE_URL = "https://apps.apple.com/app/id6757646633"

export function Pricing() {
  const { t } = useLanguage()
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: "-100px" })
  const [storeUrl, setStoreUrl] = useState(DEFAULT_STORE_URL)

  useEffect(() => {
    setStoreUrl(getStoreUrl())
  }, [])

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
    <section id="pricing" className="py-20 md:py-28" ref={ref}>
      <div className="container mx-auto px-6">
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
              className={`relative bg-card border rounded-2xl p-8 transition-colors ${
                plan.popular ? "border-primary" : "border-border hover:border-foreground/20"
              }`}
            >
              {plan.popular && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                  <span className="inline-block bg-primary text-primary-foreground text-[10px] font-semibold px-3 py-1 rounded-full uppercase tracking-widest">
                    {t("bestValue")}
                  </span>
                </div>
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

              <a
                href={storeUrl}
                target="_blank"
                rel="noopener noreferrer"
                className={`w-full inline-flex items-center justify-center gap-2 rounded-full py-3 font-semibold transition-colors ${
                  plan.popular
                    ? "bg-primary text-primary-foreground hover:bg-primary/90"
                    : "bg-foreground text-background hover:bg-foreground/90"
                }`}
              >
                <Download className="w-5 h-5" />
                {t("download")}
              </a>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
