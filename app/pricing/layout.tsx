import type { Metadata } from "next"
import { resolveMetadata } from "@/lib/seo/resolve-metadata"

export async function generateMetadata(): Promise<Metadata> {
  return resolveMetadata({
    pageKey: "pricing",
    fallbackTitle: "Pricing - AutoLenis",
    fallbackDescription: "Transparent pricing with no hidden fees. See our $999 flat service fee for car buying.",
  })
}

export default function PricingLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
