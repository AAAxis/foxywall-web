"use client"

import { useRef } from "react"
import { motion, useInView } from "framer-motion"
import { Shield, Globe, Zap, Lock, Users, Wifi, Eye, Server } from "lucide-react"
import { useLanguage } from "@/lib/language-context"

export function Features() {
  const { t } = useLanguage()
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: "-100px" })

  const features = [
    { icon: Shield, text: t("feature1"), color: "from-orange-500 to-amber-500" },
    { icon: Users, text: t("feature2"), color: "from-blue-500 to-cyan-500" },
    { icon: Globe, text: t("feature3"), color: "from-purple-500 to-pink-500" },
    { icon: Wifi, text: t("feature4"), color: "from-green-500 to-emerald-500" },
    { icon: Lock, text: t("feature5"), color: "from-red-500 to-orange-500" },
    { icon: Zap, text: t("feature6"), color: "from-yellow-500 to-amber-500" },
    { icon: Eye, text: t("feature7"), color: "from-indigo-500 to-blue-500" },
    { icon: Server, text: t("feature8"), color: "from-teal-500 to-cyan-500" },
  ]

  return (
    <section id="features" className="py-20 md:py-28" ref={ref}>
      <div className="container mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <span className="inline-block text-sm font-semibold text-primary uppercase tracking-wider mb-3">{t("featuresSectionTitle")}</span>
          <h2 className="text-3xl md:text-5xl font-bold text-foreground mb-4">{t("featuresSectionSubtitle")}</h2>
          <p className="text-muted-foreground text-lg max-w-lg mx-auto">{t("featuresSectionDescription")}</p>
        </motion.div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5 max-w-6xl mx-auto">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 40 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: index * 0.08 }}
              whileHover={{ y: -8, transition: { duration: 0.2 } }}
              className="group relative bg-background border border-border rounded-2xl p-6 hover:shadow-xl hover:shadow-primary/5 hover:border-primary/30 transition-all cursor-default overflow-hidden"
            >
              {/* Gradient glow on hover */}
              <div className={`absolute inset-0 bg-gradient-to-br ${feature.color} opacity-0 group-hover:opacity-[0.03] transition-opacity duration-300`} />

              <div className={`relative w-12 h-12 rounded-xl bg-gradient-to-br ${feature.color} flex items-center justify-center mb-4 shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                <feature.icon className="w-6 h-6 text-white" />
              </div>
              <p className="relative text-foreground font-medium leading-relaxed">{feature.text}</p>
            </motion.div>
          ))}
        </div>

        {/* Stats bar */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.8 }}
          className="mt-20 grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto"
        >
          {[
            { value: "5M+", label: t("downloadsLabel") },
            { value: "200+", label: t("serversLabel") },
            { value: "99.9%", label: t("uptimeLabel") },
            { value: "0", label: t("logsStoredLabel") },
          ].map((stat, i) => (
            <motion.div
              key={i}
              whileHover={{ scale: 1.05 }}
              className="text-center p-6 rounded-2xl bg-secondary/50 border border-border"
            >
              <div className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-orange-500 to-amber-500 bg-clip-text text-transparent mb-1">
                {stat.value}
              </div>
              <div className="text-sm text-muted-foreground font-medium">{stat.label}</div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}
