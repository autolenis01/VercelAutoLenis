import { LoadingSkeleton } from "@/components/dashboard/loading-skeleton"
import { PageHeader } from "@/components/dashboard/page-header"

export default function Loading() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Buyer details"
        breadcrumb={[
          { label: "Admin", href: "/admin/dashboard" },
          { label: "Buyers", href: "/admin/buyers" },
          { label: "Loading" },
        ]}
      />
      <LoadingSkeleton variant="detail" />
    </div>
  )
}
