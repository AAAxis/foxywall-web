"use client"

import { useRef } from "react"
import { motion, useInView } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Check, Sparkles } from "lucide-react"
import { useLanguage } from "@/lib/language-context"

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
    "Unlimited bandwidth",
    "All server locations",
    "No-logs policy",
    "24/7 support",
    "Kill switch",
    "Multi-device",
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
          <span className="inline-block text-sm font-semibold text-primary uppercase tracking-wider mb-3">Pricing</span>
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

              <Button
                className={`w-full rounded-full py-3 font-semibold transition-all hover:scale-[1.02] ${
                  plan.popular
                    ? "bg-gradient-to-r from-orange-500 to-amber-500 text-white hover:shadow-lg hover:shadow-primary/20 border-0"
                    : "bg-secondary text-foreground hover:bg-secondary/80"
                }`}
              >
                {t("start")}
              </Button>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
