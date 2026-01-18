import type { Metadata } from "next"
import { resolveMetadata } from "@/lib/seo/resolve-metadata"

export async function generateMetadata(): Promise<Metadata> {
  return resolveMetadata({
    pageKey: "how-it-works",
    fallbackTitle: "How It Works - AutoLenis",
    fallbackDescription: "Learn how AutoLenis simplifies car buying in 5 easy steps. From pre-qualification to pickup.",
  })
}

export default function HowItWorksLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
