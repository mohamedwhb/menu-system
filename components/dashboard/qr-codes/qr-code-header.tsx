"use client"

import { useState } from "react"
import { PlusCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { CreateQrCodeDialog } from "@/components/dashboard/qr-codes/create-qr-code-dialog"

export function QrCodeHeader() {
  const [showCreateDialog, setShowCreateDialog] = useState(false)

  return (
    <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-[#1F1F1F]">QR-Code Verwaltung</h1>
        <p className="text-sm text-[#6B7280]">Erstellen und verwalten Sie QR-Codes für Ihre Tische</p>
      </div>

      <Button onClick={() => setShowCreateDialog(true)} className="mt-4 sm:mt-0">
        <PlusCircle className="mr-2 h-4 w-4" />
        Neuer QR-Code
      </Button>

      <CreateQrCodeDialog open={showCreateDialog} onOpenChange={setShowCreateDialog} />
    </div>
  )
}
