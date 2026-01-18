import type { Metadata } from "next"
import { resolveMetadata } from "@/lib/seo/resolve-metadata"

export async function generateMetadata(): Promise<Metadata> {
  return resolveMetadata({
    pageKey: "contact",
    fallbackTitle: "Contact Us - AutoLenis",
    fallbackDescription: "Get in touch with AutoLenis. We're here to help with your car buying journey.",
  })
}

export default function ContactLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
