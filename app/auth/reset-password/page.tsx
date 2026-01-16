"use client"

import type React from "react"

import { useState, useEffect, Suspense } from "react"
import { useSearchParams } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { AuthNav } from "@/components/layout/auth-nav"
import { AuthFooter } from "@/components/layout/auth-footer"
import { useToast } from "@/hooks/use-toast"
import { ArrowLeft, Lock, CheckCircle, XCircle, Eye, EyeOff } from "lucide-react"

function ResetPasswordForm() {
  const searchParams = useSearchParams()
  const { toast } = useToast()

  const [loading, setLoading] = useState(false)
  const [validating, setValidating] = useState(true)
  const [tokenValid, setTokenValid] = useState(false)
  const [tokenError, setTokenError] = useState("")
  const [success, setSuccess] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [formData, setFormData] = useState({
    password: "",
    confirmPassword: "",
  })

  const token = searchParams.get("token")

  useEffect(() => {
    const validateToken = async () => {
      if (!token) {
        setTokenError("Reset link is missing or invalid")
        setValidating(false)
        return
      }

      try {
        const response = await fetch(`/api/auth/reset-password?token=${token}`)
        const data = await response.json()

        if (data.valid) {
          setTokenValid(true)
        } else {
          setTokenError(data.message || "Invalid or expired reset link")
        }
      } catch (error) {
        setTokenError("Unable to validate reset link")
      } finally {
        setValidating(false)
      }
    }

    validateToken()
  }, [token])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (formData.password !== formData.confirmPassword) {
      toast({
        variant: "destructive",
        title: "Passwords don't match",
        description: "Please make sure your passwords match.",
      })
      return
    }

    if (formData.password.length < 8) {
      toast({
        variant: "destructive",
        title: "Password too short",
        description: "Password must be at least 8 characters.",
      })
      return
    }

    setLoading(true)

    try {
      const response = await fetch("/api/auth/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, password: formData.password }),
      })

      const data = await response.json()

      if (!data.success) {
        throw new Error(data.error)
      }

      setSuccess(true)
      toast({
        title: "Password Reset!",
        description: "Your password has been reset successfully.",
      })
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

  // Loading state
  if (validating) {
    return (
      <Card className="w-full max-w-md border-white/20 bg-white shadow-2xl">
        <CardContent className="p-8 text-center">
          <div className="animate-spin w-8 h-8 border-2 border-[#3d2066] border-t-transparent rounded-full mx-auto mb-4" />
          <p className="text-muted-foreground">Validating reset link...</p>
        </CardContent>
      </Card>
    )
  }

  // Invalid token
  if (!tokenValid && !success) {
    return (
      <Card className="w-full max-w-md border-white/20 bg-white shadow-2xl">
        <CardHeader className="text-center space-y-4">
          <div className="mx-auto w-16 h-16 bg-red-100 rounded-full flex items-center justify-center">
            <XCircle className="w-8 h-8 text-red-500" />
          </div>
          <CardTitle className="text-2xl font-bold text-[#3d2066]">Link Invalid</CardTitle>
          <CardDescription className="text-base">{tokenError}</CardDescription>
        </CardHeader>
        <CardFooter className="flex flex-col gap-3">
          <Link href="/auth/forgot-password" className="w-full">
            <Button className="w-full bg-gradient-to-r from-[#4ade80] to-[#22d3ee] text-[#3d2066]">
              Request New Link
            </Button>
          </Link>
          <Link href="/auth/signin" className="text-sm text-[#3d2066] hover:underline">
            <ArrowLeft className="inline w-4 h-4 mr-1" />
            Back to sign in
          </Link>
        </CardFooter>
      </Card>
    )
  }

  // Success
  if (success) {
    return (
      <Card className="w-full max-w-md border-white/20 bg-white shadow-2xl">
        <CardHeader className="text-center space-y-4">
          <div className="mx-auto w-16 h-16 bg-[#4ade80]/20 rounded-full flex items-center justify-center">
            <CheckCircle className="w-8 h-8 text-[#4ade80]" />
          </div>
          <CardTitle className="text-2xl font-bold text-[#3d2066]">Password Reset!</CardTitle>
          <CardDescription className="text-base">
            Your password has been reset successfully. You can now sign in with your new password.
          </CardDescription>
        </CardHeader>
        <CardFooter>
          <Link href="/auth/signin" className="w-full">
            <Button className="w-full bg-gradient-to-r from-[#4ade80] to-[#22d3ee] text-[#3d2066]">Sign In Now</Button>
          </Link>
        </CardFooter>
      </Card>
    )
  }

  // Reset form
  return (
    <Card className="w-full max-w-md border-white/20 bg-white shadow-2xl">
      <CardHeader className="space-y-1">
        <CardTitle className="text-2xl font-bold text-[#3d2066]">Reset Password</CardTitle>
        <CardDescription className="text-base">Enter your new password below.</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="password">New Password</Label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                id="password"
                type={showPassword ? "text" : "password"}
                placeholder="••••••••"
                required
                minLength={8}
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                className="pl-10 pr-10"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
            <p className="text-xs text-muted-foreground">Must be at least 8 characters</p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="confirmPassword">Confirm New Password</Label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                id="confirmPassword"
                type={showPassword ? "text" : "password"}
                placeholder="••••••••"
                required
                value={formData.confirmPassword}
                onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                className="pl-10"
              />
            </div>
          </div>

          <Button
            type="submit"
            className="w-full bg-gradient-to-r from-[#4ade80] to-[#22d3ee] text-[#3d2066] hover:opacity-90 font-semibold"
            disabled={loading}
          >
            {loading ? "Resetting..." : "Reset Password"}
          </Button>
        </form>
      </CardContent>
      <CardFooter>
        <Link href="/auth/signin" className="text-sm text-[#3d2066] hover:underline mx-auto">
          <ArrowLeft className="inline w-4 h-4 mr-1" />
          Back to sign in
        </Link>
      </CardFooter>
    </Card>
  )
}

export default function ResetPasswordPage() {
  return (
    <div className="min-h-screen bg-[#3d2066] flex flex-col">
      <AuthNav showSignIn={true} />

      <div className="flex-1 container mx-auto px-4 py-16 flex items-center justify-center">
        <Suspense
          fallback={
            <Card className="w-full max-w-md border-white/20 bg-white shadow-2xl">
              <CardContent className="p-8 text-center">
                <div className="animate-spin w-8 h-8 border-2 border-[#3d2066] border-t-transparent rounded-full mx-auto mb-4" />
                <p className="text-muted-foreground">Loading...</p>
              </CardContent>
            </Card>
          }
        >
          <ResetPasswordForm />
        </Suspense>
      </div>

      <AuthFooter />
    </div>
  )
}
