"use client"

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Construction } from "lucide-react"

interface NotImplementedModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  featureName?: string
}

export function NotImplementedModal({
  open,
  onOpenChange,
  featureName = "This feature",
}: NotImplementedModalProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <div className="flex items-center justify-center w-12 h-12 rounded-full bg-yellow-100 mx-auto mb-4">
            <Construction className="h-6 w-6 text-yellow-600" />
          </div>
          <DialogTitle className="text-center">Coming Soon</DialogTitle>
          <DialogDescription className="text-center">
            {featureName} is not yet implemented. Our team is working on it and
            it will be available soon.
          </DialogDescription>
        </DialogHeader>
        <div className="flex justify-center mt-4">
          <Button onClick={() => onOpenChange(false)}>Got it</Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
