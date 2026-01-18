import { LoadingSkeleton } from "@/components/dashboard/loading-skeleton"
import { PageHeader } from "@/components/dashboard/page-header"

export default function Loading() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Affiliate details"
        breadcrumb={[
          { label: "Admin", href: "/admin/dashboard" },
          { label: "Affiliates", href: "/admin/affiliates" },
          { label: "Loading" },
        ]}
      />
      <LoadingSkeleton variant="detail" />
    </div>
  )
}
