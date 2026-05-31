import { useEffect, useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import {
  Sparkles,
  ShieldCheck,
  Clock3,
  ChevronDown,
  AlertTriangle,
  Info,
  ShieldAlert,
  Check,
  ExternalLink,
  Bitcoin,
  Building2,
  CircleDollarSign,
  Quote,
  Star,
  Loader2,
  Flame,
  TrendingDown,
} from "lucide-react"
import { cn } from "@/lib/utils"
import {
  type FormData,
  type Route,
  type FraudWarning,
  type RecipientCapability,
  getRoutes,
  getFraudWarnings,
  generateAIExplanation,
  getStepByStepGuide,
} from "@/lib/data"
import { BrandLogo } from "@/components/Visuals"
import logo from "@/assets/kera-logo.png"

interface ResultsProps {
  data: FormData
  onRestart: () => void
}

export function Results({ data, onRestart }: ResultsProps) {
  const [loading, setLoading] = useState(true)

  // Scroll to top whenever the Results view mounts
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "instant" as ScrollBehavior })
  }, [])

  useEffect(() => {
    const t = setTimeout(() => setLoading(false), 1100)
    return () => clearTimeout(t)
  }, [])

  if (loading) {
    return <LoadingScreen amount={data.amount} currency={data.currency} from={data.fromCountry} />
  }

  return <ResultsContent data={data} onRestart={onRestart} />
}

// ============================================
// LOADING SCREEN
// ============================================
function LoadingScreen({
  amount,
  currency,
  from,
}: {
  amount: number
  currency: string
  from: string
}) {
  const steps = [
    "Scanning 24 verified routes…",
    "Comparing fees and timing…",
    "Personalizing for your situation…",
    "Running fraud checks…",
  ]
  const [stepIdx, setStepIdx] = useState(0)
  useEffect(() => {
    const i = setInterval(() => setStepIdx((s) => (s < steps.length - 1 ? s + 1 : s)), 260)
    return () => clearInterval(i)
  }, [])

  return (
    <section className="min-h-screen bg-paper flex items-center justify-center px-6">
      <div className="text-center max-w-md">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-cream-100 border border-cream-300 mb-6">
          <Loader2 className="w-6 h-6 text-clay-600 animate-spin" />
        </div>
        <h3 className="font-serif text-2xl font-medium text-clay-800 mb-2">
          Finding your best route
        </h3>
        <p className="text-sm text-clay-600 mb-1">
          {currency} {amount.toLocaleString()} from {from} to Georgia
        </p>
        <div className="mt-8 h-6">
          <AnimatePresence mode="wait">
            <motion.p
              key={stepIdx}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.25 }}
              className="text-sm text-clay-500 italic"
            >
              {steps[stepIdx]}
            </motion.p>
          </AnimatePresence>
        </div>
      </div>
    </section>
  )
}

