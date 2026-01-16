"use client"

import { Suspense } from "react"
import { SignInForm } from "@/components/auth/sign-in-form"
import { AuthNav } from "@/components/layout/auth-nav"
import { AuthFooter } from "@/components/layout/auth-footer"
import { Loader2 } from "lucide-react"

function SignInContent() {
  return (
    <div className="min-h-screen bg-brand-purple flex flex-col">
      <AuthNav showSignUp={true} />

      <div className="flex-1 container mx-auto px-4 py-16 flex items-center justify-center">
        <div className="w-full max-w-md">
          <SignInForm />
        </div>
      </div>

      <AuthFooter />
    </div>
  )
}

export default function SignInPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-brand-purple flex items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-white" />
        </div>
      }
    >
      <SignInContent />
    </Suspense>
  )
}
