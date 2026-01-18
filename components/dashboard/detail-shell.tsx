import type React from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

interface DetailShellProps {
  summaryTitle: string
  summary: React.ReactNode
  tabs: Array<{
    value: string
    label: string
    content: React.ReactNode
  }>
  defaultTab?: string
}

export function DetailShell({ summaryTitle, summary, tabs, defaultTab }: DetailShellProps) {
  return (
    <div className="grid gap-6 lg:grid-cols-3">
      {/* Summary Card */}
      <Card className="lg:col-span-1">
        <CardHeader>
          <CardTitle>{summaryTitle}</CardTitle>
        </CardHeader>
        <CardContent>{summary}</CardContent>
      </Card>

      {/* Tabs Panel */}
      <div className="lg:col-span-2">
        <Tabs defaultValue={defaultTab || tabs[0]?.value} className="w-full">
          <TabsList className="w-full justify-start overflow-x-auto flex-wrap h-auto">
            {tabs.map((tab) => (
              <TabsTrigger key={tab.value} value={tab.value} className="flex-shrink-0">
                {tab.label}
              </TabsTrigger>
            ))}
          </TabsList>
          {tabs.map((tab) => (
            <TabsContent key={tab.value} value={tab.value} className="mt-6">
              {tab.content}
            </TabsContent>
          ))}
        </Tabs>
      </div>
    </div>
  )
}
