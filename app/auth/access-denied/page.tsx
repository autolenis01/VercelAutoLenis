import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ShieldX, Home, ArrowLeft } from "lucide-react"

export default function AccessDeniedPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex flex-col items-center justify-center p-4">
      <div className="absolute inset-0 bg-[url('/abstract-grid.png')] opacity-5" />

      <Card className="w-full max-w-md bg-slate-800/50 border-slate-700 backdrop-blur-sm shadow-2xl">
        <CardHeader className="space-y-1 text-center">
          <div className="mx-auto w-16 h-16 rounded-full bg-red-500/20 flex items-center justify-center mb-4">
            <ShieldX className="w-8 h-8 text-red-400" />
          </div>
          <CardTitle className="text-2xl font-bold text-white">Access Denied</CardTitle>
          <CardDescription className="text-slate-400">
            You don't have permission to access this resource.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-sm text-slate-300 text-center">
            This area is restricted to authorized personnel only. If you believe you should have access, please contact
            the system administrator.
          </p>

          <div className="flex flex-col gap-2">
            <Button asChild className="w-full bg-slate-700 hover:bg-slate-600">
              <Link href="/">
                <Home className="w-4 h-4 mr-2" />
                Go to Homepage
              </Link>
            </Button>
            <Button
              asChild
              variant="outline"
              className="w-full border-slate-600 text-slate-300 hover:bg-slate-700 bg-transparent"
            >
              <Link href="/auth/signin">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Sign In
              </Link>
            </Button>
          </div>
        </CardContent>
      </Card>

      <p className="mt-8 text-xs text-slate-500">© {new Date().getFullYear()} AutoLenis. All rights reserved.</p>
    </div>
  )
}
