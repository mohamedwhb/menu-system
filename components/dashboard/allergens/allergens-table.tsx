"use client"

import { useMenu } from "@/contexts/menu-context"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Edit2, Trash2 } from "lucide-react"
import { toast } from "@/hooks/use-toast"

interface AllergensTableProps {
  onEdit: (id: string) => void
}

export function AllergensTable({ onEdit }: AllergensTableProps) {
  const { allergens, deleteAllergen, menuItems } = useMenu()

  const handleDelete = (id: string) => {
    // Überprüfen, ob das Allergen in Verwendung ist
    const inUse = menuItems.some((item) => item.allergens?.includes(id))

    if (inUse) {
      toast({
        title: "Allergen kann nicht gelöscht werden",
        description: "Dieses Allergen wird von mindestens einem Menüelement verwendet.",
        variant: "destructive",
      })
      return
    }

    deleteAllergen(id)
    toast({
      title: "Allergen gelöscht",
      description: "Das Allergen wurde erfolgreich gelöscht.",
    })
  }

  const getSeverityBadge = (severity: string) => {
    switch (severity) {
      case "low":
        return (
          <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
            Niedrig
          </Badge>
        )
      case "medium":
        return (
          <Badge variant="outline" className="bg-amber-50 text-amber-700 border-amber-200">
            Mittel
          </Badge>
        )
      case "high":
        return (
          <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200">
            Hoch
          </Badge>
        )
      default:
        return <Badge variant="outline">Unbekannt</Badge>
    }
  }

  return (
    <div className="border rounded-md">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Beschreibung</TableHead>
            <TableHead>Schweregrad</TableHead>
            <TableHead className="w-[100px]">Aktionen</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {allergens.length === 0 ? (
            <TableRow>
              <TableCell colSpan={4} className="text-center py-8 text-muted-foreground">
                Keine Allergene vorhanden
              </TableCell>
            </TableRow>
          ) : (
            allergens.map((allergen) => (
              <TableRow key={allergen.id}>
                <TableCell className="font-medium">{allergen.name}</TableCell>
                <TableCell>{allergen.description}</TableCell>
                <TableCell>{getSeverityBadge(allergen.severity)}</TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <Button variant="ghost" size="icon" onClick={() => onEdit(allergen.id)}>
                      <Edit2 className="h-4 w-4" />
                      <span className="sr-only">Bearbeiten</span>
                    </Button>
                    <Button variant="ghost" size="icon" onClick={() => handleDelete(allergen.id)}>
                      <Trash2 className="h-4 w-4" />
                      <span className="sr-only">Löschen</span>
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  )
}