// ============================================
// MAIN RESULTS
// ============================================
function ResultsContent({ data, onRestart }: ResultsProps) {
  const routes = getRoutes(data.amount, data.currency)
  const fraudWarnings = getFraudWarnings(data.amount, data.fromCountry, data.currency)
  const recommended = routes[0]
  const worst = routes[routes.length - 1]
  const aiExplanation = generateAIExplanation(data, recommended, worst)
  const guide = getStepByStepGuide(recommended, data.recipientCapability as RecipientCapability)
  const otherRoutes = routes.slice(1)
  const savings = +(worst.fee - recommended.fee).toFixed(2)

  const [expandedRoute, setExpandedRoute] = useState<string | null>(null)
  const [showFraud, setShowFraud] = useState(false)

  return (
    <section className="min-h-screen bg-paper py-12 px-6">
      <div className="max-w-3xl mx-auto">
        {/* Small logo */}
        <div className="flex justify-center mb-6">
          <img src={logo} alt="Kera" className="h-14 w-auto select-none" draggable={false} />
        </div>

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-10"
        >
          <p className="text-xs font-semibold uppercase tracking-widest text-stone-400 mb-3">
            Your routes are ready
          </p>
          <h2 className="font-serif text-4xl sm:text-5xl font-medium text-clay-800 mb-3">
            <span className="italic text-clay-600">{data.currency} {data.amount.toLocaleString()}</span>{" "}
            from {data.fromCountry}
          </h2>
          <p className="text-clay-600">
            Ranked by total cost. Recommendation tailored to your situation.
          </p>
        </motion.div>

        {/* Trust report */}
        <TrustReport warnings={fraudWarnings} open={showFraud} onToggle={() => setShowFraud(!showFraud)} />

        {/* FEATURED RECOMMENDED CARD — bigger, more prominent */}
        <FeaturedRouteCard
          route={recommended}
          currency={data.currency}
          savings={savings}
          expanded={expandedRoute === recommended.id}
          onToggle={() =>
            setExpandedRoute(expandedRoute === recommended.id ? null : recommended.id)
          }
        />

        {/* Step-by-step guide — always shown right after the featured card */}
        <StepGuide
          steps={guide}
          routeName={recommended.name}
          websiteUrl={recommended.websiteUrl}
        />

        {/* AI Explanation */}
        <div className="mt-8">
          <AIExplanation paragraphs={aiExplanation} />
        </div>

        {/* Other routes (smaller, secondary) */}
        <div className="mt-12">
          <p className="text-xs font-semibold uppercase tracking-widest text-stone-400 mb-3 px-1">
            Other options for comparison
          </p>
          <div className="space-y-2.5">
            {otherRoutes.map((route, i) => (
              <SecondaryRouteCard
                key={route.id}
                route={route}
                currency={data.currency}
                worstFee={worst.fee}
                expanded={expandedRoute === route.id}
                onToggle={() =>
                  setExpandedRoute(expandedRoute === route.id ? null : route.id)
                }
                delay={0.05 + i * 0.05}
              />
            ))}
          </div>
        </div>

        {/* Community */}
        <Community />

        {/* Restart */}
        <div className="text-center mt-12">
          <button
            onClick={onRestart}
            className="text-clay-600 hover:text-clay-800 font-medium text-sm transition cursor-pointer underline underline-offset-4 decoration-cream-300 hover:decoration-clay-500"
          >
            Start a new comparison
          </button>
        </div>
      </div>
    </section>
  )
}

