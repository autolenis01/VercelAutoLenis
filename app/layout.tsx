import type React from "react"
import type { Metadata } from "next"
import "./globals.css"
import { SkipLink } from "@/components/skip-link"
import "@/lib/monitoring"

// Note: Font loading may fail in CI environments without network access
// The app will fall back to system fonts defined in globals.css

export const metadata: Metadata = {
  metadataBase: new URL("https://autolenis.com"),
  title: {
    default: "AutoLenis - Transparent Car Buying Platform",
    template: "%s | AutoLenis",
  },
  description:
    "Get pre-qualified, compare dealer offers, and buy your next car with complete transparency. No hidden fees, no surprises.",
  generator: "v0.app",
  applicationName: "AutoLenis",
  keywords: [
    "car buying",
    "auto financing",
    "dealer offers",
    "transparent pricing",
    "vehicle purchase",
    "reverse auction",
    "pre-qualification",
  ],
  authors: [{ name: "AutoLenis" }],
  creator: "AutoLenis",
  publisher: "AutoLenis",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://autolenis.com",
    siteName: "AutoLenis",
    title: "AutoLenis - Transparent Car Buying Platform",
    description:
      "Get pre-qualified, compare dealer offers, and buy your next car with complete transparency. No hidden fees, no surprises.",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "AutoLenis - Transparent Car Buying",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "AutoLenis - Transparent Car Buying Platform",
    description: "Get pre-qualified, compare dealer offers, and buy your next car with complete transparency.",
    images: ["/og-image.png"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  icons: {
    icon: [
      {
        url: "/icon-light-32x32.png",
        media: "(prefers-color-scheme: light)",
      },
      {
        url: "/icon-dark-32x32.png",
        media: "(prefers-color-scheme: dark)",
      },
      {
        url: "/icon.svg",
        type: "image/svg+xml",
      },
    ],
    apple: "/apple-icon.png",
  },
  verification: {
    // Add your verification codes here when you have them
    // google: "your-google-verification-code",
    // yandex: "your-yandex-verification-code",
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className={`font-sans antialiased`}>
        <SkipLink />
        {children}
      </body>
    </html>
  )
}
