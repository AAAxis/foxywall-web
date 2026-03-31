"use client"

import { useRef } from "react"
import { motion, useInView } from "framer-motion"
import { ShieldAlert, Plane, Eye, Code } from "lucide-react"
import { useLanguage } from "@/lib/language-context"

export function WhoUses() {
  const { t } = useLanguage()
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: "-100px" })

  const personas = [
    { icon: ShieldAlert, title: t("whoUsesPersona1Title"), description: t("whoUsesPersona1Desc"), color: "from-orange-500 to-amber-500" },
    { icon: Plane, title: t("whoUsesPersona2Title"), description: t("whoUsesPersona2Desc"), color: "from-blue-500 to-cyan-500" },
    { icon: Eye, title: t("whoUsesPersona3Title"), description: t("whoUsesPersona3Desc"), color: "from-purple-500 to-pink-500" },
    { icon: Code, title: t("whoUsesPersona4Title"), description: t("whoUsesPersona4Desc"), color: "from-green-500 to-emerald-500" },
  ]

  return (
    <section id="who-uses" className="py-20 md:py-28" ref={ref}>
      <div className="container mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <span className="inline-block text-sm font-semibold text-primary uppercase tracking-wider mb-3">
            {t("whoUsesSectionTitle")}
          </span>
          <h2 className="text-3xl md:text-5xl font-bold text-foreground mb-4">
            {t("whoUsesHeading")}
          </h2>
          <p className="text-muted-foreground text-lg max-w-lg mx-auto">
            {t("whoUsesSubtitle")}
          </p>
        </motion.div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
          {personas.map((persona, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 40 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              whileHover={{ y: -8, transition: { duration: 0.2 } }}
              className="group relative bg-background border border-border rounded-2xl p-6 hover:shadow-xl hover:shadow-primary/5 hover:border-primary/30 transition-all cursor-default overflow-hidden"
            >
              <div className={`absolute inset-0 bg-gradient-to-br ${persona.color} opacity-0 group-hover:opacity-[0.03] transition-opacity duration-300`} />

              <div className={`relative w-14 h-14 rounded-xl bg-gradient-to-br ${persona.color} flex items-center justify-center mb-5 shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                <persona.icon className="w-7 h-7 text-white" />
              </div>
              <h3 className="relative text-foreground font-semibold text-lg mb-2">{persona.title}</h3>
              <p className="relative text-muted-foreground text-sm leading-relaxed">{persona.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
