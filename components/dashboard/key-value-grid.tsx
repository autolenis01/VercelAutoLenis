import type React from "react"

interface KeyValueItem {
  label: string
  value: React.ReactNode
}

interface KeyValueGridProps {
  items: KeyValueItem[]
  columns?: 1 | 2 | 3
}

export function KeyValueGrid({ items, columns = 2 }: KeyValueGridProps) {
  const gridClass = columns === 1 
    ? "grid-cols-1" 
    : columns === 3 
    ? "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3" 
    : "grid-cols-1 sm:grid-cols-2"

  return (
    <div className={`grid ${gridClass} gap-4 sm:gap-6`}>
      {items.map((item, index) => (
        <div key={index} className="space-y-1">
          <dt className="text-sm font-medium text-muted-foreground">{item.label}</dt>
          <dd className="text-base font-medium">{item.value}</dd>
        </div>
      ))}
    </div>
  )
}
