"use client"

import { Suspense } from "react"
import { SignUpForm } from "@/components/auth/sign-up-form"
import { AuthNav } from "@/components/layout/auth-nav"
import { AuthFooter } from "@/components/layout/auth-footer"
import { Card, CardContent } from "@/components/ui/card"

function SignUpFormLoading() {
  return (
    <Card className="w-full max-w-md border-white/20 bg-white shadow-2xl">
      <CardContent className="p-8">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-gray-200 rounded w-1/2" />
          <div className="h-4 bg-gray-200 rounded w-3/4" />
          <div className="space-y-3 mt-6">
            <div className="h-10 bg-gray-200 rounded" />
            <div className="h-10 bg-gray-200 rounded" />
            <div className="h-10 bg-gray-200 rounded" />
            <div className="h-10 bg-gray-200 rounded" />
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

export default function SignUpPage() {
  return (
    <div className="min-h-screen bg-brand-purple flex flex-col">
      <AuthNav showSignIn={true} />

      <div className="flex-1 container mx-auto px-4 py-16 flex items-center justify-center">
        <div className="w-full max-w-md">
          <Suspense fallback={<SignUpFormLoading />}>
            <SignUpForm />
          </Suspense>
        </div>
      </div>

      <AuthFooter />
    </div>
  )
}
