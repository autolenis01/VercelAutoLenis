"use client"

import { useSearchParams } from "next/navigation"
import { Suspense, useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { AuthNav } from "@/components/layout/auth-nav"
import { AuthFooter } from "@/components/layout/auth-footer"
import { CheckCircle, XCircle, Mail, Loader2, RefreshCw } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

function VerifyEmailContent() {
  const searchParams = useSearchParams()
  const { toast } = useToast()
  const [resending, setResending] = useState(false)

  const success = searchParams.get("success") === "true"
  const error = searchParams.get("error")
  const pending = searchParams.get("pending") === "true"

  const handleResend = async () => {
    setResending(true)
    try {
      const response = await fetch("/api/auth/resend-verification", {
        method: "POST",
      })

      const data = await response.json()

      if (data.error) {
        throw new Error(data.error)
      }

      toast({
        title: "Email Sent",
        description: "Please check your inbox for the verification link.",
      })
    } catch (err: any) {
      toast({
        variant: "destructive",
        title: "Failed to send",
        description: err.message,
      })
    } finally {
      setResending(false)
    }
  }

  return (
    <Card className="w-full max-w-md border-white/20 bg-white shadow-2xl">
      <CardHeader className="space-y-1 text-center">
        {success ? (
          <>
            <div className="mx-auto w-16 h-16 rounded-full bg-green-100 flex items-center justify-center mb-4">
              <CheckCircle className="w-8 h-8 text-green-600" />
            </div>
            <CardTitle className="text-2xl font-bold text-green-600">Email Verified!</CardTitle>
            <CardDescription className="text-base">
              Your email has been successfully verified. You now have full access to your account.
            </CardDescription>
          </>
        ) : error ? (
          <>
            <div className="mx-auto w-16 h-16 rounded-full bg-red-100 flex items-center justify-center mb-4">
              <XCircle className="w-8 h-8 text-red-600" />
            </div>
            <CardTitle className="text-2xl font-bold text-red-600">Verification Failed</CardTitle>
            <CardDescription className="text-base text-red-600">{decodeURIComponent(error)}</CardDescription>
          </>
        ) : (
          <>
            <div className="mx-auto w-16 h-16 rounded-full bg-[#3d2066]/10 flex items-center justify-center mb-4">
              <Mail className="w-8 h-8 text-[#3d2066]" />
            </div>
            <CardTitle className="text-2xl font-bold text-[#3d2066]">Verify Your Email</CardTitle>
            <CardDescription className="text-base">
              {pending
                ? "We've sent a verification link to your email. Please check your inbox and click the link to verify your account."
                : "Please verify your email address to access all features."}
            </CardDescription>
          </>
        )}
      </CardHeader>
      <CardContent className="space-y-4">
        {success ? (
          <Link href="/auth/signin" className="block">
            <Button className="w-full bg-gradient-to-r from-[#4ade80] to-[#22d3ee] text-[#3d2066] hover:opacity-90 font-semibold">
              Continue to Sign In
            </Button>
          </Link>
        ) : (
          <>
            <div className="bg-gray-50 rounded-lg p-4 space-y-2">
              <p className="text-sm font-medium text-gray-700">Didn't receive the email?</p>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• Check your spam or junk folder</li>
                <li>• Make sure you entered the correct email</li>
                <li>• Allow a few minutes for the email to arrive</li>
              </ul>
            </div>
            <Button
              onClick={handleResend}
              disabled={resending}
              className="w-full bg-gradient-to-r from-[#4ade80] to-[#22d3ee] text-[#3d2066] hover:opacity-90 font-semibold"
            >
              {resending ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Sending...
                </>
              ) : (
                <>
                  <RefreshCw className="w-4 h-4 mr-2" />
                  Resend Verification Email
                </>
              )}
            </Button>
          </>
        )}
      </CardContent>
      <CardFooter className="justify-center">
        <Link href="/" className="text-sm text-muted-foreground hover:text-[#3d2066]">
          Return to Homepage
        </Link>
      </CardFooter>
    </Card>
  )
}

export default function VerifyEmailPage() {
  return (
    <div className="min-h-screen bg-[#3d2066] flex flex-col">
      <AuthNav />
      <div className="flex-1 container mx-auto px-4 py-16 flex items-center justify-center">
        <Suspense
          fallback={
            <Card className="w-full max-w-md">
              <CardContent className="p-8 flex items-center justify-center">
                <Loader2 className="w-8 h-8 animate-spin text-[#3d2066]" />
              </CardContent>
            </Card>
          }
        >
          <VerifyEmailContent />
        </Suspense>
      </div>
      <AuthFooter />
    </div>
  )
}
