"use client"

import { useState } from "react"
import { PageHeader } from "@/components/dashboard/page-header"
import { LoadingSkeleton } from "@/components/dashboard/loading-skeleton"
import { ErrorState } from "@/components/dashboard/error-state"
import { EmptyState } from "@/components/dashboard/empty-state"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { ScrollArea } from "@/components/ui/scroll-area"
import { FileText, Search, Download, Filter } from "lucide-react"
import useSWR from "swr"
import { format } from "date-fns"

const fetcher = (url: string) => fetch(url).then((res) => res.json())

// Mock data for demonstration
const mockAuditLogs = []

export default function AdminAuditLogsPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [actionFilter, setActionFilter] = useState<string>("all")
  const [userFilter, setUserFilter] = useState<string>("all")

  // In a real app, this would fetch from /api/admin/audit-logs
  const { data, error, isLoading } = useSWR("/api/admin/audit-logs", fetcher, {
    fallbackData: { logs: mockAuditLogs }
  })

  const logs = data?.logs || []
  const filteredLogs = logs.filter((log: any) => {
    const matchesSearch = log.action?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         log.userName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         log.details?.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesAction = actionFilter === "all" || log.action === actionFilter
    const matchesUser = userFilter === "all" || log.userRole === userFilter
    return matchesSearch && matchesAction && matchesUser
  })

  const handleExport = () => {
    // In a real app, this would trigger a download of the audit logs
    console.log("Exporting audit logs...")
  }

  if (isLoading) {
    return (
      <div className="space-y-6">
        <PageHeader title="Audit Logs" subtitle="System activity log" />
        <LoadingSkeleton variant="table" />
      </div>
    )
  }

  if (error) {
    return (
      <div className="space-y-6">
        <PageHeader title="Audit Logs" subtitle="System activity log" />
        <ErrorState message="Failed to load audit logs" onRetry={() => window.location.reload()} />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Audit Logs"
        subtitle="Complete system activity and user action logs"
        primaryAction={
          <Button variant="outline" onClick={handleExport}>
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
        }
        breadcrumb={[
          { label: "Admin", href: "/admin/dashboard" },
          { label: "Audit Logs" },
        ]}
      />

      {logs.length === 0 ? (
        <EmptyState
          icon={FileText}
          title="No audit logs"
          description="System activity logs will appear here"
        />
      ) : (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Filter className="h-5 w-5" />
              Filter Logs
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
              <div className="relative flex-1 w-full">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search by action, user, or details..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-9"
                />
              </div>
              <Select value={actionFilter} onValueChange={setActionFilter}>
                <SelectTrigger className="w-full sm:w-[180px]">
                  <SelectValue placeholder="Filter by action" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Actions</SelectItem>
                  <SelectItem value="create">Create</SelectItem>
                  <SelectItem value="update">Update</SelectItem>
                  <SelectItem value="delete">Delete</SelectItem>
                  <SelectItem value="login">Login</SelectItem>
                  <SelectItem value="logout">Logout</SelectItem>
                  <SelectItem value="approve">Approve</SelectItem>
                  <SelectItem value="reject">Reject</SelectItem>
                </SelectContent>
              </Select>
              <Select value={userFilter} onValueChange={setUserFilter}>
                <SelectTrigger className="w-full sm:w-[180px]">
                  <SelectValue placeholder="Filter by user type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Users</SelectItem>
                  <SelectItem value="admin">Admin</SelectItem>
                  <SelectItem value="dealer">Dealer</SelectItem>
                  <SelectItem value="buyer">Buyer</SelectItem>
                  <SelectItem value="affiliate">Affiliate</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {filteredLogs.length === 0 ? (
              <p className="text-sm text-muted-foreground text-center py-8">No logs found matching your filters</p>
            ) : (
              <ScrollArea className="h-[600px] w-full rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Timestamp</TableHead>
                      <TableHead>User</TableHead>
                      <TableHead>Role</TableHead>
                      <TableHead>Action</TableHead>
                      <TableHead>Details</TableHead>
                      <TableHead>IP Address</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredLogs.map((log: any) => (
                      <TableRow key={log.id}>
                        <TableCell className="whitespace-nowrap">
                          {format(new Date(log.timestamp), "MMM d, yyyy HH:mm:ss")}
                        </TableCell>
                        <TableCell className="font-medium">{log.userName}</TableCell>
                        <TableCell>
                          <span className="inline-flex items-center rounded-md bg-blue-50 px-2 py-1 text-xs font-medium text-blue-700 ring-1 ring-inset ring-blue-700/10">
                            {log.userRole}
                          </span>
                        </TableCell>
                        <TableCell>
                          <span className={`inline-flex items-center rounded-md px-2 py-1 text-xs font-medium ring-1 ring-inset ${
                            log.action === "create" ? "bg-green-50 text-green-700 ring-green-700/10" :
                            log.action === "update" ? "bg-blue-50 text-blue-700 ring-blue-700/10" :
                            log.action === "delete" ? "bg-red-50 text-red-700 ring-red-700/10" :
                            log.action === "login" ? "bg-purple-50 text-purple-700 ring-purple-700/10" :
                            log.action === "approve" ? "bg-emerald-50 text-emerald-700 ring-emerald-700/10" :
                            log.action === "reject" ? "bg-orange-50 text-orange-700 ring-orange-700/10" :
                            "bg-gray-50 text-gray-700 ring-gray-700/10"
                          }`}>
                            {log.action}
                          </span>
                        </TableCell>
                        <TableCell className="max-w-md truncate">{log.details}</TableCell>
                        <TableCell className="text-muted-foreground">{log.ipAddress}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </ScrollArea>
            )}

            <div className="flex items-center justify-between text-sm text-muted-foreground">
              <p>
                Showing {filteredLogs.length} of {logs.length} logs
              </p>
              <div className="flex gap-2">
                <Button variant="outline" size="sm" disabled>
                  Previous
                </Button>
                <Button variant="outline" size="sm" disabled>
                  Next
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
