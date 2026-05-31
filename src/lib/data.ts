// ============================================
// TYPES
// ============================================
export type Urgency = "asap" | "24h" | "few-days" | "no-rush"
export type RecipientCapability = "bank" | "smartphone" | "cash" | "unsure"
export type Frequency = "one-time" | "monthly" | "other"

export interface FormData {
  amount: number
  currency: string
  fromCountry: string
  toCountry: string
  urgency: Urgency | ""
  recipientCapability: RecipientCapability | ""
  frequency: Frequency | ""
}

export interface Route {
  id: string
  name: string
  provider: string
  type: "crypto" | "fintech" | "traditional"
  fee: number
  feePct: number
  speed: string
  rating: number
  trustScore: number
  received: number
  recommended: boolean
  badge?: string
  pros: string[]
  cons: string[]
  /** Domain used to fetch the brand logo via Clearbit (logo.clearbit.com/<domain>) */
  logoDomain?: string
  /** Where the "Continue" button takes the user (affiliate redirect) */
  websiteUrl: string
}

export interface FraudWarning {
  level: "info" | "warning" | "danger"
  title: string
  message: string
}

// ============================================
// EMPTY STATE
// ============================================
export const emptyFormData: FormData = {
  amount: 500,
  currency: "EUR",
  fromCountry: "",
  toCountry: "Georgia",
  urgency: "",
  recipientCapability: "",
  frequency: "",
}

// ============================================
// COUNTRIES (codes match ISO 3166-1 alpha-2 for circle-flags CDN)
// ============================================
export interface Country {
  code: string         // ISO alpha-2 lowercase, or "globe" for fallback
  name: string
}

export const fromCountries: Country[] = [
  { code: "de", name: "Germany" },
  { code: "ru", name: "Russia" },
  { code: "it", name: "Italy" },
  { code: "us", name: "USA" },
  { code: "gb", name: "UK" },
  { code: "il", name: "Israel" },
  { code: "tr", name: "Turkey" },
  { code: "pl", name: "Poland" },
  { code: "fr", name: "France" },
  { code: "globe", name: "Other" },
]

// ============================================
// MOCKED ROUTE GENERATOR
// ============================================
export function getRoutes(amount: number, currency: string): Route[] {
  return [
    {
      id: "citypay",
      name: "USDT via CityPay.io",
      provider: "CityPay",
      type: "crypto",
      fee: +(amount * 0.007).toFixed(2),
      feePct: 0.7,
      speed: "5 minutes",
      rating: 5,
      trustScore: 9.4,
      received: +(amount * 0.993).toFixed(2),
      recommended: true,
      badge: "Lowest fee · Fastest",
      pros: [
        "Cheapest available route",
        "Fastest transfer (minutes)",
        "Georgian company — local support",
        "No banking hours — works 24/7",
      ],
      cons: [
        "Recipient needs a smartphone",
        "5-min wallet setup required first time",
      ],
      logoDomain: "citypay.io",
      websiteUrl: "https://citypay.io",
    },
    {
      id: "wise",
      name: "Wise",
      provider: "Wise",
      type: "fintech",
      fee: +(amount * 0.011).toFixed(2),
      feePct: 1.1,
      speed: "1-2 business days",
      rating: 5,
      trustScore: 9.6,
      received: +(amount * 0.989).toFixed(2),
      recommended: false,
      pros: [
        "Well-known, highly trusted",
        "Direct bank-to-bank",
        "Transparent fees",
      ],
      cons: [
        "1-2 day wait",
        "Slightly higher fees than crypto routes",
        "Requires bank account on both ends",
      ],
      logoDomain: "wise.com",
      websiteUrl: "https://wise.com",
    },
    {
      id: "revolut",
      name: "Revolut",
      provider: "Revolut",
      type: "fintech",
      fee: +(amount * 0.014).toFixed(2),
      feePct: 1.4,
      speed: "Instant (Revolut → Revolut)",
      rating: 4,
      trustScore: 8.8,
      received: +(amount * 0.986).toFixed(2),
      recommended: false,
      pros: [
        "Instant if both have Revolut",
        "Familiar app for many",
      ],
      cons: [
        "Both sender + receiver need Revolut",
        "Limited weekend availability for some features",
        "Fees stack on currency conversion",
      ],
      logoDomain: "revolut.com",
      websiteUrl: "https://revolut.com",
    },
    {
      id: "bank",
      name: "Bank wire (Sparkasse → Bank of Georgia)",
      provider: "Traditional Bank",
      type: "traditional",
      fee: +(amount * 0.05).toFixed(2),
      feePct: 5.0,
      speed: "3-5 business days",
      rating: 3,
      trustScore: 9.0,
      received: +(amount * 0.95).toFixed(2),
      recommended: false,
      pros: [
        "Familiar and well-understood",
        "Strong consumer protections",
        "Direct to bank account",
      ],
      cons: [
        "Most expensive option (5%+ fees)",
        "Slowest (3-5 business days)",
        "Hidden FX margin from bank",
      ],
      websiteUrl: "https://www.bog.ge",
    },
  ]
}

