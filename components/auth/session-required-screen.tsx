"use client"

import { AlertCircle, ExternalLink, LogIn } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from "next/link"

interface SessionRequiredScreenProps {
  portalType?: "buyer" | "dealer" | "affiliate" | "admin"
  title?: string
  description?: string
}

export function SessionRequiredScreen({
  portalType = "buyer",
  title = "Sign in required",
  description = "Sessions don't transfer between preview links and autolenis.com.",
}: SessionRequiredScreenProps) {
  const signInRoute = portalType === "admin" ? "/admin/sign-in" : "/auth/signin"
  const portalName = portalType.charAt(0).toUpperCase() + portalType.slice(1)

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-b from-background to-muted/20">
      <Card className="max-w-md w-full shadow-lg">
        <CardHeader className="text-center space-y-4">
          <div className="mx-auto w-12 h-12 rounded-full bg-destructive/10 flex items-center justify-center">
            <AlertCircle className="h-6 w-6 text-destructive" />
          </div>
          <div>
            <CardTitle className="text-2xl">{title}</CardTitle>
            <CardDescription className="mt-2 text-base">{description}</CardDescription>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Button asChild className="w-full" size="lg">
              <Link href={signInRoute}>
                <LogIn className="mr-2 h-4 w-4" />
                Go to Sign In ({portalName})
              </Link>
            </Button>
            <Button asChild variant="outline" className="w-full" size="lg">
              <a href="https://autolenis.com" target="_blank" rel="noopener noreferrer">
                <ExternalLink className="mr-2 h-4 w-4" />
                Open AutoLenis.com
              </a>
            </Button>
          </div>

          <div className="pt-4 border-t">
            <p className="text-xs text-muted-foreground text-center">
              Need help? Contact support at{" "}
              <a href="mailto:support@autolenis.com" className="underline hover:text-foreground">
                support@autolenis.com
              </a>
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
