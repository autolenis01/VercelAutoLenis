"use client"

import type React from "react"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { AuthNav } from "@/components/layout/auth-nav"
import { AuthFooter } from "@/components/layout/auth-footer"
import { useToast } from "@/hooks/use-toast"
import { ArrowLeft, Mail, CheckCircle } from "lucide-react"

export default function ForgotPasswordPage() {
  const { toast } = useToast()
  const [loading, setLoading] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [email, setEmail] = useState("")

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const response = await fetch("/api/auth/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      })

      const data = await response.json()

      if (!data.success) {
        throw new Error(data.error)
      }

      setSubmitted(true)
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message || "Something went wrong. Please try again.",
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex flex-col" style={{ backgroundColor: "#3d2066" }}>
      <AuthNav showSignIn={true} />

      <div className="flex-1 container mx-auto px-4 py-16 flex items-center justify-center">
        <Card className="w-full max-w-md border-white/20 bg-white shadow-2xl">
          {submitted ? (
            <>
              <CardHeader className="text-center space-y-4">
                <div
                  className="mx-auto w-16 h-16 rounded-full flex items-center justify-center"
                  style={{ backgroundColor: "rgba(74, 222, 128, 0.2)" }}
                >
                  <CheckCircle className="w-8 h-8" style={{ color: "#4ade80" }} />
                </div>
                <CardTitle className="text-2xl font-bold" style={{ color: "#3d2066" }}>
                  Check Your Email
                </CardTitle>
                <CardDescription className="text-base">
                  If an account exists for <strong>{email}</strong>, we've sent password reset instructions.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div
                  className="rounded-lg p-4 text-sm text-muted-foreground"
                  style={{ backgroundColor: "rgba(61, 32, 102, 0.05)", border: "1px solid rgba(61, 32, 102, 0.2)" }}
                >
                  <p>The link will expire in 1 hour. If you don't see the email, check your spam folder.</p>
                </div>
              </CardContent>
              <CardFooter className="flex flex-col gap-3">
                <Button variant="outline" className="w-full bg-transparent" onClick={() => setSubmitted(false)}>
                  Try a different email
                </Button>
                <Link href="/auth/signin" className="text-sm hover:underline" style={{ color: "#3d2066" }}>
                  <ArrowLeft className="inline w-4 h-4 mr-1" />
                  Back to sign in
                </Link>
              </CardFooter>
            </>
          ) : (
            <>
              <CardHeader className="space-y-1">
                <CardTitle className="text-2xl font-bold" style={{ color: "#3d2066" }}>
                  Forgot Password?
                </CardTitle>
                <CardDescription className="text-base">
                  No worries! Enter your email and we'll send you reset instructions.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="email">Email Address</Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                      <Input
                        id="email"
                        type="email"
                        placeholder="you@example.com"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="pl-10"
                      />
                    </div>
                  </div>

                  <Button
                    type="submit"
                    className="w-full font-semibold"
                    style={{
                      background: "linear-gradient(to right, #4ade80, #22d3ee)",
                      color: "#3d2066",
                    }}
                    disabled={loading}
                  >
                    {loading ? "Sending..." : "Send Reset Link"}
                  </Button>
                </form>
              </CardContent>
              <CardFooter>
                <Link href="/auth/signin" className="text-sm hover:underline mx-auto" style={{ color: "#3d2066" }}>
                  <ArrowLeft className="inline w-4 h-4 mr-1" />
                  Back to sign in
                </Link>
              </CardFooter>
            </>
          )}
        </Card>
      </div>

      <AuthFooter />
    </div>
  )
}
