"use client"

import { Shield, Globe, Zap, Lock, Users, Wifi, Eye, Server } from "lucide-react"
import { useLanguage } from "@/lib/language-context"

export function Features() {
  const { t } = useLanguage()

  const features = [
    { icon: Shield, text: t("feature1") },
    { icon: Users, text: t("feature2") },
    { icon: Globe, text: t("feature3") },
    { icon: Wifi, text: t("feature4") },
    { icon: Lock, text: t("feature5") },
    { icon: Zap, text: t("feature6") },
    { icon: Eye, text: t("feature7") },
    { icon: Server, text: t("feature8") },
  ]

  return (
    <section id="features" className="py-20 md:py-28">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            {t("trustedByThousands")}
          </h2>
          <p className="text-muted-foreground text-lg max-w-lg mx-auto">
            Everything you need for secure, private browsing.
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5 max-w-5xl mx-auto">
          {features.map((feature, index) => (
            <div
              key={index}
              className="bg-card border border-border rounded-2xl p-6 hover:shadow-lg hover:border-primary/20 transition-all group"
            >
              <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors">
                <feature.icon className="w-6 h-6 text-primary" />
              </div>
              <p className="text-foreground font-medium leading-relaxed">{feature.text}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
