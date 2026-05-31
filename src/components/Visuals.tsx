import { useState } from "react"
import { Globe, Building2 } from "lucide-react"
import { cn } from "@/lib/utils"

// ============================================
// COUNTRY FLAG (circle-flags CDN — no install needed)
// ============================================
interface CountryFlagProps {
  code: string
  className?: string
  size?: number
}

export function CountryFlag({ code, className, size = 28 }: CountryFlagProps) {
  if (code === "globe" || !code) {
    return (
      <Globe
        className={cn("text-clay-500", className)}
        style={{ width: size, height: size }}
      />
    )
  }
  return (
    <img
      src={`https://hatscripts.github.io/circle-flags/flags/${code}.svg`}
      alt=""
      width={size}
      height={size}
      className={cn("rounded-full select-none flex-shrink-0", className)}
      draggable={false}
    />
  )
}

// ============================================
// BRAND LOGO (Clearbit — falls back to icon if not found)
// ============================================
interface BrandLogoProps {
  domain?: string
  fallback?: React.ReactNode
  className?: string
  size?: number
}

export function BrandLogo({
  domain,
  fallback,
  className,
  size = 40,
}: BrandLogoProps) {
  const [errored, setErrored] = useState(false)

  if (!domain || errored) {
    return (
      <div
        className={cn(
          "flex items-center justify-center text-clay-600",
          className
        )}
        style={{ width: size, height: size }}
      >
        {fallback ?? <Building2 className="w-1/2 h-1/2" />}
      </div>
    )
  }

  return (
    <img
      src={`https://logo.clearbit.com/${domain}?size=128`}
      alt=""
      width={size}
      height={size}
      onError={() => setErrored(true)}
      className={cn("rounded-lg object-contain bg-white", className)}
      draggable={false}
    />
  )
}
