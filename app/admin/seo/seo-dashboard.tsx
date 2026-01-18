"use client"

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Settings, FileText, ArrowRightLeft, Shield, History } from "lucide-react"
import { SettingsTab } from "./tabs/settings-tab"
import { PagesTab } from "./tabs/pages-tab"
import { RedirectsTab } from "./tabs/redirects-tab"
import { AuditTab } from "./tabs/audit-tab"
import { ChangeLogTab } from "./tabs/changelog-tab"

export function SEODashboard() {
  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold mb-2">SEO Management Dashboard</h1>
        <p className="text-muted-foreground">
          Manage global SEO settings, page metadata, redirects, and monitor SEO health.
        </p>
      </div>

      <Tabs defaultValue="settings" className="space-y-6">
        <TabsList>
          <TabsTrigger value="settings">
            <Settings className="mr-2" />
            Settings
          </TabsTrigger>
          <TabsTrigger value="pages">
            <FileText className="mr-2" />
            Pages
          </TabsTrigger>
          <TabsTrigger value="redirects">
            <ArrowRightLeft className="mr-2" />
            Redirects
          </TabsTrigger>
          <TabsTrigger value="audit">
            <Shield className="mr-2" />
            Audit
          </TabsTrigger>
          <TabsTrigger value="changelog">
            <History className="mr-2" />
            Change Log
          </TabsTrigger>
        </TabsList>

        <TabsContent value="settings">
          <SettingsTab />
        </TabsContent>

        <TabsContent value="pages">
          <PagesTab />
        </TabsContent>

        <TabsContent value="redirects">
          <RedirectsTab />
        </TabsContent>

        <TabsContent value="audit">
          <AuditTab />
        </TabsContent>

        <TabsContent value="changelog">
          <ChangeLogTab />
        </TabsContent>
      </Tabs>
    </div>
  )
}
