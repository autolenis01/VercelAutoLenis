import type { Metadata } from "next"
import { resolveMetadata } from "@/lib/seo/resolve-metadata"

export async function generateMetadata(): Promise<Metadata> {
  return resolveMetadata({
    pageKey: "about",
    fallbackTitle: "About AutoLenis",
    fallbackDescription: "Learn about AutoLenis, our mission to transform car buying with transparency and trust.",
  })
}

export default function AboutLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
