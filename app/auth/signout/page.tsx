"use client"

import { useEffect, useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import Link from "next/link"
import { CheckCircle2, ArrowRight, Home, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export default function SignOutPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [isLoading, setIsLoading] = useState(true)
  const [userRole, setUserRole] = useState<string>("BUYER")
  const [error, setError] = useState<string | null>(null)

  const customRedirect = searchParams.get("redirect")

  useEffect(() => {
    const handleLogout = async () => {
      try {
        setIsLoading(true)
        const response = await fetch("/api/auth/signout", { method: "POST" })

        if (!response.ok) {
          throw new Error("Signout failed")
        }

        const data = await response.json()

        if (data.success) {
          setUserRole(data.role || "BUYER")

          // Redirect after a short delay to show success message
          setTimeout(() => {
            const redirectUrl = customRedirect || getRoleRedirectUrl(data.role || "BUYER")
            router.push(redirectUrl)
          }, 2000)
        }
      } catch (err) {
        setError("There was an issue signing you out. Please try again.")
        setIsLoading(false)
      }
    }

    handleLogout()
  }, [router, customRedirect])

  function getRoleRedirectUrl(role: string): string {
    switch (role) {
      case "AFFILIATE":
        return "/affiliate"
      case "DEALER":
      case "DEALER_USER":
        return "/for-dealers"
      case "ADMIN":
        return "/"
      case "BUYER":
      default:
        return "/"
    }
  }

  function getRoleDisplayName(role: string): string {
    switch (role) {
      case "AFFILIATE":
        return "affiliate"
      case "DEALER":
      case "DEALER_USER":
        return "dealer"
      case "ADMIN":
        return "administrator"
      case "BUYER":
      default:
        return "AutoLenis"
    }
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#2D1B69] via-[#1a1040] to-[#0d0820] flex items-center justify-center p-4">
        <Card className="w-full max-w-md text-center">
          <CardHeader className="space-y-4">
            <div className="mx-auto w-16 h-16 bg-red-100 rounded-full flex items-center justify-center">
              <span className="text-2xl">⚠️</span>
            </div>
            <CardTitle className="text-2xl">Logout Error</CardTitle>
            <CardDescription>{error}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Button asChild className="w-full bg-[#2D1B69] hover:bg-[#3d2b79]">
              <Link href="/">
                <Home className="mr-2 h-4 w-4" />
                Return to Homepage
              </Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#2D1B69] via-[#1a1040] to-[#0d0820] flex items-center justify-center p-4">
      <Card className="w-full max-w-md text-center">
        <CardHeader className="space-y-4">
          <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
            {isLoading ? (
              <Loader2 className="h-8 w-8 text-green-600 animate-spin" />
            ) : (
              <CheckCircle2 className="h-8 w-8 text-green-600" />
            )}
          </div>
          <CardTitle className="text-2xl">{isLoading ? "Signing out..." : "Successfully Signed Out"}</CardTitle>
          <CardDescription>
            {isLoading
              ? `Securely logging you out of your ${getRoleDisplayName(userRole)} account...`
              : `You have been securely logged out of your ${getRoleDisplayName(userRole)} account.`}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {isLoading ? (
            <p className="text-sm text-muted-foreground">Redirecting...</p>
          ) : (
            <>
              <p className="text-sm text-muted-foreground">Redirecting to {getRoleDisplayName(userRole)}...</p>

              <div className="flex flex-col gap-3">
                <Button
                  asChild
                  className="w-full bg-[#2D1B69] hover:bg-[#3d2b79]"
                  onClick={() => router.push(getRoleRedirectUrl(userRole))}
                >
                  <a>
                    <Home className="mr-2 h-4 w-4" />
                    Go Now
                  </a>
                </Button>

                <Button asChild variant="outline" className="w-full bg-transparent">
                  <Link href="/auth/signin">
                    Sign In Again
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
              </div>

              <div className="pt-4 border-t">
                <p className="text-xs text-muted-foreground">
                  Thank you for using AutoLenis. Your session has been securely terminated.
                </p>
              </div>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
