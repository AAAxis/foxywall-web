"use client"

import { motion } from "framer-motion"
import { Gift, ArrowRight } from "lucide-react"
import Link from "next/link"
import { useLanguage } from "@/lib/language-context"

export function PromoBanner() {
  const { language } = useLanguage()

  const text = language === "ru"
    ? { badge: "🎉 Акция", title: "Скидка 30% на веб-подписку", desc: "Оформите подписку на сайте и получите скидку 30%!", cta: "Получить скидку" }
    : { badge: "🎉 Limited Offer", title: "30% OFF Web Subscription", desc: "Subscribe on our website and save 30% on your VPN plan!", cta: "Get 30% Off" }

  return (
    <section className="py-6 px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
        className="container mx-auto max-w-4xl"
      >
        <Link href="#pricing">
          <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-orange-500 via-amber-500 to-yellow-500 p-[2px] cursor-pointer group">
            <div className="relative rounded-2xl bg-gradient-to-r from-orange-500/90 via-amber-500/90 to-yellow-500/90 px-6 py-5 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center flex-shrink-0">
                  <Gift className="w-6 h-6 text-white" />
                </div>
                <div>
                  <span className="inline-block text-xs font-bold text-white/90 bg-white/20 rounded-full px-3 py-0.5 mb-1">{text.badge}</span>
                  <h3 className="text-xl font-bold text-white">{text.title}</h3>
                  <p className="text-white/80 text-sm">{text.desc}</p>
                </div>
              </div>
              <div className="flex items-center gap-2 bg-white text-orange-600 font-bold px-6 py-3 rounded-xl group-hover:bg-orange-50 transition-colors flex-shrink-0">
                {text.cta}
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </div>
            </div>
          </div>
        </Link>
      </motion.div>
    </section>
  )
}
