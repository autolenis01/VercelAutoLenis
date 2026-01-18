"use client"

import { useEffect, useState } from "react"
import { Bug, ChevronRight, Globe, Shield, Cookie } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { useToast } from "@/hooks/use-toast"

interface AuthDebugDrawerProps {
  portalType?: "buyer" | "dealer" | "affiliate" | "admin"
}

export function AuthDebugDrawer({ portalType = "buyer" }: AuthDebugDrawerProps) {
  const [mounted, setMounted] = useState(false)
  const [debugInfo, setDebugInfo] = useState<any>(null)
  const [isOpen, setIsOpen] = useState(false)
  const { toast } = useToast()

  useEffect(() => {
    setMounted(true)
  }, [])

  // Only show if NEXT_PUBLIC_ENV_BADGE is set
  const showDebug = process.env.NEXT_PUBLIC_ENV_BADGE === "true"

  useEffect(() => {
    if (mounted && typeof window !== "undefined") {
      setDebugInfo({
        hostname: window.location.hostname,
        pathname: window.location.pathname,
        portal: portalType,
        cookiesEnabled: navigator.cookieEnabled,
        storageAvailable: typeof window.localStorage !== "undefined",
        userAgent: navigator.userAgent.substring(0, 50) + "...",
      })
    }
  }, [mounted, portalType])

  const handleCopyDebugInfo = () => {
    navigator.clipboard.writeText(JSON.stringify(debugInfo, null, 2))
    toast({
      title: "Debug info copied",
      description: "Debug information has been copied to your clipboard.",
    })
  }

  if (!mounted || !showDebug) {
    return null
  }

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          className="fixed bottom-4 right-4 z-50 shadow-lg"
          title="Open Auth Debug Panel"
        >
          <Bug className="h-4 w-4 mr-2" />
          Debug
        </Button>
      </SheetTrigger>
      <SheetContent className="w-full sm:max-w-lg overflow-y-auto">
        <SheetHeader>
          <SheetTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5" />
            Auth Debug Panel
          </SheetTitle>
          <SheetDescription>Developer-only debugging information</SheetDescription>
        </SheetHeader>

        <div className="mt-6 space-y-4">
          {/* Environment Info */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base flex items-center gap-2">
                <Globe className="h-4 w-4" />
                Environment
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Hostname:</span>
                <code className="text-xs bg-muted px-2 py-1 rounded">{debugInfo?.hostname}</code>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Portal:</span>
                <Badge variant="outline">{debugInfo?.portal}</Badge>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Path:</span>
                <code className="text-xs bg-muted px-2 py-1 rounded truncate max-w-[200px]">
                  {debugInfo?.pathname}
                </code>
              </div>
            </CardContent>
          </Card>

          {/* Browser Capabilities */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base flex items-center gap-2">
                <Cookie className="h-4 w-4" />
                Browser
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 text-sm">
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">Cookies Enabled:</span>
                <Badge variant={debugInfo?.cookiesEnabled ? "default" : "destructive"}>
                  {debugInfo?.cookiesEnabled ? "Yes" : "No"}
                </Badge>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">Storage Available:</span>
                <Badge variant={debugInfo?.storageAvailable ? "default" : "destructive"}>
                  {debugInfo?.storageAvailable ? "Yes" : "No"}
                </Badge>
              </div>
              <Separator className="my-2" />
              <div>
                <span className="text-muted-foreground block mb-1">User Agent:</span>
                <code className="text-xs bg-muted px-2 py-1 rounded block break-all">{debugInfo?.userAgent}</code>
              </div>
            </CardContent>
          </Card>

          {/* Important Note */}
          <Card className="border-orange-200 bg-orange-50 dark:bg-orange-950 dark:border-orange-800">
            <CardHeader className="pb-3">
              <CardTitle className="text-base text-orange-900 dark:text-orange-100">Important Note</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription className="text-sm text-orange-800 dark:text-orange-200">
                Sessions are domain-specific and do not transfer between:
                <ul className="list-disc list-inside mt-2 space-y-1">
                  <li>Preview deployments (*.vercel.app)</li>
                  <li>Production domain (autolenis.com)</li>
                  <li>Different subdomains</li>
                </ul>
                <p className="mt-2">
                  If you logged in on a different domain, you must sign in again on the current domain.
                </p>
              </CardDescription>
            </CardContent>
          </Card>

          {/* Actions */}
          <div className="space-y-2">
            <Button
              variant="outline"
              className="w-full justify-between"
              onClick={() => window.open("/api/diagnostics/auth", "_blank")}
            >
              View Server Diagnostics
              <ChevronRight className="h-4 w-4" />
            </Button>
            <Button variant="outline" className="w-full justify-between" onClick={handleCopyDebugInfo}>
              Copy Debug Info
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  )
}
