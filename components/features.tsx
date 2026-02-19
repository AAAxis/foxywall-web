"use client"

import { useLanguage } from "@/lib/language-context"

export function Features() {
  const { t } = useLanguage()

  const features = [
    t("feature1"),
    t("feature2"),
    t("feature3"),
    t("feature4"),
    t("feature5"),
    t("feature6"),
    t("feature7"),
    t("feature8"),
  ]

  return (
    <section id="features" className="py-16 md:py-24 relative">
      <div className="container mx-auto px-6">
        <div className="grid lg:grid-cols-2 gap-12 items-start">
          <div className="relative hidden lg:block">
            <div className="aspect-square max-w-md mx-auto relative">
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-64 h-64 rounded-full border border-border/50" />
                <div className="absolute w-48 h-48 rounded-full border border-border/30" />
                <div className="absolute w-32 h-32 rounded-full border border-primary/30" />
                <div className="absolute w-16 h-16 rounded-full bg-primary/20" />
              </div>
            </div>
          </div>

          <div className="relative">
            <div className="hidden xl:block absolute -right-20 top-1/2 -translate-y-1/2">
              <p className="text-muted-foreground/50 text-sm tracking-[0.3em] rotate-90 whitespace-nowrap origin-center">
                {t("trustedByThousands")}
              </p>
            </div>

            <div className="space-y-3">
              {features.map((feature, index) => (
                <div
                  key={index}
                  className="bg-secondary/50 backdrop-blur-sm border-l-2 border-primary/50 pl-4 pr-6 py-4 rounded-r-lg hover:bg-secondary/80 transition-colors"
                >
                  <p className="text-foreground">{feature}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
