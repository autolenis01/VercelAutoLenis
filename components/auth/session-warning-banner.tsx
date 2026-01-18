"use client"

import { useEffect, useState } from "react"
import { AlertCircle, ExternalLink, LogIn } from "lucide-react"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Button } from "@/components/ui/button"
import { useUser } from "@/hooks/use-user"
import Link from "next/link"

interface SessionWarningBannerProps {
  portalType?: "buyer" | "dealer" | "affiliate" | "admin"
}

export function SessionWarningBanner({ portalType = "buyer" }: SessionWarningBannerProps) {
  const { user, isLoading } = useUser()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  // Don't show anything during SSR or while loading
  if (!mounted || isLoading) {
    return null
  }

  // If user is authenticated, show nothing (banner is only for unauthenticated state)
  if (user) {
    return null
  }

  // Determine the correct sign-in route based on portal type
  const signInRoute = portalType === "admin" ? "/admin/sign-in" : "/auth/signin"
  const portalName = portalType.charAt(0).toUpperCase() + portalType.slice(1)

  return (
    <Alert variant="destructive" className="mb-6">
      <AlertCircle className="h-4 w-4" />
      <AlertTitle>Session Not Active</AlertTitle>
      <AlertDescription className="mt-2">
        <p className="mb-3">
          Your session isn&apos;t active on this domain. Sessions don&apos;t transfer between preview links and
          autolenis.com.
        </p>
        <div className="flex flex-wrap gap-2">
          <Button asChild size="sm" variant="default">
            <Link href={signInRoute}>
              <LogIn className="mr-2 h-4 w-4" />
              Sign in to {portalName}
            </Link>
          </Button>
          <Button asChild size="sm" variant="outline">
            <a href="https://autolenis.com" target="_blank" rel="noopener noreferrer">
              <ExternalLink className="mr-2 h-4 w-4" />
              Open AutoLenis.com
            </a>
          </Button>
        </div>
      </AlertDescription>
    </Alert>
  )
}
