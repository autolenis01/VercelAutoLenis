"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

interface ProfileStepProps {
  onNext: (data: any) => void
  initialData?: any
}

export function ProfileStep({ onNext, initialData }: ProfileStepProps) {
  const [formData, setFormData] = useState({
    firstName: initialData?.firstName || "",
    lastName: initialData?.lastName || "",
    phone: initialData?.phone || "",
    address: initialData?.address || "",
    city: initialData?.city || "",
    state: initialData?.state || "",
    zip: initialData?.zip || "",
    employment: initialData?.employment || "",
    employer: initialData?.employer || "",
    annualIncome: initialData?.annualIncome || "",
    housingStatus: initialData?.housingStatus || "RENT",
    monthlyHousing: initialData?.monthlyHousing || "",
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onNext({
      ...formData,
      annualIncome: Number.parseFloat(formData.annualIncome),
      monthlyHousing: Number.parseFloat(formData.monthlyHousing),
    })
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Tell us about yourself</CardTitle>
        <CardDescription>We need some basic information to get you pre-qualified</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="firstName">First name</Label>
              <Input
                id="firstName"
                required
                value={formData.firstName}
                onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="lastName">Last name</Label>
              <Input
                id="lastName"
                required
                value={formData.lastName}
                onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="phone">Phone</Label>
            <Input
              id="phone"
              type="tel"
              required
              placeholder="1234567890"
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="address">Street address</Label>
            <Input
              id="address"
              required
              value={formData.address}
              onChange={(e) => setFormData({ ...formData, address: e.target.value })}
            />
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div className="col-span-2 space-y-2">
              <Label htmlFor="city">City</Label>
              <Input
                id="city"
                required
                value={formData.city}
                onChange={(e) => setFormData({ ...formData, city: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="state">State</Label>
              <Input
                id="state"
                required
                maxLength={2}
                placeholder="CA"
                value={formData.state}
                onChange={(e) => setFormData({ ...formData, state: e.target.value.toUpperCase() })}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="zip">ZIP code</Label>
            <Input
              id="zip"
              required
              pattern="\d{5}"
              placeholder="12345"
              value={formData.zip}
              onChange={(e) => setFormData({ ...formData, zip: e.target.value })}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="employment">Employment status</Label>
            <select
              id="employment"
              required
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              value={formData.employment}
              onChange={(e) => setFormData({ ...formData, employment: e.target.value })}
            >
              <option value="">Select...</option>
              <option value="EMPLOYED_FULL_TIME">Employed full-time</option>
              <option value="EMPLOYED_PART_TIME">Employed part-time</option>
              <option value="SELF_EMPLOYED">Self-employed</option>
              <option value="RETIRED">Retired</option>
              <option value="OTHER">Other</option>
            </select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="employer">Employer</Label>
            <Input
              id="employer"
              required
              value={formData.employer}
              onChange={(e) => setFormData({ ...formData, employer: e.target.value })}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="annualIncome">Annual income</Label>
            <Input
              id="annualIncome"
              type="number"
              required
              min="0"
              step="1000"
              placeholder="50000"
              value={formData.annualIncome}
              onChange={(e) => setFormData({ ...formData, annualIncome: e.target.value })}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="housingStatus">Housing status</Label>
            <select
              id="housingStatus"
              required
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              value={formData.housingStatus}
              onChange={(e) => setFormData({ ...formData, housingStatus: e.target.value })}
            >
              <option value="RENT">Rent</option>
              <option value="OWN">Own</option>
              <option value="OTHER">Other</option>
            </select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="monthlyHousing">Monthly housing payment</Label>
            <Input
              id="monthlyHousing"
              type="number"
              required
              min="0"
              step="50"
              placeholder="1200"
              value={formData.monthlyHousing}
              onChange={(e) => setFormData({ ...formData, monthlyHousing: e.target.value })}
            />
          </div>

          <Button type="submit" className="w-full" size="lg">
            Continue
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}
