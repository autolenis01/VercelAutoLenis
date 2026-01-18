"use client"

import { useEffect, useState } from "react"
import { CheckCircle2 } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { useUser } from "@/hooks/use-user"

export function SessionStatusIndicator() {
  const { user, isLoading } = useUser()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  // Don't show anything during SSR or while loading
  if (!mounted || isLoading) {
    return null
  }

  // If not authenticated, don't show anything (the warning banner handles that)
  if (!user) {
    return null
  }

  return (
    <div className="flex items-center gap-2 text-sm text-muted-foreground">
      <CheckCircle2 className="h-4 w-4 text-green-500" />
      <span className="hidden sm:inline">Signed in as</span>
      <Badge variant="outline" className="font-normal">
        {user.email}
      </Badge>
    </div>
  )
}
