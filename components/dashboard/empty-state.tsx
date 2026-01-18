import type { LucideIcon } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"

interface EmptyStateProps {
  icon: LucideIcon
  title: string
  description: string
  primaryCta?: {
    label: string
    onClick: () => void
  }
  secondaryCta?: {
    label: string
    onClick: () => void
  }
}

export function EmptyState({
  icon: Icon,
  title,
  description,
  primaryCta,
  secondaryCta,
}: EmptyStateProps) {
  return (
    <Card className="border-dashed">
      <CardContent className="flex flex-col items-center justify-center py-12 sm:py-16 px-4 text-center">
        <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-muted flex items-center justify-center mb-4">
          <Icon className="h-8 w-8 sm:h-10 sm:w-10 text-muted-foreground" aria-hidden="true" />
        </div>
        <h3 className="text-lg sm:text-xl font-semibold mb-2">{title}</h3>
        <p className="text-sm sm:text-base text-muted-foreground mb-6 max-w-md">{description}</p>
        <div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
          {primaryCta && (
            <Button onClick={primaryCta.onClick} size="lg">
              {primaryCta.label}
            </Button>
          )}
          {secondaryCta && (
            <Button onClick={secondaryCta.onClick} variant="outline" size="lg">
              {secondaryCta.label}
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
