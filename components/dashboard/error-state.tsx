import { AlertCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"

interface ErrorStateProps {
  message?: string
  onRetry?: () => void
}

export function ErrorState({ 
  message = "Something went wrong. Please try again.", 
  onRetry 
}: ErrorStateProps) {
  return (
    <Card className="border-destructive/50">
      <CardContent className="flex flex-col items-center justify-center py-12 sm:py-16 px-4 text-center">
        <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-destructive/10 flex items-center justify-center mb-4">
          <AlertCircle className="h-8 w-8 sm:h-10 sm:w-10 text-destructive" aria-hidden="true" />
        </div>
        <h3 className="text-lg sm:text-xl font-semibold mb-2">Error Loading Data</h3>
        <p className="text-sm sm:text-base text-muted-foreground mb-6 max-w-md">{message}</p>
        {onRetry && (
          <Button onClick={onRetry} variant="outline">
            Try Again
          </Button>
        )}
      </CardContent>
    </Card>
  )
}
