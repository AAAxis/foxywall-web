"use client"

import { Button } from "@/components/ui/button"
import { Check } from "lucide-react"
import { useLanguage } from "@/lib/language-context"

export function Pricing() {
  const { t } = useLanguage()

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
    <section id="pricing" className="py-20 md:py-28 bg-secondary/50">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">{t("fairPricing")}</h2>
          <p className="text-muted-foreground text-lg max-w-lg mx-auto">{t("pricingDescription")}</p>
        </div>

        <div className="grid sm:grid-cols-2 gap-6 max-w-2xl mx-auto">
          {plans.map((plan, index) => (
            <div
              key={index}
              className={`relative bg-background border-2 rounded-2xl p-8 ${
                plan.popular ? "border-primary shadow-lg shadow-primary/10" : "border-border"
              }`}
            >
              {plan.popular && (
                <div className="absolute -top-3.5 left-1/2 -translate-x-1/2">
                  <span className="bg-primary text-primary-foreground text-xs font-bold px-4 py-1.5 rounded-full uppercase tracking-wide">
                    {t("bestValue")}
                  </span>
                </div>
              )}

              <div className="mb-6">
                <p className="text-sm font-medium text-muted-foreground mb-2">{plan.duration}</p>
                <div className="flex items-baseline gap-1">
                  <span className="text-4xl font-bold text-foreground">{plan.price}</span>
                </div>
                <p className="text-sm text-muted-foreground mt-1">{plan.perMonth}</p>
                {plan.savings && (
                  <span className="inline-block mt-2 text-xs font-semibold text-primary bg-primary/10 px-2.5 py-1 rounded-full">
                    {plan.savings}
                  </span>
                )}
              </div>

              <ul className="space-y-3 mb-8">
                {perks.map((perk) => (
                  <li key={perk} className="flex items-center gap-2.5 text-sm text-muted-foreground">
                    <Check className="w-4 h-4 text-primary flex-shrink-0" />
                    {perk}
                  </li>
                ))}
              </ul>

              <Button
                className={`w-full rounded-full py-3 font-semibold ${
                  plan.popular
                    ? "bg-primary text-primary-foreground hover:bg-primary/90"
                    : "bg-secondary text-foreground hover:bg-secondary/80"
                }`}
              >
                {t("start")}
              </Button>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
