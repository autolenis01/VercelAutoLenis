import { LoadingSkeleton } from "@/components/dashboard/loading-skeleton"
import { PageHeader } from "@/components/dashboard/page-header"

export default function Loading() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Affiliates"
        subtitle="Track affiliate performance and payouts"
        breadcrumb={[
          { label: "Admin", href: "/admin/dashboard" },
          { label: "Affiliates" },
        ]}
      />
      <LoadingSkeleton variant="table" />
    </div>
  )
}