// ============================================
// TRUST REPORT
// ============================================
function TrustReport({
  warnings,
  open,
  onToggle,
}: {
  warnings: FraudWarning[]
  open: boolean
  onToggle: () => void
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.1 }}
      className="bg-white rounded-2xl shadow-warm border border-cream-200 mb-6"
    >
      <button
        onClick={onToggle}
        className="w-full flex items-center justify-between p-4 sm:p-5 cursor-pointer"
      >
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-full bg-leaf-500/12 flex items-center justify-center">
            <ShieldCheck className="w-4 h-4 text-leaf-500" />
          </div>
          <div className="text-left">
            <p className="font-semibold text-clay-800 text-sm">Trust report — verified by Kera</p>
            <p className="text-xs text-clay-600">{warnings.length} checks passed · Tap for details</p>
          </div>
        </div>
        <ChevronDown
          className={cn("w-4 h-4 text-clay-500 transition-transform", open && "rotate-180")}
        />
      </button>
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="overflow-hidden"
          >
            <div className="px-5 pb-5 space-y-2 border-t border-cream-200 pt-4">
              {warnings.map((w, i) => (
                <FraudRow key={i} warning={w} />
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}

function FraudRow({ warning }: { warning: FraudWarning }) {
  const cfg = {
    info: { Icon: Info, color: "text-clay-500", bg: "bg-cream-100" },
    warning: { Icon: AlertTriangle, color: "text-amber-deep", bg: "bg-sand-300/30" },
    danger: { Icon: ShieldAlert, color: "text-rust", bg: "bg-rust/8" },
  }[warning.level]
  const Icon = cfg.Icon
  return (
    <div className={cn("flex items-start gap-3 p-3 rounded-lg", cfg.bg)}>
      <div className={cn("flex-shrink-0 mt-0.5", cfg.color)}>
        <Icon className="w-4 h-4" />
      </div>
      <div className="text-sm">
        <p className="font-semibold text-clay-800">{warning.title}</p>
        <p className="text-clay-600 mt-0.5">{warning.message}</p>
      </div>
    </div>
  )
}

// ============================================
// FEATURED ROUTE CARD (CityPay — premium prominence)
// ============================================
function FeaturedRouteCard({
  route,
  currency,
  savings,
  expanded,
  onToggle,
}: {
  route: Route
  currency: string
  savings: number
  expanded: boolean
  onToggle: () => void
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="relative bg-white rounded-3xl border-2 border-clay-500 shadow-warm-lg overflow-hidden"
    >
      {/* Top ribbon — stacks vertically on mobile */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1 sm:gap-3 px-5 sm:px-6 py-2.5 bg-clay-600 text-cream-50">
        <div className="inline-flex items-center gap-1.5 text-[10px] sm:text-[11px] uppercase tracking-widest font-bold">
          <Flame className="w-3 h-3" />
          Recommended by Kera
        </div>
        <div className="inline-flex items-center gap-1.5 text-[10px] sm:text-[11px] font-semibold">
          <TrendingDown className="w-3 h-3" />
          Save {currency} {savings} vs bank wire
        </div>
      </div>

      <div className="p-5 sm:p-8">
        {/* Brand + title row (no trust badge here) */}
        <div className="flex items-center gap-3 sm:gap-4 mb-5">
          <BrandLogo
            domain={route.logoDomain}
            fallback={<Bitcoin className="w-7 h-7 text-clay-600" />}
            size={56}
            className="border border-cream-200 shadow-warm-sm p-1.5 flex-shrink-0"
          />
          <div className="flex-1 min-w-0">
            <h3 className="font-serif text-xl sm:text-2xl font-medium text-clay-800 leading-tight mb-1">
              {route.name}
            </h3>
            <div className="flex flex-wrap items-center gap-x-3 gap-y-0.5 text-sm text-clay-600">
              <span className="inline-flex items-center gap-1.5">
                <Clock3 className="w-3.5 h-3.5" /> {route.speed}
              </span>
              <span className="inline-flex items-center gap-1.5">
                <Star className="w-3.5 h-3.5 fill-clay-500 text-clay-500" />
                {route.rating}.0
              </span>
            </div>
          </div>
        </div>

        {/* Trust badge — horizontal, full-width prominent strip */}
        <div className="mb-5">
          <TrustBadgeHorizontal score={route.trustScore} />
        </div>

        {/* Price + received - smaller numbers on mobile so they don't wrap */}
        <div className="grid grid-cols-2 gap-3 sm:gap-4 mb-6">
          <div className="p-3.5 sm:p-4 rounded-xl bg-cream-100 border border-cream-300">
            <p className="text-[10px] sm:text-[11px] uppercase tracking-widest text-stone-400 font-semibold mb-1">
              Total fee
            </p>
            <p className="font-serif text-xl sm:text-3xl font-medium text-clay-800 leading-tight">
              {currency} {route.fee}
            </p>
            <p className="text-[11px] sm:text-xs text-clay-600 mt-0.5">{route.feePct}% of transfer</p>
          </div>
          <div className="p-3.5 sm:p-4 rounded-xl bg-leaf-500/8 border border-leaf-500/20">
            <p className="text-[10px] sm:text-[11px] uppercase tracking-widest text-leaf-500 font-semibold mb-1">
              Recipient gets
            </p>
            <p className="font-serif text-xl sm:text-3xl font-medium text-clay-800 leading-tight">
              {currency} {route.received.toLocaleString()}
            </p>
            <p className="text-[11px] sm:text-xs text-leaf-500 font-semibold mt-0.5">Most of any route</p>
          </div>
        </div>

        {/* Badge pill */}
        {route.badge && (
          <div className="inline-flex items-center text-xs font-semibold text-clay-700 bg-sand-300/40 px-3 py-1 rounded-full mb-5">
            {route.badge}
          </div>
        )}

        {/* Pros (always visible on featured card) */}
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-wider text-leaf-500 mb-2">
            Why this wins
          </p>
          <ul className="space-y-1.5 text-sm text-clay-700">
            {route.pros.slice(0, 3).map((p, i) => (
              <li key={i} className="flex items-start gap-2">
                <Check className="w-4 h-4 text-leaf-500 flex-shrink-0 mt-0.5" strokeWidth={2.5} />
                <span>{p}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Expand for tradeoffs */}
        <AnimatePresence>
          {expanded && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="overflow-hidden"
            >
              <div className="mt-5 pt-5 border-t border-cream-200">
                <p className="text-[11px] font-semibold uppercase tracking-wider text-amber-deep mb-2">
                  Tradeoffs to know
                </p>
                <ul className="space-y-1.5 text-sm text-clay-700">
                  {route.cons.map((c, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <span className="text-clay-400 flex-shrink-0 leading-5">—</span>
                      <span>{c}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <button
          onClick={onToggle}
          className="mt-4 text-xs text-clay-500 hover:text-clay-700 font-medium inline-flex items-center gap-1 cursor-pointer"
        >
          <ChevronDown className={cn("w-3.5 h-3.5 transition-transform", expanded && "rotate-180")} />
          {expanded ? "Hide tradeoffs" : "Show tradeoffs"}
        </button>

        {/* Primary CTA — go to CityPay */}
        <a
          href={route.websiteUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-6 w-full inline-flex items-center justify-center gap-2 px-6 py-4 bg-clay-600 hover:bg-clay-700 text-cream-50 font-semibold rounded-xl shadow-warm-md hover:shadow-warm-lg transition-all hover:-translate-y-0.5 cursor-pointer"
        >
          Continue with {route.provider}
          <ExternalLink className="w-4 h-4" />
        </a>
      </div>
    </motion.div>
  )
}

// ============================================
// SECONDARY ROUTE CARD (smaller, comparison-only)
// ============================================
function SecondaryRouteCard({
  route,
  currency,
  worstFee,
  expanded,
  onToggle,
  delay,
}: {
  route: Route
  currency: string
  worstFee: number
  expanded: boolean
  onToggle: () => void
  delay: number
}) {
  const FallbackIcon =
    route.type === "fintech" ? CircleDollarSign : Building2

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, delay }}
      className="bg-white rounded-2xl border border-cream-200 shadow-warm-sm hover:shadow-warm transition-all overflow-hidden"
    >
      <button onClick={onToggle} className="w-full text-left p-4 sm:p-5 cursor-pointer">
        <div className="flex items-center gap-4">
          <BrandLogo
            domain={route.logoDomain}
            fallback={<FallbackIcon className="w-6 h-6 text-clay-600" />}
            size={44}
            className="border border-cream-200 p-1.5"
          />

          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-clay-800 text-sm mb-1 truncate">{route.name}</h3>
            <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-clay-600">
              <span className="inline-flex items-center gap-1">
                <Clock3 className="w-3 h-3" /> {route.speed}
              </span>
              <TrustBadgeSmall score={route.trustScore} />
            </div>
          </div>

          <div className="text-right flex-shrink-0">
            <p className="text-[10px] uppercase tracking-wider text-stone-400 font-semibold">Fee</p>
            <p className="font-serif text-lg font-medium text-clay-800">
              {currency} {route.fee}
            </p>
            {route.fee === worstFee ? (
              <p className="text-[10px] text-rust font-semibold mt-0.5">Highest fee</p>
            ) : (
              <p className="text-[10px] text-stone-400 mt-0.5">{route.feePct}%</p>
            )}
          </div>
        </div>
      </button>

      <AnimatePresence>
        {expanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="overflow-hidden"
          >
            <div className="px-5 pb-5 pt-3 grid grid-cols-1 sm:grid-cols-2 gap-4 bg-cream-50/60 border-t border-cream-200">
              <div>
                <p className="text-[11px] font-semibold uppercase tracking-wider text-leaf-500 mb-2">Pros</p>
                <ul className="space-y-1 text-xs text-clay-700">
                  {route.pros.map((p, i) => (
                    <li key={i} className="flex items-start gap-1.5">
                      <Check className="w-3 h-3 text-leaf-500 flex-shrink-0 mt-0.5" strokeWidth={2.5} />
                      <span>{p}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <div>
                <p className="text-[11px] font-semibold uppercase tracking-wider text-amber-deep mb-2">Cons</p>
                <ul className="space-y-1 text-xs text-clay-700">
                  {route.cons.map((c, i) => (
                    <li key={i} className="flex items-start gap-1.5">
                      <span className="text-clay-400 flex-shrink-0 leading-4">—</span>
                      <span>{c}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}

// ============================================
// TRUST BADGES
// ============================================
function TrustBadgeHorizontal({ score }: { score: number }) {
  const cfg =
    score >= 9
      ? { color: "text-leaf-500", bg: "bg-leaf-500/12", border: "border-leaf-500/30", label: "Highly trusted" }
      : score >= 8
      ? { color: "text-clay-600", bg: "bg-cream-200", border: "border-cream-300", label: "Trusted" }
      : { color: "text-amber-deep", bg: "bg-sand-300/40", border: "border-sand-400/40", label: "Verified" }

  return (
    <div
      className={cn(
        "flex items-center justify-between gap-3 px-4 py-3 rounded-xl border",
        cfg.bg,
        cfg.border
      )}
    >
      <div className="flex items-center gap-3">
        <ShieldCheck className={cn("w-5 h-5 flex-shrink-0", cfg.color)} />
        <div>
          <p className={cn("text-[10px] uppercase tracking-widest font-bold leading-none", cfg.color)}>
            Trust score
          </p>
          <p className="text-[11px] text-clay-600 mt-1 leading-none">{cfg.label}</p>
        </div>
      </div>
      <p className={cn("font-serif text-2xl font-semibold leading-none", cfg.color)}>
        {score}
        <span className="text-sm font-normal text-clay-500 ml-0.5">/10</span>
      </p>
    </div>
  )
}

function TrustBadgeSmall({ score }: { score: number }) {
  const cfg =
    score >= 9
      ? { color: "text-leaf-500", bg: "bg-leaf-500/12" }
      : score >= 8
      ? { color: "text-clay-600", bg: "bg-cream-200" }
      : { color: "text-amber-deep", bg: "bg-sand-300/40" }

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 px-2 py-0.5 rounded-full font-semibold text-[11px]",
        cfg.color,
        cfg.bg
      )}
    >
      <ShieldCheck className="w-3 h-3" />
      Trust {score}
    </span>
  )
}

// ============================================
// AI EXPLANATION
// ============================================
function AIExplanation({ paragraphs }: { paragraphs: string[] }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3 }}
      className="bg-gradient-to-br from-cream-100 to-cream-50 rounded-2xl border border-cream-300 shadow-warm p-6 sm:p-8"
    >
      <div className="flex items-center gap-3 mb-5">
        <div className="w-11 h-11 rounded-xl bg-clay-600 flex items-center justify-center shadow-warm-sm">
          <Sparkles className="w-5 h-5 text-cream-50" />
        </div>
        <div>
          <h3 className="font-serif text-xl font-medium text-clay-800">
            Why this is best for <span className="italic">you</span>
          </h3>
          <p className="text-xs text-clay-600">Personalized to your inputs</p>
        </div>
      </div>
      <div className="space-y-3 text-clay-800 leading-relaxed">
        {paragraphs.map((p, i) => (
          <motion.p
            key={i}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 + i * 0.12 }}
            className="text-[15px]"
          >
            {p}
          </motion.p>
        ))}
      </div>
    </motion.div>
  )
}

// ============================================
// STEP GUIDE
// ============================================
function StepGuide({
  steps,
  routeName,
  websiteUrl,
}: {
  steps: ReturnType<typeof getStepByStepGuide>
  routeName: string
  websiteUrl: string
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.15 }}
      className="mt-6"
    >
      <div className="bg-white rounded-2xl shadow-warm border border-cream-200 p-6 sm:p-8">
        <div className="flex items-center gap-2 mb-1">
          <span className="text-[10px] font-bold uppercase tracking-widest text-clay-500 bg-cream-200 px-2 py-1 rounded-full">
            Next step
          </span>
        </div>
        <h3 className="font-serif text-2xl font-medium text-clay-800 mb-1 mt-3">
          How to send via {routeName}
        </h3>
        <p className="text-sm text-clay-600 mb-6">Step by step. First time setup takes ~15 minutes.</p>

        <div className="space-y-4">
          {steps.map((step, i) => (
            <motion.div
              key={step.num}
              initial={{ opacity: 0, x: -8 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.07 }}
              className="flex gap-4 items-start"
            >
              <div className="flex-shrink-0 w-9 h-9 rounded-xl bg-clay-600 text-cream-50 flex items-center justify-center font-semibold text-sm">
                {step.num}
              </div>
              <div className="flex-1">
                <div className="flex items-center justify-between gap-2 mb-1">
                  <h4 className="font-semibold text-clay-800">{step.title}</h4>
                  <span className="text-[11px] text-clay-600 bg-cream-100 border border-cream-300 px-2 py-0.5 rounded-full font-medium whitespace-nowrap">
                    {step.time}
                  </span>
                </div>
                <p className="text-sm text-clay-600 leading-relaxed">{step.detail}</p>
              </div>
            </motion.div>
          ))}
        </div>

        <div className="mt-7 pt-5 border-t border-cream-200 flex flex-wrap items-center gap-3">
          <a
            href={websiteUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-clay-600 hover:bg-clay-700 text-cream-50 text-sm font-semibold rounded-lg shadow-warm-sm transition cursor-pointer"
          >
            Continue with this route
            <ExternalLink className="w-4 h-4" />
          </a>
          <p className="text-xs text-clay-500">
            You'll be redirected to the provider — no fees from Kera
          </p>
        </div>
      </div>
    </motion.div>
  )
}

// ============================================
// COMMUNITY
// ============================================
function Community() {
  const reviews = [
    {
      text: "Used USDT via CityPay for 14 months. Reliable and cheap. Mom set up the wallet easily.",
      name: "Maria",
      location: "Berlin",
    },
    {
      text: "Set up for my mom in 10 minutes. So much cheaper than the bank wire.",
      name: "Giorgi",
      location: "Madrid",
    },
    {
      text: "Saved hundreds compared to my old bank. Wish I'd known this years ago.",
      name: "Nino",
      location: "Warsaw",
    },
  ]
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.6 }}
      className="mt-12 grid sm:grid-cols-3 gap-3"
    >
      {reviews.map((r, i) => (
        <div
          key={i}
          className="p-5 rounded-2xl bg-white border border-cream-200 shadow-warm-sm relative"
        >
          <Quote className="absolute top-4 right-4 w-4 h-4 text-cream-300" />
          <p className="text-sm text-clay-700 leading-relaxed mb-3 pr-5">"{r.text}"</p>
          <p className="text-xs font-semibold text-clay-600">
            {r.name}, {r.location}
          </p>
        </div>
      ))}
    </motion.div>
  )
}
