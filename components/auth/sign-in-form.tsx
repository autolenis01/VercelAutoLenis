"use client"

import type React from "react"

import { useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Loader2 } from "lucide-react"

export function SignInForm() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  })

  const redirectUrl = searchParams.get("redirect")

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    if (!formData.email || !formData.password) {
      setError("Please fill in all fields")
      setLoading(false)
      return
    }

    try {
      let response: Response
      try {
        response = await fetch("/api/auth/signin", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(formData),
        })
      } catch (networkError: any) {
        console.error("[SignInForm] Network error:", networkError)
        throw new Error("Unable to connect to server. Please check your internet connection.")
      }

      let data
      const contentType = response.headers.get("content-type")
      if (contentType && contentType.includes("application/json")) {
        try {
          data = await response.json()
        } catch (jsonError) {
          console.error("[SignInForm] JSON parse error:", jsonError)
          throw new Error("Server returned invalid response")
        }
      } else {
        const text = await response.text()
        console.error("[SignInForm] Non-JSON response:", text)
        throw new Error(text || `Server error (${response.status})`)
      }

      if (!data.success) {
        throw new Error(data.error || "Sign in failed")
      }

      if (redirectUrl) {
        router.replace(redirectUrl)
      } else if (data.data.redirect) {
        router.replace(data.data.redirect)
      } else {
        const role = data.data.user.role
        if (role === "BUYER") {
          router.replace("/buyer/dashboard")
        } else if (role === "DEALER" || role === "DEALER_USER") {
          router.replace("/dealer/dashboard")
        } else if (role === "ADMIN" || role === "SUPER_ADMIN") {
          router.replace("/admin/dashboard")
        } else if (role === "AFFILIATE" || role === "AFFILIATE_ONLY") {
          router.replace("/affiliate/portal/dashboard")
        } else {
          router.replace("/")
        }
      }
    } catch (error: any) {
      console.error("[SignInForm] Error:", error.message)
      setError(error.message || "An error occurred. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <Card className="w-full max-w-md border-white/20 bg-white shadow-2xl">
      <CardHeader className="space-y-1">
        <CardTitle className="text-3xl font-bold text-[#3d2066]">Welcome Back</CardTitle>
        <CardDescription className="text-base">Sign in to continue your car buying journey</CardDescription>
      </CardHeader>
      <CardContent>
        {error && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-md text-red-700 text-sm">{error}</div>
        )}
        <form onSubmit={handleSubmit} className="space-y-4">
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
            <div className="flex items-center justify-between">
              <Label htmlFor="password">Password</Label>
              <Link href="/auth/forgot-password" className="text-xs text-[#3d2066] hover:underline">
                Forgot password?
              </Link>
            </div>
            <Input
              id="password"
              type="password"
              placeholder="••••••••"
              required
              autoComplete="current-password"
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              disabled={loading}
            />
          </div>

          <Button
            type="submit"
            className="w-full bg-gradient-to-r from-[#4ade80] to-[#22d3ee] text-[#3d2066] hover:opacity-90 font-semibold"
            disabled={loading}
          >
            {loading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Signing in...
              </>
            ) : (
              "Sign In"
            )}
          </Button>
        </form>
      </CardContent>
      <CardFooter className="flex flex-col gap-2">
        <p className="text-sm text-muted-foreground text-center">
          Don&apos;t have an account?{" "}
          <Link href="/auth/signup" className="text-[#3d2066] font-medium hover:underline">
            Sign up for free
          </Link>
        </p>
      </CardFooter>
    </Card>
  )
}
