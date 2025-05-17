"use client"

import { useState } from "react"
import { useMenu } from "@/contexts/menu-context"
import { Button } from "@/components/ui/button"
import { PlusCircle } from "lucide-react"
import { AllergensHeader } from "@/components/dashboard/allergens/allergens-header"
import { AllergensTable } from "@/components/dashboard/allergens/allergens-table"
import { AddAllergenDialog } from "@/components/dashboard/allergens/add-allergen-dialog"
import { EditAllergenDialog } from "@/components/dashboard/allergens/edit-allergen-dialog"

export default function AllergensPage() {
  const { allergens } = useMenu()
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [selectedAllergen, setSelectedAllergen] = useState<string | null>(null)

  const handleEdit = (id: string) => {
    setSelectedAllergen(id)
    setIsEditDialogOpen(true)
  }

  return (
    <div className="flex flex-col h-full">
      <AllergensHeader />

      <div className="p-6 space-y-6">
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-semibold">Allergene und Inhaltsstoffe</h2>
          <Button onClick={() => setIsAddDialogOpen(true)}>
            <PlusCircle className="h-4 w-4 mr-2" />
            Neues Allergen
          </Button>
        </div>

        <AllergensTable onEdit={handleEdit} />
      </div>

      <AddAllergenDialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen} />

      {selectedAllergen && (
        <EditAllergenDialog allergenId={selectedAllergen} open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen} />
      )}
    </div>
  )
}
