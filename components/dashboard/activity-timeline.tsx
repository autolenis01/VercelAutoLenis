import { formatDistanceToNow } from "date-fns"
import { cn } from "@/lib/utils"

import { ReactNode } from "react"

export interface TimelineItem {
  id: string
  title: string
  description?: string
  timestamp: Date
  type?: "default" | "success" | "warning" | "error"
  icon?: ReactNode
}

interface ActivityTimelineProps {
  items: TimelineItem[]
}

const typeStyles = {
  default: "bg-gray-500",
  success: "bg-green-500",
  warning: "bg-yellow-500",
  error: "bg-red-500",
}

export function ActivityTimeline({ items }: ActivityTimelineProps) {
  if (items.length === 0) {
    return (
      <p className="text-sm text-muted-foreground text-center py-8">No activity to display</p>
    )
  }

  return (
    <div className="space-y-4">
      {items.map((item, index) => {
        const isLast = index === items.length - 1
        const typeClass = typeStyles[item.type || "default"]

        return (
          <div key={item.id} className="relative flex gap-3 sm:gap-4">
            {/* Timeline line */}
            {!isLast && (
              <div className="absolute left-2 top-6 bottom-0 w-px bg-border" aria-hidden="true" />
            )}

            {/* Icon/Dot */}
            <div className="relative flex-shrink-0">
              {item.icon ? (
                <div className={cn("w-8 h-8 rounded-full flex items-center justify-center text-white", typeClass)}>
                  {item.icon}
                </div>
              ) : (
                <div className={cn("w-4 h-4 rounded-full mt-1", typeClass)} />
              )}
            </div>

            {/* Content */}
            <div className="flex-1 min-w-0 pb-4">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1">
                <h4 className="text-sm font-medium">{item.title}</h4>
                <time className="text-xs text-muted-foreground flex-shrink-0">
                  {formatDistanceToNow(item.timestamp, { addSuffix: true })}
                </time>
              </div>
              {item.description && (
                <p className="text-sm text-muted-foreground mt-1">{item.description}</p>
              )}
            </div>
          </div>
        )
      })}
    </div>
  )
}
