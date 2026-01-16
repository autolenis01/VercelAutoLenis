"use client"

import type React from "react"
import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { useToast } from "@/hooks/use-toast"
import { Shield, Lock, AlertTriangle, Loader2, Eye, EyeOff } from "lucide-react"

export default function AdminSignInPage() {
  const router = useRouter()
  const { toast } = useToast()
  const [loading, setLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    try {
      const response = await fetch("/api/admin/auth/signin", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || "Authentication failed")
      }

      toast({
        title: "Welcome, Admin",
        description: "Redirecting to dashboard...",
      })

      router.push(data.redirect || "/admin/dashboard")
    } catch (error: any) {
      setError(error.message)
      toast({
        variant: "destructive",
        title: "Authentication Failed",
        description: error.message,
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex flex-col items-center justify-center p-4">
      <div className="absolute inset-0 bg-[url('/placeholder.svg?height=100&width=100')] opacity-5" />

      <div className="mb-8 flex items-center gap-3">
        <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#7ED321] to-[#00D9FF] flex items-center justify-center">
          <Shield className="w-7 h-7 text-slate-900" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-white">AutoLenis</h1>
          <p className="text-sm text-slate-400">Admin Portal</p>
        </div>
      </div>

      <Card className="w-full max-w-md bg-slate-800/50 border-slate-700 backdrop-blur-sm shadow-2xl">
        <CardHeader className="space-y-1 text-center">
          <div className="mx-auto w-14 h-14 rounded-full bg-slate-700/50 flex items-center justify-center mb-2">
            <Lock className="w-7 h-7 text-[#00D9FF]" />
          </div>
          <CardTitle className="text-2xl font-bold text-white">Admin Sign In</CardTitle>
          <CardDescription className="text-slate-400">Access the admin dashboard</CardDescription>
        </CardHeader>
        <CardContent>
          {error && (
            <Alert className="mb-4 bg-red-500/10 border-red-500/30">
              <AlertTriangle className="h-4 w-4 text-red-500" />
              <AlertDescription className="text-red-200 text-sm">{error}</AlertDescription>
            </Alert>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email" className="text-slate-200">
                Email Address
              </Label>
              <Input
                id="email"
                type="email"
                placeholder="admin@example.com"
                required
                autoComplete="email"
                className="bg-slate-900/50 border-slate-600 text-white placeholder:text-slate-500 focus:border-[#00D9FF] focus:ring-[#00D9FF]/20"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password" className="text-slate-200">
                Password
              </Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter your password"
                  required
                  autoComplete="current-password"
                  className="bg-slate-900/50 border-slate-600 text-white placeholder:text-slate-500 focus:border-[#00D9FF] focus:ring-[#00D9FF]/20 pr-10"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-300"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <Button
              type="submit"
              className="w-full bg-gradient-to-r from-[#7ED321] to-[#00D9FF] text-slate-900 hover:opacity-90 font-semibold h-11"
              disabled={loading}
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Signing In...
                </>
              ) : (
                <>
                  <Shield className="w-4 h-4 mr-2" />
                  Sign In
                </>
              )}
            </Button>
          </form>
        </CardContent>
        <CardFooter className="flex flex-col gap-4 border-t border-slate-700 pt-6">
          <div className="text-center space-y-2">
            <p className="text-sm text-slate-400">
              Need an admin account?{" "}
              <Link href="/admin/signup" className="text-[#00D9FF] hover:underline font-medium">
                Register Here
              </Link>
            </p>
            <Link href="/" className="text-sm text-slate-500 hover:text-slate-400">
              Return to Homepage
            </Link>
          </div>
        </CardFooter>
      </Card>

      <p className="mt-8 text-xs text-slate-500">
        © {new Date().getFullYear()} AutoLenis. Protected by enterprise security.
      </p>
    </div>
  )
}
