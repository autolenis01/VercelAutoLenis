"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { useRouter, useParams } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useToast } from "@/hooks/use-toast"
import { ArrowLeft, Car, AlertCircle } from "lucide-react"
import Link from "next/link"

export default function EditInventoryPage() {
  const params = useParams()
  const inventoryId = params.id as string
  const router = useRouter()
  const { toast } = useToast()
  const [loading, setLoading] = useState(false)
  const [initialLoading, setInitialLoading] = useState(true)
  const [formData, setFormData] = useState({
    vin: "",
    make: "",
    model: "",
    year: new Date().getFullYear(),
    trim: "",
    bodyStyle: "",
    mileage: 0,
    exteriorColor: "",
    interiorColor: "",
    engine: "",
    transmission: "Automatic",
    drivetrain: "FWD",
    fuelType: "Gasoline",
    price: 0,
    stockNumber: "",
    isNew: false,
    locationCity: "",
    locationState: "",
    status: "AVAILABLE",
  })

  useEffect(() => {
    loadInventoryItem()
  }, [inventoryId])

  const loadInventoryItem = async () => {
    try {
      const res = await fetch("/api/dealer/inventory")
      const data = await res.json()

      if (data.success) {
        const item = data.inventory.find((i: any) => i.id === inventoryId)
        if (item) {
          const vehicle = item.vehicle
          setFormData({
            vin: vehicle.vin || "",
            make: vehicle.make || "",
            model: vehicle.model || "",
            year: vehicle.year || new Date().getFullYear(),
            trim: vehicle.trim || "",
            bodyStyle: vehicle.bodyStyle || "",
            mileage: vehicle.mileage || 0,
            exteriorColor: vehicle.exteriorColor || "",
            interiorColor: vehicle.interiorColor || "",
            engine: vehicle.engine || "",
            transmission: vehicle.transmission || "Automatic",
            drivetrain: vehicle.drivetrain || "FWD",
            fuelType: vehicle.fuelType || "Gasoline",
            price: item.price || 0,
            stockNumber: item.stockNumber || "",
            isNew: vehicle.isNew || false,
            locationCity: vehicle.locationCity || "",
            locationState: vehicle.locationState || "",
            status: item.status || "AVAILABLE",
          })
        } else {
          throw new Error("Vehicle not found")
        }
      } else {
        throw new Error(data.error || "Failed to load vehicle")
      }
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message || "Failed to load vehicle",
      })
    } finally {
      setInitialLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const res = await fetch(`/api/dealer/inventory/${inventoryId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          price: formData.price,
          stockNumber: formData.stockNumber,
          status: formData.status,
          vehicle: {
            vin: formData.vin,
            make: formData.make,
            model: formData.model,
            year: formData.year,
            trim: formData.trim,
            bodyStyle: formData.bodyStyle,
            mileage: formData.mileage,
            exteriorColor: formData.exteriorColor,
            interiorColor: formData.interiorColor,
            engine: formData.engine,
            transmission: formData.transmission,
            drivetrain: formData.drivetrain,
            fuelType: formData.fuelType,
            isNew: formData.isNew,
            locationCity: formData.locationCity,
            locationState: formData.locationState,
          },
        }),
      })

      const data = await res.json()

      if (!data.success) {
        throw new Error(data.error || "Failed to update vehicle")
      }

      toast({ title: "Vehicle updated successfully!" })
      router.push(`/dealer/inventory/${inventoryId}`)
    } catch (error: any) {
      toast({ variant: "destructive", title: error.message })
    } finally {
      setLoading(false)
    }
  }

  if (initialLoading) {
    return (
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="animate-pulse">
          <div className="h-8 w-48 bg-muted rounded mb-2" />
          <div className="h-4 w-64 bg-muted rounded" />
        </div>
        <Card className="animate-pulse">
          <CardContent className="p-12">
            <div className="h-48 bg-muted rounded" />
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" asChild>
          <Link href={`/dealer/inventory/${inventoryId}`}>
            <ArrowLeft className="h-5 w-5" />
          </Link>
        </Button>
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-2">
            <Car className="h-8 w-8 text-[#2D1B69]" />
            Edit Vehicle
          </h1>
          <p className="text-muted-foreground">
            {formData.year} {formData.make} {formData.model}
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit}>
        {/* Vehicle Information */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Vehicle Information</CardTitle>
            <CardDescription>Update the basic vehicle details</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="vin">VIN *</Label>
                <Input
                  id="vin"
                  value={formData.vin}
                  onChange={(e) => setFormData({ ...formData, vin: e.target.value.toUpperCase() })}
                  placeholder="1HGCM82633A123456"
                  maxLength={17}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="year">Year *</Label>
                <Select
                  value={formData.year.toString()}
                  onValueChange={(v) => setFormData({ ...formData, year: Number.parseInt(v) || new Date().getFullYear() })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {Array.from({ length: 30 }, (_, i) => new Date().getFullYear() + 1 - i).map((year) => (
                      <SelectItem key={year} value={year.toString()}>
                        {year}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="make">Make *</Label>
                <Input
                  id="make"
                  value={formData.make}
                  onChange={(e) => setFormData({ ...formData, make: e.target.value })}
                  placeholder="Toyota"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="model">Model *</Label>
                <Input
                  id="model"
                  value={formData.model}
                  onChange={(e) => setFormData({ ...formData, model: e.target.value })}
                  placeholder="Camry"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="trim">Trim</Label>
                <Input
                  id="trim"
                  value={formData.trim}
                  onChange={(e) => setFormData({ ...formData, trim: e.target.value })}
                  placeholder="XLE"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="bodyStyle">Body Style</Label>
                <Select value={formData.bodyStyle} onValueChange={(v) => setFormData({ ...formData, bodyStyle: v })}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select body style" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Sedan">Sedan</SelectItem>
                    <SelectItem value="SUV">SUV</SelectItem>
                    <SelectItem value="Truck">Truck</SelectItem>
                    <SelectItem value="Coupe">Coupe</SelectItem>
                    <SelectItem value="Hatchback">Hatchback</SelectItem>
                    <SelectItem value="Wagon">Wagon</SelectItem>
                    <SelectItem value="Van">Van</SelectItem>
                    <SelectItem value="Convertible">Convertible</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="mileage">Mileage *</Label>
                <Input
                  id="mileage"
                  type="number"
                  value={formData.mileage}
                  onChange={(e) => setFormData({ ...formData, mileage: Number(e.target.value) || 0 })}
                  placeholder="25000"
                  required
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Specifications */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Specifications</CardTitle>
            <CardDescription>Technical details about the vehicle</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="engine">Engine</Label>
                <Input
                  id="engine"
                  value={formData.engine}
                  onChange={(e) => setFormData({ ...formData, engine: e.target.value })}
                  placeholder="2.5L 4-Cylinder"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="transmission">Transmission</Label>
                <Select
                  value={formData.transmission}
                  onValueChange={(v) => setFormData({ ...formData, transmission: v })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Automatic">Automatic</SelectItem>
                    <SelectItem value="Manual">Manual</SelectItem>
                    <SelectItem value="CVT">CVT</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="drivetrain">Drivetrain</Label>
                <Select value={formData.drivetrain} onValueChange={(v) => setFormData({ ...formData, drivetrain: v })}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="FWD">FWD</SelectItem>
                    <SelectItem value="RWD">RWD</SelectItem>
                    <SelectItem value="AWD">AWD</SelectItem>
                    <SelectItem value="4WD">4WD</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="fuelType">Fuel Type</Label>
                <Select value={formData.fuelType} onValueChange={(v) => setFormData({ ...formData, fuelType: v })}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Gasoline">Gasoline</SelectItem>
                    <SelectItem value="Diesel">Diesel</SelectItem>
                    <SelectItem value="Electric">Electric</SelectItem>
                    <SelectItem value="Hybrid">Hybrid</SelectItem>
                    <SelectItem value="Plug-in Hybrid">Plug-in Hybrid</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="exteriorColor">Exterior Color</Label>
                <Input
                  id="exteriorColor"
                  value={formData.exteriorColor}
                  onChange={(e) => setFormData({ ...formData, exteriorColor: e.target.value })}
                  placeholder="Silver"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="interiorColor">Interior Color</Label>
                <Input
                  id="interiorColor"
                  value={formData.interiorColor}
                  onChange={(e) => setFormData({ ...formData, interiorColor: e.target.value })}
                  placeholder="Black"
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Pricing & Status */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Pricing & Status</CardTitle>
            <CardDescription>Set pricing and listing status</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="price">Price *</Label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">$</span>
                  <Input
                    id="price"
                    type="number"
                    step="0.01"
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: Number(e.target.value) || 0 })}
                    className="pl-8"
                    placeholder="25000"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="stockNumber">Stock Number</Label>
                <Input
                  id="stockNumber"
                  value={formData.stockNumber}
                  onChange={(e) => setFormData({ ...formData, stockNumber: e.target.value })}
                  placeholder="STK-001"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="status">Status</Label>
                <Select value={formData.status} onValueChange={(v) => setFormData({ ...formData, status: v })}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="AVAILABLE">Available</SelectItem>
                    <SelectItem value="PENDING">Pending</SelectItem>
                    <SelectItem value="SOLD">Sold</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="locationCity">City</Label>
                <Input
                  id="locationCity"
                  value={formData.locationCity}
                  onChange={(e) => setFormData({ ...formData, locationCity: e.target.value })}
                  placeholder="Los Angeles"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="locationState">State</Label>
                <Input
                  id="locationState"
                  value={formData.locationState}
                  onChange={(e) => setFormData({ ...formData, locationState: e.target.value })}
                  placeholder="CA"
                  maxLength={2}
                />
              </div>
            </div>

            <div className="flex items-center gap-3">
              <input
                type="checkbox"
                id="isNew"
                checked={formData.isNew}
                onChange={(e) => setFormData({ ...formData, isNew: e.target.checked })}
                className="h-4 w-4"
              />
              <Label htmlFor="isNew">This is a new vehicle</Label>
            </div>
          </CardContent>
        </Card>

        {/* Submit */}
        <div className="flex justify-end gap-4">
          <Button type="button" variant="outline" onClick={() => router.push(`/dealer/inventory/${inventoryId}`)}>
            Cancel
          </Button>
          <Button
            type="submit"
            disabled={loading}
            className="bg-gradient-to-r from-[#7ED321] to-[#00D9FF] text-[#2D1B69] font-semibold"
          >
            {loading ? "Saving..." : "Save Changes"}
          </Button>
        </div>
      </form>
    </div>
  )
}
