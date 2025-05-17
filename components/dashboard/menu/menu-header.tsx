"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { PlusCircle } from "lucide-react"
import { AddMenuItemDialog } from "@/components/dashboard/menu/add-menu-item-dialog"

export function MenuHeader() {
  const [showAddDialog, setShowAddDialog] = useState(false)

  return (
    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Speisekarte</h1>
        <p className="text-muted-foreground">
          Verwalten Sie Ihre Speisekarte und passen Sie Kategorien, Preise und Verfügbarkeit an.
        </p>
      </div>
      <Button onClick={() => setShowAddDialog(true)} className="shrink-0">
        <PlusCircle className="mr-2 h-4 w-4" />
        Gericht hinzufügen
      </Button>

      <AddMenuItemDialog open={showAddDialog} onOpenChange={setShowAddDialog} />
    </div>
  )
}
