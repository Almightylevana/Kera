import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import {
  ArrowLeft,
  ArrowRight,
  Check,
  ChevronDown,
  Coins,
  MapPin,
  Home,
  Clock,
  Users,
} from "lucide-react"
import { cn } from "@/lib/utils"
import { type FormData, fromCountries, emptyFormData } from "@/lib/data"
import { CountryFlag } from "@/components/Visuals"
import logo from "@/assets/kera-logo.png"

interface WizardProps {
  onComplete: (data: FormData) => void
}

const STEP_COUNT = 5

const STEP_META = [
  { icon: Coins, label: "Amount" },
  { icon: MapPin, label: "From" },
  { icon: Home, label: "To" },
  { icon: Clock, label: "Speed" },
  { icon: Users, label: "Recipient" },
]

export function Wizard({ onComplete }: WizardProps) {
  const [step, setStep] = useState(0)
  const [data, setData] = useState<FormData>(emptyFormData)

  const update = <K extends keyof FormData>(key: K, value: FormData[K]) => {
    setData((d) => ({ ...d, [key]: value }))
  }

  const canProceed = (): boolean => {
    switch (step) {
      case 0:
        return data.amount > 0
      case 1:
        return !!data.fromCountry
      case 2:
        return true
      case 3:
        return !!data.urgency
      case 4:
        return !!data.recipientCapability
      default:
        return false
    }
  }

  const next = () => {
    if (!canProceed()) return
    if (step === STEP_COUNT - 1) {
      onComplete(data)
    } else {
      setStep(step + 1)
    }
  }

  const back = () => setStep(Math.max(0, step - 1))
  const progress = ((step + 1) / STEP_COUNT) * 100
  const StepIcon = STEP_META[step].icon

  return (
    <section className="min-h-screen bg-paper py-12 px-6 flex flex-col items-center justify-center">
      {/* Small logo at top */}
      <div className="mb-8">
        <img src={logo} alt="Kera" className="h-28 sm:h-32 w-auto select-none" draggable={false} />
      </div>

      <div className="max-w-2xl w-full bg-white rounded-3xl shadow-warm-md border border-cream-200 p-6 sm:p-10">
        {/* Header: step icon + meta */}
        <div className="flex items-center gap-4 mb-8">
          <div className="w-12 h-12 rounded-2xl bg-cream-100 border border-cream-300 flex items-center justify-center">
            <StepIcon className="w-5 h-5 text-clay-600" />
          </div>
          <div className="flex-1">
            <p className="text-xs font-semibold uppercase tracking-wider text-stone-400">
              Step {step + 1} of {STEP_COUNT} · {STEP_META[step].label}
            </p>
            <div className="mt-2 w-full h-1.5 bg-cream-200 rounded-full overflow-hidden">
              <motion.div
                className="h-full bg-clay-500"
                initial={{ width: 0 }}
                animate={{ width: `${progress}%` }}
                transition={{ duration: 0.5, ease: "easeOut" }}
              />
            </div>
          </div>
        </div>

        {/* Steps */}
        <AnimatePresence mode="wait">
          <motion.div
            key={step}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.25 }}
            className="min-h-[320px]"
          >
            {step === 0 && <Step0 data={data} update={update} />}
            {step === 1 && <Step1 data={data} update={update} />}
            {step === 2 && <Step2 />}
            {step === 3 && <Step3 data={data} update={update} />}
            {step === 4 && <Step4 data={data} update={update} />}
          </motion.div>
        </AnimatePresence>

        {/* Navigation */}
        <div className="flex justify-between mt-10 pt-6 border-t border-cream-200">
          <button
            onClick={back}
            className={cn(
              "inline-flex items-center gap-2 px-4 py-2 rounded-lg font-medium text-clay-600 hover:bg-cream-100 transition cursor-pointer",
              step === 0 && "invisible"
            )}
          >
            <ArrowLeft className="w-4 h-4" /> Back
          </button>
          <button
            onClick={next}
            disabled={!canProceed()}
            className={cn(
              "inline-flex items-center gap-2 px-8 py-3 rounded-xl font-semibold transition-all shadow-warm cursor-pointer",
              canProceed()
                ? "bg-clay-600 hover:bg-clay-700 text-cream-50 hover:shadow-warm-md hover:-translate-y-0.5"
                : "bg-cream-200 text-stone-400 cursor-not-allowed shadow-none"
            )}
          >
            {step === STEP_COUNT - 1 ? "Show my routes" : "Continue"}
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </section>
  )
}

