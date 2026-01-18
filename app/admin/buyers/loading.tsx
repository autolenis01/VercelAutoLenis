import { LoadingSkeleton } from "@/components/dashboard/loading-skeleton"
import { PageHeader } from "@/components/dashboard/page-header"

export default function Loading() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Buyers"
        subtitle="Manage and review buyer activity"
        breadcrumb={[
          { label: "Admin", href: "/admin/dashboard" },
          { label: "Buyers" },
        ]}
      />
      <LoadingSkeleton variant="table" />
    </div>
  )
}
