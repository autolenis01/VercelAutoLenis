"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { LogOut, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"

interface LogoutButtonProps {
  variant?: "default" | "ghost" | "outline"
  size?: "default" | "sm" | "lg"
  showIcon?: boolean
  showLabel?: boolean
  className?: string
}

export function LogoutButton({
  variant = "ghost",
  size = "default",
  showIcon = true,
  showLabel = true,
  className,
}: LogoutButtonProps) {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [showConfirmation, setShowConfirmation] = useState(false)

  const handleLogout = async () => {
    setIsLoading(true)

    try {
      const response = await fetch("/api/auth/signout", { method: "POST" })

      if (response.ok) {
        const data = await response.json()
        router.push(`/auth/signout?role=${data.role || "BUYER"}`)
      } else {
        router.push("/auth/signout")
      }
    } catch (error) {
      console.error("Logout error:", error)
      router.push("/auth/signout")
    }
  }

  return (
    <>
      <Button
        onClick={() => setShowConfirmation(true)}
        disabled={isLoading}
        variant={variant}
        size={size}
        className={className}
      >
        {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : showIcon && <LogOut className="h-4 w-4" />}
        {showLabel && <span className="ml-2">Logout</span>}
      </Button>

      <AlertDialog open={showConfirmation} onOpenChange={setShowConfirmation}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Sign Out?</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to sign out? You'll need to sign in again to access your dashboard.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <div className="flex gap-3">
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleLogout} disabled={isLoading} className="bg-red-600 hover:bg-red-700">
              {isLoading ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
              Sign Out
            </AlertDialogAction>
          </div>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}
