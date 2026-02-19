"use client"

import { Button } from "@/components/ui/button"
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

  return (
    <section id="pricing" className="py-16 md:py-24">
      <div className="container mx-auto px-6">
        <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-2 tracking-wide">{t("fairPricing")}</h2>
        <p className="text-muted-foreground mb-12 max-w-lg">{t("pricingDescription")}</p>

        <div className="grid sm:grid-cols-2 gap-6 max-w-2xl">
          {plans.map((plan, index) => (
            <div
              key={index}
              className={`relative bg-secondary/50 backdrop-blur-sm border rounded-xl p-6 ${
                plan.popular ? "border-primary" : "border-border"
              }`}
            >
              {plan.popular && (
                <div className="absolute -top-3 left-4">
                  <span className="bg-primary text-primary-foreground text-xs font-medium px-3 py-1 rounded-full">
                    {t("bestValue")}
                  </span>
                </div>
              )}

              <div className="mb-4">
                <p className="text-sm text-muted-foreground mb-1">{plan.duration}</p>
                <div className="flex items-baseline gap-2">
                  <span className="text-3xl font-bold text-foreground">{plan.price}</span>
                  {plan.savings && <span className="text-xs text-primary">{plan.savings}</span>}
                </div>
                <p className="text-sm text-muted-foreground">{plan.perMonth}</p>
              </div>

              <Button
                className={`w-full rounded-full ${
                  plan.popular
                    ? "bg-primary text-primary-foreground hover:bg-primary/90"
                    : "bg-card text-foreground hover:bg-card/80 border border-border"
                }`}
              >
                {t("getStarted")}
              </Button>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
