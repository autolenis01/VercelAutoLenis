"use client"

import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Construction } from "lucide-react"

interface NotImplementedModalProps {
  feature: string
  description?: string
  isOpen: boolean
  onClose: () => void
}

export function NotImplementedModal({
  feature,
  description = "This feature is coming soon. We're working hard to bring it to you.",
  isOpen,
  onClose,
}: NotImplementedModalProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <div className="mx-auto w-12 h-12 rounded-full bg-orange-100 flex items-center justify-center mb-4">
            <Construction className="h-6 w-6 text-orange-600" />
          </div>
          <DialogTitle className="text-center">{feature}</DialogTitle>
          <DialogDescription className="text-center">{description}</DialogDescription>
        </DialogHeader>
        <div className="flex justify-center mt-4">
          <Button onClick={onClose} className="w-full sm:w-auto">
            Got it
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