// ============================================
// FRAUD CHECK GENERATOR
// ============================================
export function getFraudWarnings(amount: number, fromCountry: string, currency: string): FraudWarning[] {
  const warnings: FraudWarning[] = []

  if (amount >= 5000) {
    warnings.push({
      level: "warning",
      title: "Large amount detected",
      message: `For transfers above ${currency} 5,000, consider splitting into smaller transactions to reduce risk and improve trackability.`,
    })
  }

  warnings.push({
    level: "info",
    title: "Verified routes only",
    message: "All providers shown are licensed and regulated in their home jurisdictions. We never recommend untrusted services.",
  })

  if (fromCountry === "Russia") {
    warnings.push({
      level: "warning",
      title: "Russia sanctions check",
      message: "Some routes may be restricted due to ongoing sanctions. Stablecoin routes via CityPay typically remain available.",
    })
  }

  warnings.push({
    level: "info",
    title: "Common scam alert",
    message: "Beware of intermediaries asking for your wallet password or recovery phrase. CityPay and other reputable services never ask for these.",
  })

  return warnings
}

// ============================================
// AI EXPLANATION GENERATOR
// (Templated based on user inputs — looks AI-written, runs locally)
// ============================================
export function generateAIExplanation(formData: FormData, route: Route, worstRoute: Route): string[] {
  const { amount, currency, urgency, recipientCapability, frequency, fromCountry } = formData
  const savedPerTransfer = +(worstRoute.fee - route.fee).toFixed(2)
  const yearlyMult = frequency === "monthly" ? 12 : frequency === "other" ? 6 : 1
  const yearlySaved = +(savedPerTransfer * yearlyMult).toFixed(2)
  const fiveYearSaved = +(yearlySaved * 5).toFixed(2)

  const urgencyText: Record<Urgency, string> = {
    "asap": "you need it fast — and this route delivers in 5 minutes, faster than any traditional option",
    "24h": "you need it within a day — and this route is nearly instant",
    "few-days": "you have a few days — and this route is actually 5 minutes, so it's bonus speed for you",
    "no-rush": "you said price matters most — and this is the cheapest verified option available",
  }

  const recipientText: Record<RecipientCapability, string> = {
    "bank": "Your recipient has a Georgian bank account, so they can cash out USDT at any of the 1,000+ exchange points in Tbilisi and have the funds in their bank within minutes.",
    "smartphone": "Since your recipient has a smartphone, they can install a crypto wallet in 5 minutes — many step-by-step guides exist in Georgian. After the first setup, all future transfers are instant.",
    "cash": "For cash pickup, the recipient converts USDT to GEL at any of Tbilisi's 1,000+ crypto exchange points — same convenience as Western Union, much lower fees.",
    "unsure": "Don't worry — we'll guide your recipient through wallet setup. Most Georgians find it surprisingly easy once they have a quick walkthrough.",
  }

  const paragraphs: string[] = []

  paragraphs.push(
    `Based on your situation, USDT via CityPay.io is the right choice. You're sending ${currency} ${amount} from ${fromCountry || "abroad"}, and ${urgencyText[urgency as Urgency]}.`
  )

  paragraphs.push(recipientText[recipientCapability as RecipientCapability])

  if (frequency === "monthly") {
    paragraphs.push(
      `Since you're sending monthly, this matters a lot: compared to a bank wire, you save ${currency} ${savedPerTransfer} per transfer. Over a year that's ${currency} ${yearlySaved} kept in your family's pocket. Over five years — ${currency} ${fiveYearSaved}.`
    )
  } else {
    paragraphs.push(
      `On this one transfer, you save ${currency} ${savedPerTransfer} compared to a traditional bank wire. If you start sending regularly, the savings compound fast.`
    )
  }

  paragraphs.push(
    `One thing to know: setup takes 5 minutes the FIRST time. After that, every transfer is one tap. It's the kind of small upfront cost that pays back hundreds of times.`
  )

  return paragraphs
}

// ============================================
// STEP-BY-STEP GUIDE GENERATOR
// ============================================
export interface GuideStep {
  num: number
  title: string
  detail: string
  time: string
}

export function getStepByStepGuide(route: Route, recipientCapability: RecipientCapability | ""): GuideStep[] {
  if (route.id === "citypay") {
    return [
      {
        num: 1,
        title: "Download CityPay app",
        detail: "Available free on iOS and Android. Sign up with phone number — takes 2 minutes.",
        time: "2 min",
      },
      {
        num: 2,
        title: "Verify your identity",
        detail: "One-time KYC: passport photo + selfie. Approved within 24 hours.",
        time: "5 min + waiting",
      },
      {
        num: 3,
        title: "Buy USDT with your local currency",
        detail: "Convert your EUR/USD/RUB to USDT inside the app. Real-time rates, no hidden fees.",
        time: "1 min",
      },
      {
        num: 4,
        title: recipientCapability === "cash"
          ? "Send USDT to a Tbilisi exchange agent"
          : "Send USDT to recipient's wallet address",
        detail: recipientCapability === "cash"
          ? "Use a verified CityPay partner agent for cash pickup. Recipient brings ID, gets GEL."
          : "Recipient creates a wallet (5 min one-time). Copy their address, paste, send. Arrives in minutes.",
        time: "5 min",
      },
      {
        num: 5,
        title: "Confirmation & done",
        detail: "Both you and the recipient get an instant notification. Track the transaction on-chain for full transparency.",
        time: "Instant",
      },
    ]
  }

  // Generic fallback for other routes
  return [
    { num: 1, title: "Sign up with provider", detail: "Create account on provider's website or app.", time: "5 min" },
    { num: 2, title: "Verify identity", detail: "Standard KYC required by regulation.", time: "5-30 min" },
    { num: 3, title: "Initiate transfer", detail: "Enter amount, recipient details, and confirm.", time: "3 min" },
    { num: 4, title: "Recipient receives funds", detail: "Time depends on provider — see route speed estimate.", time: "Varies" },
  ]
}
