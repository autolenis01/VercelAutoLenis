"use client"

import { useState } from "react"
import useSWR from "swr"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Spinner } from "@/components/ui/spinner"
import { PlayCircle, AlertCircle, AlertTriangle, Info } from "lucide-react"
import { format } from "date-fns"

const fetcher = (url: string) => fetch(url).then((res) => res.json())

interface AuditIssue {
  pageKey: string
  issueType: string
  message: string
  severity: "critical" | "warning" | "info"
}

interface AuditResult {
  id: string
  totalPages: number
  issuesFound: number
  criticalCount: number
  warningCount: number
  infoCount: number
  createdAt: string
  issues: AuditIssue[]
}

export function AuditTab() {
  const [isRunning, setIsRunning] = useState(false)

  const { data, isLoading, mutate } = useSWR<{ audit: AuditResult | null }>("/api/admin/seo/audit", fetcher)

  const handleRunAudit = async () => {
    setIsRunning(true)
    try {
      const response = await fetch("/api/admin/seo/audit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({}),
      })

      if (!response.ok) throw new Error("Failed to run audit")

      toast.success("SEO audit completed successfully")
      mutate()
    } catch (error) {
      toast.error("Failed to run SEO audit")
      console.error(error)
    } finally {
      setIsRunning(false)
    }
  }

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case "critical":
        return "text-red-600"
      case "warning":
        return "text-yellow-600"
      case "info":
        return "text-blue-600"
      default:
        return "text-gray-600"
    }
  }

  const getSeverityIcon = (severity: string) => {
    switch (severity) {
      case "critical":
        return <AlertCircle className="w-4 h-4 text-red-600" />
      case "warning":
        return <AlertTriangle className="w-4 h-4 text-yellow-600" />
      case "info":
        return <Info className="w-4 h-4 text-blue-600" />
      default:
        return <Info className="w-4 h-4" />
    }
  }

  const getSeverityBadgeVariant = (severity: string): "destructive" | "outline" | "secondary" => {
    switch (severity) {
      case "critical":
        return "destructive"
      case "warning":
        return "outline"
      default:
        return "secondary"
    }
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Spinner className="w-8 h-8" />
      </div>
    )
  }

  const audit = data?.audit

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>SEO Audit</CardTitle>
            <CardDescription>
              Run automated SEO audits to identify issues across your site
            </CardDescription>
          </div>
          <Button onClick={handleRunAudit} disabled={isRunning}>
            {isRunning ? (
              <>
                <Spinner className="mr-2" />
                Running...
              </>
            ) : (
              <>
                <PlayCircle className="mr-2" />
                Run SEO Audit
              </>
            )}
          </Button>
        </CardHeader>
      </Card>

      {audit && (
        <>
          <div className="grid md:grid-cols-4 gap-4">
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  Total Pages
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{audit.totalPages}</div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  Issues Found
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{audit.issuesFound}</div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  Critical
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-red-600">{audit.criticalCount}</div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  Warnings
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-yellow-600">{audit.warningCount}</div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Audit Results</CardTitle>
              <CardDescription>
                Last run: {format(new Date(audit.createdAt), "MMM d, yyyy 'at' h:mm a")}
              </CardDescription>
            </CardHeader>
            <CardContent>
              {audit.issues.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  No issues found! Your SEO is in great shape.
                </div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Severity</TableHead>
                      <TableHead>Page Key</TableHead>
                      <TableHead>Issue Type</TableHead>
                      <TableHead>Message</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {audit.issues.map((issue, index) => (
                      <TableRow key={index}>
                        <TableCell>
                          <Badge
                            variant={getSeverityBadgeVariant(issue.severity)}
                            className="gap-1"
                          >
                            {getSeverityIcon(issue.severity)}
                            {issue.severity}
                          </Badge>
                        </TableCell>
                        <TableCell className="font-mono text-sm">{issue.pageKey}</TableCell>
                        <TableCell>{issue.issueType}</TableCell>
                        <TableCell className={getSeverityColor(issue.severity)}>
                          {issue.message}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>
        </>
      )}

      {!audit && (
        <Card>
          <CardContent className="py-12 text-center text-muted-foreground">
            No audit results available. Click "Run SEO Audit" to perform your first audit.
          </CardContent>
        </Card>
      )}
    </div>
  )
}