// ============================================
// STEPS
// ============================================
function Step0({
  data,
  update,
}: {
  data: FormData
  update: <K extends keyof FormData>(k: K, v: FormData[K]) => void
}) {
  const quickPicks = [100, 300, 500, 1000]
  return (
    <div>
      <h2 className="font-serif text-3xl font-medium text-clay-800 mb-2">
        How much are you sending?
      </h2>
      <p className="text-clay-600 mb-8">Enter any amount.</p>
      <div className="flex gap-2 sm:gap-3 mb-6">
        <input
          type="number"
          value={data.amount || ""}
          onChange={(e) => update("amount", parseFloat(e.target.value) || 0)}
          placeholder="500"
          inputMode="decimal"
          className="flex-1 min-w-0 px-4 sm:px-5 py-4 text-xl sm:text-2xl font-semibold rounded-xl border border-cream-300 bg-cream-50 focus:bg-white focus:border-clay-500 focus:outline-none focus:ring-2 focus:ring-clay-500/15 transition text-clay-800"
        />
        <div className="relative flex-shrink-0">
          <select
            value={data.currency}
            onChange={(e) => update("currency", e.target.value)}
            className="appearance-none pl-4 pr-9 py-4 text-sm sm:text-base font-semibold rounded-xl border border-cream-300 bg-cream-50 focus:bg-white focus:border-clay-500 focus:outline-none text-clay-800 cursor-pointer"
          >
            {["EUR", "USD", "RUB", "GBP"].map((c) => (
              <option key={c}>{c}</option>
            ))}
          </select>
          <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-clay-500 pointer-events-none" />
        </div>
      </div>
      <div>
        <p className="text-xs uppercase tracking-wider font-semibold text-stone-400 mb-3">
          Quick pick
        </p>
        <div className="flex gap-2 flex-wrap">
          {quickPicks.map((amt) => (
            <button
              key={amt}
              onClick={() => update("amount", amt)}
              className={cn(
                "px-5 py-2 rounded-full border font-medium transition cursor-pointer",
                data.amount === amt
                  ? "border-clay-500 bg-clay-500 text-cream-50 shadow-warm-sm"
                  : "border-cream-300 hover:border-clay-400 hover:bg-cream-100 text-clay-700"
              )}
            >
              {data.currency} {amt}
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}

function Step1({
  data,
  update,
}: {
  data: FormData
  update: <K extends keyof FormData>(k: K, v: FormData[K]) => void
}) {
  return (
    <div>
      <h2 className="font-serif text-3xl font-medium text-clay-800 mb-2">
        Where are you sending from?
      </h2>
      <p className="text-clay-600 mb-8">Where do you live or work right now?</p>
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
        {fromCountries.map((country) => (
          <button
            key={country.code}
            onClick={() => update("fromCountry", country.name)}
            className={cn(
              "flex items-center gap-3 p-4 rounded-xl border transition text-left cursor-pointer",
              data.fromCountry === country.name
                ? "border-clay-500 bg-cream-100 shadow-warm-sm"
                : "border-cream-300 hover:border-clay-400 hover:bg-cream-50"
            )}
          >
            <CountryFlag code={country.code} size={26} />
            <span className="font-medium text-clay-700 text-sm">{country.name}</span>
          </button>
        ))}
      </div>
    </div>
  )
}

function Step2() {
  return (
    <div>
      <h2 className="font-serif text-3xl font-medium text-clay-800 mb-2">
        Where is the money going?
      </h2>
      <p className="text-clay-600 mb-8">Right now we serve Georgia. More soon.</p>
      <div className="flex items-center gap-5 p-6 rounded-2xl bg-cream-100 border border-cream-300">
        <CountryFlag code="ge" size={64} />
        <div>
          <p className="font-serif text-2xl font-medium text-clay-800 mb-0.5">Georgia</p>
          <p className="text-sm text-clay-600">Tbilisi · Kutaisi · Batumi · all regions</p>
        </div>
      </div>
    </div>
  )
}

function Step3({
  data,
  update,
}: {
  data: FormData
  update: <K extends keyof FormData>(k: K, v: FormData[K]) => void
}) {
  const options = [
    { value: "asap" as const, label: "ASAP", sub: "Within hours" },
    { value: "24h" as const, label: "Within 24 hours", sub: "Today or tomorrow" },
    { value: "few-days" as const, label: "Within a few days", sub: "Up to a week is fine" },
    { value: "no-rush" as const, label: "No rush — cheapest first", sub: "Price is priority" },
  ]
  return (
    <div>
      <h2 className="font-serif text-3xl font-medium text-clay-800 mb-2">
        How quickly does it need to arrive?
      </h2>
      <p className="text-clay-600 mb-8">Speed and price are often a tradeoff.</p>
      <div className="space-y-2.5">
        {options.map((opt) => (
          <OptionButton
            key={opt.value}
            selected={data.urgency === opt.value}
            onClick={() => update("urgency", opt.value)}
            label={opt.label}
            sub={opt.sub}
          />
        ))}
      </div>
    </div>
  )
}

function Step4({
  data,
  update,
}: {
  data: FormData
  update: <K extends keyof FormData>(k: K, v: FormData[K]) => void
}) {
  const options = [
    { value: "bank" as const, label: "A Georgian bank account", sub: "Direct deposit possible" },
    { value: "smartphone" as const, label: "A smartphone", sub: "Wallet app installable" },
    { value: "cash" as const, label: "Cash pickup only", sub: "Prefers in-person collection" },
    { value: "unsure" as const, label: "Not sure", sub: "Let us decide what's best" },
  ]
  return (
    <div>
      <h2 className="font-serif text-3xl font-medium text-clay-800 mb-2">
        Your recipient has...
      </h2>
      <p className="text-clay-600 mb-8">This helps us pick a route they can actually use.</p>
      <div className="space-y-2.5">
        {options.map((opt) => (
          <OptionButton
            key={opt.value}
            selected={data.recipientCapability === opt.value}
            onClick={() => update("recipientCapability", opt.value)}
            label={opt.label}
            sub={opt.sub}
          />
        ))}
      </div>
    </div>
  )
}

function OptionButton({
  selected,
  onClick,
  label,
  sub,
}: {
  selected: boolean
  onClick: () => void
  label: string
  sub: string
}) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "w-full flex items-center justify-between p-4 rounded-xl border transition text-left cursor-pointer",
        selected
          ? "border-clay-500 bg-cream-100 shadow-warm-sm"
          : "border-cream-300 hover:border-clay-400 hover:bg-cream-50"
      )}
    >
      <div>
        <p className="font-semibold text-clay-800">{label}</p>
        <p className="text-sm text-clay-600 mt-0.5">{sub}</p>
      </div>
      <div
        className={cn(
          "w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 transition",
          selected ? "border-clay-500 bg-clay-500" : "border-cream-300"
        )}
      >
        {selected && <Check className="w-3 h-3 text-cream-50" strokeWidth={3} />}
      </div>
    </button>
  )
}
