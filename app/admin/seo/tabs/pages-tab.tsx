"use client"

import { useState } from "react"
import useSWR from "swr"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { toast } from "sonner"
import { seoPageSchema, type SEOPageInput } from "@/lib/validators/seo.validators"
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
import { Pencil, CheckCircle, XCircle } from "lucide-react"
import { format } from "date-fns"

const fetcher = (url: string) => fetch(url).then((res) => res.json())

interface SEOPage {
  pageKey: string
  title: string | null
  description: string | null
  keywords: string | null
  canonicalUrl: string | null
  ogTitle: string | null
  ogDescription: string | null
  ogImageUrl: string | null
  robotsRule: string
  indexable: boolean
  updatedAt: string
}

export function PagesTab() {
  const [editingPage, setEditingPage] = useState<SEOPage | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const { data, isLoading, mutate } = useSWR<{ pages: SEOPage[] }>("/api/seo/pages", fetcher)

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
    reset,
  } = useForm<SEOPageInput>({
    resolver: zodResolver(seoPageSchema),
  })

  const robotsValue = watch("robotsRule")
  const indexableValue = watch("indexable")

  const handleEditPage = (page: SEOPage) => {
    setEditingPage(page)
    reset({
      pageKey: page.pageKey,
      title: page.title || "",
      description: page.description || "",
      keywords: page.keywords || "",
      canonicalUrl: page.canonicalUrl || "",
      ogTitle: page.ogTitle || "",
      ogDescription: page.ogDescription || "",
      ogImageUrl: page.ogImageUrl || "",
      robotsRule: page.robotsRule as any,
      indexable: page.indexable,
    })
  }

  const onSubmit = async (data: SEOPageInput) => {
    if (!editingPage) return

    setIsSubmitting(true)
    try {
      const response = await fetch(`/api/seo/pages/${editingPage.pageKey}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      })

      if (!response.ok) throw new Error("Failed to update page")

      toast.success("Page metadata updated successfully")
      setEditingPage(null)
      mutate()
    } catch (error) {
      toast.error("Failed to update page metadata")
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

  const pages = data?.pages || []

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle>Page Metadata</CardTitle>
          <CardDescription>
            Manage SEO metadata for all pages on your site
          </CardDescription>
        </CardHeader>
        <CardContent>
          {pages.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              No pages found
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Page Key</TableHead>
                  <TableHead>Title</TableHead>
                  <TableHead>Description</TableHead>
                  <TableHead>Indexable</TableHead>
                  <TableHead>Last Updated</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {pages.map((page) => (
                  <TableRow
                    key={page.pageKey}
                    className="cursor-pointer hover:bg-muted/50"
                    onClick={() => handleEditPage(page)}
                  >
                    <TableCell className="font-mono text-sm">{page.pageKey}</TableCell>
                    <TableCell className="max-w-xs truncate">
                      {page.title || <span className="text-muted-foreground">No title</span>}
                    </TableCell>
                    <TableCell className="max-w-xs truncate">
                      {page.description || <span className="text-muted-foreground">No description</span>}
                    </TableCell>
                    <TableCell>
                      {page.indexable ? (
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
                      {format(new Date(page.updatedAt), "MMM d, yyyy")}
                    </TableCell>
                    <TableCell>
                      <Button
                        variant="ghost"
                        size="icon-sm"
                        onClick={(e) => {
                          e.stopPropagation()
                          handleEditPage(page)
                        }}
                      >
                        <Pencil className="w-4 h-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      <Dialog open={!!editingPage} onOpenChange={() => setEditingPage(null)}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Edit Page Metadata</DialogTitle>
            <DialogDescription>
              Update SEO metadata for {editingPage?.pageKey}
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="title">Title</Label>
              <Input id="title" {...register("title")} placeholder="Page title" />
              {errors.title && (
                <p className="text-sm text-destructive">{errors.title.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Input id="description" {...register("description")} placeholder="Page description" />
              {errors.description && (
                <p className="text-sm text-destructive">{errors.description.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="keywords">Keywords</Label>
              <Input id="keywords" {...register("keywords")} placeholder="keyword1, keyword2, keyword3" />
              {errors.keywords && (
                <p className="text-sm text-destructive">{errors.keywords.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="canonicalUrl">Canonical URL</Label>
              <Input id="canonicalUrl" {...register("canonicalUrl")} placeholder="https://example.com/page" />
              {errors.canonicalUrl && (
                <p className="text-sm text-destructive">{errors.canonicalUrl.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="ogTitle">OG Title</Label>
              <Input id="ogTitle" {...register("ogTitle")} placeholder="Open Graph title" />
              {errors.ogTitle && (
                <p className="text-sm text-destructive">{errors.ogTitle.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="ogDescription">OG Description</Label>
              <Input id="ogDescription" {...register("ogDescription")} placeholder="Open Graph description" />
              {errors.ogDescription && (
                <p className="text-sm text-destructive">{errors.ogDescription.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="ogImageUrl">OG Image URL</Label>
              <Input id="ogImageUrl" {...register("ogImageUrl")} placeholder="https://example.com/og-image.jpg" />
              {errors.ogImageUrl && (
                <p className="text-sm text-destructive">{errors.ogImageUrl.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="robotsRule">Robots Rule</Label>
              <Select
                value={robotsValue}
                onValueChange={(value) => setValue("robotsRule", value as any)}
              >
                <SelectTrigger id="robotsRule" className="w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="index,follow">index,follow</SelectItem>
                  <SelectItem value="noindex,nofollow">noindex,nofollow</SelectItem>
                  <SelectItem value="index,nofollow">index,nofollow</SelectItem>
                  <SelectItem value="noindex,follow">noindex,follow</SelectItem>
                </SelectContent>
              </Select>
              {errors.robotsRule && (
                <p className="text-sm text-destructive">{errors.robotsRule.message}</p>
              )}
            </div>

            <div className="flex items-center space-x-2">
              <Checkbox
                id="indexable"
                checked={indexableValue}
                onCheckedChange={(checked) => setValue("indexable", !!checked)}
              />
              <Label htmlFor="indexable" className="cursor-pointer">
                Indexable (allow search engines to index this page)
              </Label>
            </div>

            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setEditingPage(null)}>
                Cancel
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? (
                  <>
                    <Spinner className="mr-2" />
                    Saving...
                  </>
                ) : (
                  "Save Changes"
                )}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </>
  )
}
