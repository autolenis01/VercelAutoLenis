"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { Loader2 } from "lucide-react"

export function SignUpForm() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const roleFromUrl = searchParams.get("role")
  const redirectUrl = searchParams.get("redirect")

  const [formData, setFormData] = useState({
    email: "",
    password: "",
    firstName: "",
    lastName: "",
    phone: "",
    role: (roleFromUrl === "affiliate" ? "AFFILIATE" : roleFromUrl === "dealer" ? "DEALER" : "BUYER") as
      | "BUYER"
      | "DEALER"
      | "AFFILIATE",
    marketingSmsConsent: false,
    marketingEmailConsent: false,
  })

  const [refCode, setRefCode] = useState<string | null>(null)

  useEffect(() => {
    // Check localStorage for referral code
    const storedRefCode = localStorage.getItem("ref_code")
    const timestamp = localStorage.getItem("ref_code_timestamp")

    if (storedRefCode && timestamp) {
      // Check if code is still valid (30 days)
      const thirtyDays = 30 * 24 * 60 * 60 * 1000
      if (Date.now() - Number.parseInt(timestamp) < thirtyDays) {
        setRefCode(storedRefCode)
      } else {
        // Clear expired code
        localStorage.removeItem("ref_code")
        localStorage.removeItem("ref_code_timestamp")
      }
    }
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    if (!formData.firstName || !formData.lastName || !formData.email || !formData.password) {
      setError("Please fill in all required fields")
      setLoading(false)
      return
    }

    if (formData.password.length < 8) {
      setError("Password must be at least 8 characters")
      setLoading(false)
      return
    }

    try {
      let response: Response
      try {
        response = await fetch("/api/auth/signup", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            ...formData,
            refCode: refCode,
            contactConsent: true, // Always true since they submitted the form
            consentTextVersion: "2025-01-tcpa-consent-v1",
            consentTimestamp: new Date().toISOString(),
            formSource: "signup",
          }),
        })
      } catch (networkError: any) {
        console.error("[SignUpForm] Network error:", networkError)
        throw new Error("Unable to connect to server. Please check your internet connection.")
      }

      let data
      const contentType = response.headers.get("content-type")
      if (contentType && contentType.includes("application/json")) {
        try {
          data = await response.json()
        } catch (jsonError) {
          console.error("[SignUpForm] JSON parse error:", jsonError)
          throw new Error("Server returned invalid response")
        }
      } else {
        const text = await response.text()
        console.error("[SignUpForm] Non-JSON response:", text)
        throw new Error(text || `Server error (${response.status})`)
      }

      if (!data.success) {
        throw new Error(data.error || "Sign up failed")
      }

      // Process referral if exists (non-blocking)
      if (refCode) {
        try {
          await fetch("/api/affiliate/process-referral", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ refCode }),
          })
          localStorage.removeItem("ref_code")
          localStorage.removeItem("ref_code_timestamp")
        } catch (err) {
          console.error("[SignUpForm] Failed to process referral:", err)
        }
      }

      if (redirectUrl) {
        router.replace(redirectUrl)
      } else if (data.data.redirect) {
        router.replace(data.data.redirect)
      } else {
        if (formData.role === "BUYER") {
          router.replace("/buyer/onboarding")
        } else if (formData.role === "DEALER") {
          router.replace("/dealer/onboarding")
        } else if (formData.role === "AFFILIATE") {
          router.replace("/affiliate/portal/onboarding")
        } else {
          router.replace("/")
        }
      }
    } catch (error: any) {
      console.error("[SignUpForm] Error:", error.message)
      setError(error.message || "An error occurred. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <Card className="w-full max-w-md border-white/20 bg-white shadow-2xl">
      <CardHeader className="space-y-1">
        <CardTitle className="text-3xl font-bold text-[#3d2066]">Get Started</CardTitle>
        <CardDescription className="text-base">
          {formData.role === "AFFILIATE"
            ? "Create your partner account and start earning"
            : formData.role === "DEALER"
              ? "Create your dealer account to start selling"
              : "Create your account and find your perfect car"}
        </CardDescription>
        {refCode && (
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#4ade80]/10 text-[#4ade80] text-sm font-medium">
            Referred by a friend
          </div>
        )}
      </CardHeader>
      <CardContent>
        {error && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-md text-red-700 text-sm">{error}</div>
        )}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="firstName">First name</Label>
              <Input
                id="firstName"
                placeholder="John"
                required
                autoComplete="given-name"
                value={formData.firstName}
                onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                disabled={loading}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="lastName">Last name</Label>
              <Input
                id="lastName"
                placeholder="Doe"
                required
                autoComplete="family-name"
                value={formData.lastName}
                onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                disabled={loading}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="you@example.com"
              required
              autoComplete="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              disabled={loading}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="phone">Phone Number (optional)</Label>
            <Input
              id="phone"
              type="tel"
              placeholder="(555) 123-4567"
              autoComplete="tel"
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              disabled={loading}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              type="password"
              placeholder="••••••••"
              required
              minLength={8}
              autoComplete="new-password"
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              disabled={loading}
            />
            <p className="text-xs text-muted-foreground">Must be at least 8 characters</p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="role">I want to</Label>
            <select
              id="role"
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:opacity-50"
              value={formData.role}
              onChange={(e) => setFormData({ ...formData, role: e.target.value as any })}
              disabled={loading}
            >
              <option value="BUYER">Buy a car</option>
              <option value="DEALER">Sell cars as a dealer</option>
              <option value="AFFILIATE">Refer buyers and earn</option>
            </select>
          </div>

          <div className="space-y-3 pt-2">
            <div className="flex items-start gap-3">
              <Checkbox
                id="marketingSmsConsent"
                checked={formData.marketingSmsConsent}
                onCheckedChange={(checked) => setFormData({ ...formData, marketingSmsConsent: checked as boolean })}
                className="mt-0.5"
                disabled={loading}
              />
              <Label
                htmlFor="marketingSmsConsent"
                className="text-xs text-muted-foreground leading-relaxed cursor-pointer font-normal"
              >
                I agree to receive recurring marketing text messages from AutoLenis at the phone number I provided. I
                understand that messages may be sent using automated technology, that consent is not a condition of
                purchase, and that I can reply STOP to cancel or HELP for help. Message and data rates may apply. I
                understand that AutoLenis may share or sell my information to selected partners for marketing and
                business purposes, as described in the{" "}
                <Link href="/legal/privacy" className="text-[#3d2066] underline hover:no-underline">
                  Privacy Policy
                </Link>
                .
              </Label>
            </div>

            <div className="flex items-start gap-3">
              <Checkbox
                id="marketingEmailConsent"
                checked={formData.marketingEmailConsent}
                onCheckedChange={(checked) => setFormData({ ...formData, marketingEmailConsent: checked as boolean })}
                className="mt-0.5"
                disabled={loading}
              />
              <Label
                htmlFor="marketingEmailConsent"
                className="text-xs text-muted-foreground leading-relaxed cursor-pointer font-normal"
              >
                I agree to receive marketing emails from AutoLenis at the email address I provided. I understand that I
                can unsubscribe at any time using the unsubscribe link in any marketing email. I understand that
                AutoLenis may share or sell my information to selected partners for marketing and business purposes, as
                described in the{" "}
                <Link href="/legal/privacy" className="text-[#3d2066] underline hover:no-underline">
                  Privacy Policy
                </Link>
                .
              </Label>
            </div>
          </div>

          <div className="bg-gray-50 rounded-lg p-3 mt-4">
            <p className="text-xs text-muted-foreground leading-relaxed">
              By submitting this form, I agree that AutoLenis may contact me at the phone number and email address I
              provided regarding my inquiry, including by call, text message, and email. I understand that messages may
              be sent using automated technology, that consent is not a condition of purchase, and that for text
              messages I can reply STOP to cancel or HELP for help. Message and data rates may apply. For more details,
              see the{" "}
              <Link href="/legal/terms" className="text-[#3d2066] underline hover:no-underline">
                Terms of Service
              </Link>{" "}
              and{" "}
              <Link href="/legal/privacy" className="text-[#3d2066] underline hover:no-underline">
                Privacy Policy
              </Link>
              .
            </p>
          </div>

          <Button
            type="submit"
            className="w-full bg-gradient-to-r from-[#4ade80] to-[#22d3ee] text-[#3d2066] hover:opacity-90 font-semibold"
            disabled={loading}
          >
            {loading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Creating account...
              </>
            ) : (
              "Create Account"
            )}
          </Button>
        </form>
      </CardContent>
      <CardFooter className="flex flex-col gap-2">
        <p className="text-sm text-muted-foreground text-center mt-2">
          Already have an account?{" "}
          <Link href="/auth/signin" className="text-[#3d2066] font-medium hover:underline">
            Sign in
          </Link>
        </p>
      </CardFooter>
    </Card>
  )
}
