import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"

type Status = "pending" | "active" | "approved" | "rejected" | "paid" | "refunded" | "completed" | "cancelled" | "expired" | "in_progress"

interface StatusPillProps {
  status: Status
  className?: string
}

const statusConfig: Record<Status, { label: string; className: string }> = {
  pending: { label: "Pending", className: "bg-yellow-100 text-yellow-800 hover:bg-yellow-100" },
  active: { label: "Active", className: "bg-blue-100 text-blue-800 hover:bg-blue-100" },
  approved: { label: "Approved", className: "bg-green-100 text-green-800 hover:bg-green-100" },
  rejected: { label: "Rejected", className: "bg-red-100 text-red-800 hover:bg-red-100" },
  paid: { label: "Paid", className: "bg-green-100 text-green-800 hover:bg-green-100" },
  refunded: { label: "Refunded", className: "bg-purple-100 text-purple-800 hover:bg-purple-100" },
  completed: { label: "Completed", className: "bg-green-100 text-green-800 hover:bg-green-100" },
  cancelled: { label: "Cancelled", className: "bg-gray-100 text-gray-800 hover:bg-gray-100" },
  expired: { label: "Expired", className: "bg-gray-100 text-gray-800 hover:bg-gray-100" },
  in_progress: { label: "In Progress", className: "bg-blue-100 text-blue-800 hover:bg-blue-100" },
}

export function StatusPill({ status, className }: StatusPillProps) {
  const config = statusConfig[status] || statusConfig.pending

  return (
    <Badge variant="secondary" className={cn(config.className, className)}>
      {config.label}
    </Badge>
  )
}
