"use client"

import { useState } from "react"
import { PageHeader } from "@/components/dashboard/page-header"
import { EmptyState } from "@/components/dashboard/empty-state"
import { LoadingSkeleton } from "@/components/dashboard/loading-skeleton"
import { ErrorState } from "@/components/dashboard/error-state"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { MessageSquare, Search, Send } from "lucide-react"
import useSWR from "swr"
import { formatDistanceToNow } from "date-fns"

const fetcher = (url: string) => fetch(url).then((res) => res.json())

// Mock data for demonstration
const mockMessages = []

export default function BuyerMessagesPage() {
  const [searchQuery, setSearchQuery] = useState("")
  
  // In a real app, this would fetch from /api/buyer/messages
  const { data, error, isLoading } = useSWR("/api/buyer/messages", fetcher, {
    fallbackData: { messages: mockMessages }
  })

  const messages = data?.messages || []
  const filteredMessages = messages.filter((msg: any) =>
    msg.subject?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    msg.sender?.toLowerCase().includes(searchQuery.toLowerCase())
  )

  if (isLoading) {
    return (
      <div className="space-y-6">
        <PageHeader title="Messages" subtitle="Your conversations" />
        <LoadingSkeleton variant="table" />
      </div>
    )
  }

  if (error) {
    return (
      <div className="space-y-6">
        <PageHeader title="Messages" subtitle="Your conversations" />
        <ErrorState message="Failed to load messages" onRetry={() => window.location.reload()} />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Messages"
        subtitle="Communicate with dealers and support"
        breadcrumb={[
          { label: "Dashboard", href: "/buyer/dashboard" },
          { label: "Messages" },
        ]}
      />

      {messages.length === 0 ? (
        <EmptyState
          icon={MessageSquare}
          title="No messages"
          description="Your conversations with dealers will appear here"
        />
      ) : (
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-4 mb-6">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search messages..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-9"
                />
              </div>
            </div>

            <div className="space-y-3">
              {filteredMessages.length === 0 ? (
                <p className="text-sm text-muted-foreground text-center py-8">No messages found</p>
              ) : (
                filteredMessages.map((message: any) => (
                  <div
                    key={message.id}
                    className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors cursor-pointer"
                  >
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="font-medium truncate">{message.subject}</h3>
                        {!message.read && (
                          <span className="w-2 h-2 bg-blue-500 rounded-full" aria-label="Unread" />
                        )}
                      </div>
                      <p className="text-sm text-muted-foreground truncate">
                        From: {message.sender} • {formatDistanceToNow(new Date(message.timestamp), { addSuffix: true })}
                      </p>
                    </div>
                    <Button variant="ghost" size="sm">
                      <Send className="h-4 w-4" />
                    </Button>
                  </div>
                ))
              )}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
