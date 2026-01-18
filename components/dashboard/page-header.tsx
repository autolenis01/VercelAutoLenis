import { ReactNode } from "react"
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from "@/components/ui/breadcrumb"

interface BreadcrumbItemType {
  label: string
  href?: string
}

interface PageHeaderProps {
  title: string
  subtitle?: string
  primaryAction?: ReactNode
  secondaryActions?: ReactNode[]
  breadcrumb?: BreadcrumbItemType[]
}

export function PageHeader({
  title,
  subtitle,
  primaryAction,
  secondaryActions,
  breadcrumb,
}: PageHeaderProps) {
  return (
    <div className="space-y-4 mb-6">
      {breadcrumb && breadcrumb.length > 0 && (
        <Breadcrumb>
          <BreadcrumbList>
            {breadcrumb.map((item, index) => (
              <React.Fragment key={index}>
                {index > 0 && <BreadcrumbSeparator />}
                <BreadcrumbItem>
                  {item.href && index < breadcrumb.length - 1 ? (
                    <BreadcrumbLink href={item.href}>{item.label}</BreadcrumbLink>
                  ) : (
                    <BreadcrumbPage>{item.label}</BreadcrumbPage>
                  )}
                </BreadcrumbItem>
              </React.Fragment>
            ))}
          </BreadcrumbList>
        </Breadcrumb>
      )}
      
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="space-y-1">
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">{title}</h1>
          {subtitle && <p className="text-sm sm:text-base text-muted-foreground">{subtitle}</p>}
        </div>
        
        {(primaryAction || (secondaryActions && secondaryActions.length > 0)) && (
          <div className="flex items-center gap-2 flex-wrap">
            {secondaryActions?.map((action, index) => (
              <div key={index}>{action}</div>
            ))}
            {primaryAction && <div>{primaryAction}</div>}
          </div>
        )}
      </div>
    </div>
  )
}
