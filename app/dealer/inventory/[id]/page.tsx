"use client"

import { useParams, useRouter } from "next/navigation"
import useSWR from "swr"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, Edit, Package, AlertCircle, DollarSign } from "lucide-react"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"

const fetcher = (url: string) => fetch(url).then((r) => r.json())

export default function DealerInventoryDetailPage() {
  const params = useParams()
  const router = useRouter()
  const id = params.id as string

  const { data, error, isLoading } = useSWR(
    id ? `/api/dealer/inventory/${id}` : null,
    fetcher
  )

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-48 mb-2" />
            <div className="h-4 bg-gray-200 rounded w-64" />
          </div>
        </div>
      </div>
    )
  }

  if (error || !data?.success) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <Button variant="outline" onClick={() => router.push("/dealer/inventory")}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Inventory
          </Button>
        </div>

        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error Loading Vehicle</AlertTitle>
          <AlertDescription>
            {data?.error || "This vehicle could not be found or you don't have access to it."}
          </AlertDescription>
        </Alert>

        <Card>
          <CardContent className="py-12 text-center">
            <Package className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">Vehicle Not Found</h3>
            <p className="text-muted-foreground mb-6">
              The vehicle you're looking for doesn't exist or has been removed.
            </p>
            <Button onClick={() => router.push("/dealer/inventory")}>
              Return to Inventory
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  const item = data.data
  const vehicle = item.vehicle || {}

  const formatCurrency = (amount?: number) => {
    if (!amount) return "Not set"
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount)
  }

  const formatDate = (date?: string) => {
    if (!date) return "N/A"
    return new Date(date).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    })
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center gap-4 mb-2">
            <Button variant="outline" size="sm" onClick={() => router.push("/dealer/inventory")}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Inventory
            </Button>
          </div>
          <h1 className="text-3xl font-bold">
            {vehicle.year} {vehicle.make} {vehicle.model}
          </h1>
          <p className="text-muted-foreground">{vehicle.trim || "Standard Trim"}</p>
        </div>
        <Button onClick={() => router.push(`/dealer/inventory/${id}/edit`)}>
          <Edit className="h-4 w-4 mr-2" />
          Edit Vehicle
        </Button>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {/* Vehicle Information */}
        <Card>
          <CardHeader>
            <CardTitle>Vehicle Details</CardTitle>
            <CardDescription>Basic vehicle information</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <div className="text-sm text-muted-foreground mb-1">Stock Number</div>
                <div className="font-medium">{item.stockNumber || "N/A"}</div>
              </div>
              <div>
                <div className="text-sm text-muted-foreground mb-1">VIN</div>
                <div className="font-medium font-mono text-sm">{vehicle.vin || "N/A"}</div>
              </div>
              <div>
                <div className="text-sm text-muted-foreground mb-1">Year</div>
                <div className="font-medium">{vehicle.year || "N/A"}</div>
              </div>
              <div>
                <div className="text-sm text-muted-foreground mb-1">Make</div>
                <div className="font-medium">{vehicle.make || "N/A"}</div>
              </div>
              <div>
                <div className="text-sm text-muted-foreground mb-1">Model</div>
                <div className="font-medium">{vehicle.model || "N/A"}</div>
              </div>
              <div>
                <div className="text-sm text-muted-foreground mb-1">Trim</div>
                <div className="font-medium">{vehicle.trim || "N/A"}</div>
              </div>
              <div>
                <div className="text-sm text-muted-foreground mb-1">Body Style</div>
                <div className="font-medium">{vehicle.bodyStyle || "N/A"}</div>
              </div>
              <div>
                <div className="text-sm text-muted-foreground mb-1">Exterior Color</div>
                <div className="font-medium">{vehicle.exteriorColor || "N/A"}</div>
              </div>
              <div>
                <div className="text-sm text-muted-foreground mb-1">Interior Color</div>
                <div className="font-medium">{vehicle.interiorColor || "N/A"}</div>
              </div>
              <div>
                <div className="text-sm text-muted-foreground mb-1">Mileage</div>
                <div className="font-medium">
                  {vehicle.mileage ? `${vehicle.mileage.toLocaleString()} mi` : "N/A"}
                </div>
              </div>
              <div>
                <div className="text-sm text-muted-foreground mb-1">Transmission</div>
                <div className="font-medium">{vehicle.transmission || "N/A"}</div>
              </div>
              <div>
                <div className="text-sm text-muted-foreground mb-1">Drivetrain</div>
                <div className="font-medium">{vehicle.drivetrain || "N/A"}</div>
              </div>
              <div>
                <div className="text-sm text-muted-foreground mb-1">Engine</div>
                <div className="font-medium">{vehicle.engine || "N/A"}</div>
              </div>
              <div>
                <div className="text-sm text-muted-foreground mb-1">Fuel Type</div>
                <div className="font-medium">{vehicle.fuelType || "N/A"}</div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Pricing & Status */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Pricing</CardTitle>
              <CardDescription>Vehicle pricing information</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <div className="text-sm text-muted-foreground mb-1">MSRP</div>
                <div className="text-2xl font-bold">{formatCurrency(vehicle.msrp)}</div>
              </div>
              <div>
                <div className="text-sm text-muted-foreground mb-1">Asking Price</div>
                <div className="text-2xl font-bold text-[#7ED321]">
                  {formatCurrency(item.price)}
                </div>
              </div>
              {item.cost && (
                <div>
                  <div className="text-sm text-muted-foreground mb-1">Cost</div>
                  <div className="text-lg font-medium">{formatCurrency(item.cost)}</div>
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Inventory Status</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Availability</span>
                <Badge className={item.isAvailable ? "bg-[#7ED321]" : "bg-gray-400"}>
                  {item.isAvailable ? "Available" : "Not Available"}
                </Badge>
              </div>
              <div>
                <div className="text-sm text-muted-foreground mb-1">Added to Inventory</div>
                <div className="text-sm">{formatDate(item.createdAt)}</div>
              </div>
              <div>
                <div className="text-sm text-muted-foreground mb-1">Last Updated</div>
                <div className="text-sm">{formatDate(item.updatedAt)}</div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Condition & Notes */}
      {(vehicle.condition || item.notes) && (
        <Card>
          <CardHeader>
            <CardTitle>Additional Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {vehicle.condition && (
              <div>
                <div className="text-sm text-muted-foreground mb-2">Condition</div>
                <Badge variant="outline">{vehicle.condition}</Badge>
              </div>
            )}
            {item.notes && (
              <div>
                <div className="text-sm text-muted-foreground mb-2">Notes</div>
                <p className="text-sm whitespace-pre-wrap">{item.notes}</p>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Actions */}
      <div className="flex gap-4">
        <Button onClick={() => router.push(`/dealer/inventory/${id}/edit`)} size="lg">
          <Edit className="h-4 w-4 mr-2" />
          Edit Vehicle
        </Button>
        <Button variant="outline" onClick={() => router.push("/dealer/inventory")} size="lg">
          Return to Inventory
        </Button>
      </div>
    </div>
  )
}
