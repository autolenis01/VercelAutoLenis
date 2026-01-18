"use client"

import { useState } from "react"
import useSWR from "swr"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { toast } from "sonner"
import { seoRedirectSchema, type SEORedirectInput } from "@/lib/validators/seo.validators"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { Spinner } from "@/components/ui/spinner"
import { Badge } from "@/components/ui/badge"
import { Plus, Pencil, Trash2, CheckCircle, XCircle } from "lucide-react"

const fetcher = (url: string) => fetch(url).then((res) => res.json())

interface Redirect {
  id: string
  fromPath: string
  toPath: string
  statusCode: number
  isWildcard: boolean
  enabled: boolean
  createdAt: string
}

export function RedirectsTab() {
  const [editingRedirect, setEditingRedirect] = useState<Redirect | null>(null)
  const [isCreating, setIsCreating] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const { data, isLoading, mutate } = useSWR<{ redirects: Redirect[] }>("/api/admin/seo/redirects", fetcher)

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
    reset,
  } = useForm<SEORedirectInput>({
    resolver: zodResolver(seoRedirectSchema),
    defaultValues: {
      statusCode: 301 as any,
      isWildcard: false,
      enabled: true,
    },
  })

  const statusCodeValue = watch("statusCode")
  const isWildcardValue = watch("isWildcard")
  const enabledValue = watch("enabled")

  const handleCreateNew = () => {
    setIsCreating(true)
    reset({
      fromPath: "",
      toPath: "",
      statusCode: 301 as any,
      isWildcard: false,
      enabled: true,
    })
  }

  const handleEdit = (redirect: Redirect) => {
    setEditingRedirect(redirect)
    setIsCreating(false)
    reset({
      id: redirect.id,
      fromPath: redirect.fromPath,
      toPath: redirect.toPath,
      statusCode: redirect.statusCode.toString() as any,
      isWildcard: redirect.isWildcard,
      enabled: redirect.enabled,
    })
  }

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this redirect?")) return

    try {
      const response = await fetch(`/api/admin/seo/redirects?id=${id}`, {
        method: "DELETE",
      })

      if (!response.ok) throw new Error("Failed to delete redirect")

      toast.success("Redirect deleted successfully")
      mutate()
    } catch (error) {
      toast.error("Failed to delete redirect")
      console.error(error)
    }
  }

  const onSubmit = async (data: SEORedirectInput) => {
    setIsSubmitting(true)
    try {
      const response = await fetch("/api/admin/seo/redirects", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      })

      if (!response.ok) throw new Error(`Failed to ${isCreating ? "create" : "update"} redirect`)

      toast.success(`Redirect ${isCreating ? "created" : "updated"} successfully`)
      setIsCreating(false)
      setEditingRedirect(null)
      mutate()
    } catch (error) {
      toast.error(`Failed to ${isCreating ? "create" : "update"} redirect`)
      console.error(error)
    } finally {
      setIsSubmitting(false)
    }
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Spinner className="w-8 h-8" />
      </div>
    )
  }

  const redirects = data?.redirects || []

  return (
    <>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>Redirects</CardTitle>
            <CardDescription>
              Manage URL redirects for your site
            </CardDescription>
          </div>
          <Button onClick={handleCreateNew}>
            <Plus className="mr-2" />
            Add Redirect
          </Button>
        </CardHeader>
        <CardContent>
          {redirects.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              No redirects configured
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>From Path</TableHead>
                  <TableHead>To Path</TableHead>
                  <TableHead>Status Code</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Enabled</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {redirects.map((redirect) => (
                  <TableRow key={redirect.id}>
                    <TableCell className="font-mono text-sm">{redirect.fromPath}</TableCell>
                    <TableCell className="font-mono text-sm max-w-xs truncate">{redirect.toPath}</TableCell>
                    <TableCell>
                      <Badge variant="outline">{redirect.statusCode}</Badge>
                    </TableCell>
                    <TableCell>
                      {redirect.isWildcard ? (
                        <Badge variant="secondary">Wildcard</Badge>
                      ) : (
                        <Badge variant="outline">Exact</Badge>
                      )}
                    </TableCell>
                    <TableCell>
                      {redirect.enabled ? (
                        <Badge variant="default" className="gap-1">
                          <CheckCircle className="w-3 h-3" />
                          Yes
                        </Badge>
                      ) : (
                        <Badge variant="secondary" className="gap-1">
                          <XCircle className="w-3 h-3" />
                          No
                        </Badge>
                      )}
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        <Button
                          variant="ghost"
                          size="icon-sm"
                          onClick={() => handleEdit(redirect)}
                        >
                          <Pencil className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon-sm"
                          onClick={() => handleDelete(redirect.id)}
                        >
                          <Trash2 className="w-4 h-4 text-destructive" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      <Dialog
        open={isCreating || !!editingRedirect}
        onOpenChange={() => {
          setIsCreating(false)
          setEditingRedirect(null)
        }}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{isCreating ? "Create" : "Edit"} Redirect</DialogTitle>
            <DialogDescription>
              {isCreating ? "Add a new URL redirect" : "Update redirect settings"}
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="fromPath">From Path</Label>
              <Input
                id="fromPath"
                {...register("fromPath")}
                placeholder="/old-page"
              />
              {errors.fromPath && (
                <p className="text-sm text-destructive">{errors.fromPath.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="toPath">To Path</Label>
              <Input
                id="toPath"
                {...register("toPath")}
                placeholder="/new-page or https://example.com"
              />
              {errors.toPath && (
                <p className="text-sm text-destructive">{errors.toPath.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="statusCode">Status Code</Label>
              <Select
                value={statusCodeValue?.toString()}
                onValueChange={(value) => setValue("statusCode", value as any)}
              >
                <SelectTrigger id="statusCode" className="w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="301">301 - Permanent</SelectItem>
                  <SelectItem value="302">302 - Temporary</SelectItem>
                  <SelectItem value="307">307 - Temporary (preserve method)</SelectItem>
                  <SelectItem value="308">308 - Permanent (preserve method)</SelectItem>
                </SelectContent>
              </Select>
              {errors.statusCode && (
                <p className="text-sm text-destructive">{errors.statusCode.message}</p>
              )}
            </div>

            <div className="flex items-center space-x-2">
              <Checkbox
                id="isWildcard"
                checked={isWildcardValue}
                onCheckedChange={(checked) => setValue("isWildcard", !!checked)}
              />
              <Label htmlFor="isWildcard" className="cursor-pointer">
                Wildcard redirect (use * in paths)
              </Label>
            </div>

            <div className="flex items-center space-x-2">
              <Checkbox
                id="enabled"
                checked={enabledValue}
                onCheckedChange={(checked) => setValue("enabled", !!checked)}
              />
              <Label htmlFor="enabled" className="cursor-pointer">
                Enabled
              </Label>
            </div>

            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  setIsCreating(false)
                  setEditingRedirect(null)
                }}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? (
                  <>
                    <Spinner className="mr-2" />
                    Saving...
                  </>
                ) : (
                  isCreating ? "Create" : "Save Changes"
                )}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </>
  )
}
