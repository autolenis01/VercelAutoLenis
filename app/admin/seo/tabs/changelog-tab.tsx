"use client"

import { useState } from "react"
import useSWR from "swr"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Spinner } from "@/components/ui/spinner"
import { Button } from "@/components/ui/button"
import { ChevronDown, ChevronRight } from "lucide-react"
import { format } from "date-fns"

const fetcher = (url: string) => fetch(url).then((res) => res.json())

interface ChangeLogEntry {
  id: string
  entityType: string
  entityId: string
  action: string
  adminEmail: string
  previousData: Record<string, any> | null
  newData: Record<string, any> | null
  createdAt: string
}

export function ChangeLogTab() {
  const [expandedRows, setExpandedRows] = useState<Set<string>>(new Set())

  const { data, isLoading } = useSWR<{ changes: ChangeLogEntry[] }>("/api/admin/seo/changelog", fetcher)

  const toggleRow = (id: string) => {
    const newExpanded = new Set(expandedRows)
    if (newExpanded.has(id)) {
      newExpanded.delete(id)
    } else {
      newExpanded.add(id)
    }
    setExpandedRows(newExpanded)
  }

  const getActionBadgeVariant = (action: string) => {
    switch (action.toUpperCase()) {
      case "CREATE":
        return "default"
      case "UPDATE":
        return "secondary"
      case "DELETE":
        return "destructive"
      default:
        return "outline"
    }
  }

  const renderDataDiff = (previous: Record<string, any> | null, current: Record<string, any> | null) => {
    if (!previous && !current) {
      return <p className="text-sm text-muted-foreground">No data available</p>
    }

    const prevData = previous || {}
    const currData = current || {}
    const allKeys = new Set([...Object.keys(prevData), ...Object.keys(currData)])

    return (
      <div className="space-y-2 pl-4 py-3 bg-muted/30 rounded-md">
        {Array.from(allKeys).map((key) => {
          const prevValue = prevData[key]
          const currValue = currData[key]
          const hasChanged = JSON.stringify(prevValue) !== JSON.stringify(currValue)

          return (
            <div key={key} className="text-sm">
              <span className="font-medium">{key}:</span>{" "}
              {hasChanged ? (
                <>
                  <span className="line-through text-red-600">
                    {prevValue !== undefined ? JSON.stringify(prevValue) : "null"}
                  </span>
                  {" → "}
                  <span className="text-green-600">
                    {currValue !== undefined ? JSON.stringify(currValue) : "null"}
                  </span>
                </>
              ) : (
                <span className="text-muted-foreground">
                  {currValue !== undefined ? JSON.stringify(currValue) : "null"}
                </span>
              )}
            </div>
          )
        })}
      </div>
    )
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Spinner className="w-8 h-8" />
      </div>
    )
  }

  const changes = data?.changes || []

  return (
    <Card>
      <CardHeader>
        <CardTitle>Change Log</CardTitle>
        <CardDescription>
          Track all changes made to SEO settings, pages, and redirects
        </CardDescription>
      </CardHeader>
      <CardContent>
        {changes.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            No changes recorded yet
          </div>
        ) : (
          <div className="space-y-2">
            {changes.map((change) => {
              const isExpanded = expandedRows.has(change.id)

              return (
                <div key={change.id} className="border rounded-lg overflow-hidden">
                  <div
                    className="flex items-center justify-between p-4 cursor-pointer hover:bg-muted/50"
                    onClick={() => toggleRow(change.id)}
                  >
                    <div className="flex items-center gap-4 flex-1">
                      <Button variant="ghost" size="icon-sm" className="shrink-0">
                        {isExpanded ? (
                          <ChevronDown className="w-4 h-4" />
                        ) : (
                          <ChevronRight className="w-4 h-4" />
                        )}
                      </Button>

                      <div className="flex-1 grid grid-cols-4 gap-4">
                        <div>
                          <div className="text-sm font-medium">{change.entityType}</div>
                          <div className="text-xs text-muted-foreground">{change.entityId}</div>
                        </div>

                        <div>
                          <Badge variant={getActionBadgeVariant(change.action)}>
                            {change.action}
                          </Badge>
                        </div>

                        <div className="text-sm text-muted-foreground">{change.adminEmail}</div>

                        <div className="text-sm text-muted-foreground text-right">
                          {format(new Date(change.createdAt), "MMM d, yyyy h:mm a")}
                        </div>
                      </div>
                    </div>
                  </div>

                  {isExpanded && (
                    <div className="border-t p-4 bg-muted/20">
                      <h4 className="font-medium mb-2 text-sm">Data Changes:</h4>
                      {renderDataDiff(change.previousData, change.newData)}
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
