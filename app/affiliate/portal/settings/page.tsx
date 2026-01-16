"use client"

export const dynamic = "force-dynamic"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { User, Bell, Shield, Save } from "lucide-react"

export default function AffiliateSettingsPage() {
  const [notifications, setNotifications] = useState({
    emailNewReferral: true,
    emailCommission: true,
    emailPayout: true,
    emailWeeklyReport: false,
  })

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Account & Settings</h1>
        <p className="text-muted-foreground mt-1">Manage your affiliate account settings</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <User className="h-5 w-5" />
            Profile Information
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <Label>First Name</Label>
              <Input placeholder="John" className="mt-1" />
            </div>
            <div>
              <Label>Last Name</Label>
              <Input placeholder="Smith" className="mt-1" />
            </div>
            <div>
              <Label>Email</Label>
              <Input type="email" placeholder="john@example.com" className="mt-1" />
            </div>
            <div>
              <Label>Phone</Label>
              <Input placeholder="(555) 123-4567" className="mt-1" />
            </div>
          </div>
          <Button className="bg-[#2D1B69] hover:bg-[#2D1B69]/90">
            <Save className="h-4 w-4 mr-2" />
            Save Profile
          </Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Bell className="h-5 w-5" />
            Notification Preferences
          </CardTitle>
          <CardDescription>Choose which emails you'd like to receive</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium">New Referral</p>
              <p className="text-sm text-muted-foreground">Get notified when someone signs up using your link</p>
            </div>
            <Switch
              checked={notifications.emailNewReferral}
              onCheckedChange={(checked) => setNotifications((prev) => ({ ...prev, emailNewReferral: checked }))}
            />
          </div>
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium">Commission Earned</p>
              <p className="text-sm text-muted-foreground">Get notified when you earn a new commission</p>
            </div>
            <Switch
              checked={notifications.emailCommission}
              onCheckedChange={(checked) => setNotifications((prev) => ({ ...prev, emailCommission: checked }))}
            />
          </div>
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium">Payout Processed</p>
              <p className="text-sm text-muted-foreground">Get notified when your payout is sent</p>
            </div>
            <Switch
              checked={notifications.emailPayout}
              onCheckedChange={(checked) => setNotifications((prev) => ({ ...prev, emailPayout: checked }))}
            />
          </div>
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium">Weekly Performance Report</p>
              <p className="text-sm text-muted-foreground">Receive a weekly summary of your referral performance</p>
            </div>
            <Switch
              checked={notifications.emailWeeklyReport}
              onCheckedChange={(checked) => setNotifications((prev) => ({ ...prev, emailWeeklyReport: checked }))}
            />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5" />
            Security
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label>Current Password</Label>
            <Input type="password" className="mt-1" />
          </div>
          <div>
            <Label>New Password</Label>
            <Input type="password" className="mt-1" />
          </div>
          <div>
            <Label>Confirm New Password</Label>
            <Input type="password" className="mt-1" />
          </div>
          <Button variant="outline">Change Password</Button>
        </CardContent>
      </Card>
    </div>
  )
}
