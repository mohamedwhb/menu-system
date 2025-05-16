"use client"

import { PlusCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useState } from "react"
import { AddMenuItemDialog } from "@/components/dashboard/menu/add-menu-item-dialog"

export function MenuHeader() {
  const [showAddDialog, setShowAddDialog] = useState(false)

  return (
    <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-[#1F1F1F]">Menü-Verwaltung</h1>
        <p className="text-sm text-[#6B7280]">Verwalten Sie Ihre Speisekarte und Kategorien</p>
      </div>

      <Button onClick={() => setShowAddDialog(true)} className="mt-4 sm:mt-0">
        <PlusCircle className="mr-2 h-4 w-4" />
        Neues Gericht
      </Button>

      <AddMenuItemDialog open={showAddDialog} onOpenChange={setShowAddDialog} />
    </div>
  )
}
