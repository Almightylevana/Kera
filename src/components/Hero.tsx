import { motion } from "framer-motion"
import { ArrowRight, ShieldCheck, Sparkles, Clock3 } from "lucide-react"
import logo from "@/assets/kera-logo.png"

interface HeroProps {
  onStart: () => void
}

export function Hero({ onStart }: HeroProps) {
  return (
    <section className="relative min-h-screen flex items-center justify-center px-6 py-20 bg-paper overflow-hidden">
      {/* Soft warm radial accents */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/3 -left-32 w-[28rem] h-[28rem] rounded-full bg-sand-400/15 blur-3xl" />
        <div className="absolute bottom-0 -right-32 w-[28rem] h-[28rem] rounded-full bg-clay-400/10 blur-3xl" />
      </div>

      <div className="relative max-w-4xl mx-auto text-center">
        {/* Logo */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="flex justify-center mb-2"
        >
          <img
            src={logo}
            alt="Kera"
            className="h-44 sm:h-56 w-auto select-none pointer-events-none"
            draggable={false}
          />
        </motion.div>

        {/* Eyebrow */}
        <motion.div
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="inline-flex items-center gap-2 px-4 py-1.5 mb-8 rounded-full bg-cream-200 border border-cream-300 text-clay-700"
        >
          <Sparkles className="w-3.5 h-3.5 text-clay-500" />
          <span className="text-xs sm:text-sm font-medium tracking-wide">
            AI routing for the Georgian diaspora
          </span>
        </motion.div>

        {/* Headline */}
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.15 }}
          className="font-serif text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-medium text-clay-800 mb-6 leading-[1.1] tracking-tight"
        >
          Where every transfer finds its way home.
        </motion.h1>

        {/* Subtext */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.25 }}
          className="text-base sm:text-lg text-clay-600 max-w-xl mx-auto mb-10 leading-relaxed"
        >
          Every route, compared. Personalized by AI. Trust signals included.
          Save up to <span className="font-semibold text-clay-700">5% on every transfer home</span>.
        </motion.p>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.35 }}
          className="flex flex-col items-center gap-4"
        >
          <button
            onClick={onStart}
            className="group inline-flex items-center gap-3 px-9 py-4 bg-clay-600 hover:bg-clay-700 text-cream-50 font-semibold rounded-2xl text-base shadow-warm-lg hover:shadow-warm-xl transition-all hover:-translate-y-0.5 cursor-pointer"
          >
            Start your transfer
            <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5" />
          </button>
          <p className="text-xs text-stone-400 inline-flex items-center gap-2">
            <Clock3 className="w-3 h-3" />
            Takes 30 seconds — no signup
          </p>
        </motion.div>

        {/* Trust strip */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.5 }}
          className="mt-20 flex flex-wrap items-center justify-center gap-x-8 gap-y-3 text-xs text-clay-600"
        >
          <TrustItem icon={<ShieldCheck className="w-3.5 h-3.5" />} label="Verified routes only" />
          <Divider />
          <TrustItem icon={<Sparkles className="w-3.5 h-3.5" />} label="AI personalized" />
          <Divider />
          <TrustItem icon={<Clock3 className="w-3.5 h-3.5" />} label="Live rates" />
        </motion.div>
      </div>
    </section>
  )
}

function TrustItem({ icon, label }: { icon: React.ReactNode; label: string }) {
  return (
    <div className="inline-flex items-center gap-1.5">
      <span className="text-clay-500">{icon}</span>
      <span className="font-medium">{label}</span>
    </div>
  )
}

function Divider() {
  return <div className="w-1 h-1 rounded-full bg-stone-300" />
}
