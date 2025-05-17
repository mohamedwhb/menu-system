"use client"

import { useState } from "react"
import { Edit, MoreHorizontal, Star, Eye, EyeOff, ArrowUpDown, Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Checkbox } from "@/components/ui/checkbox"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { EditMenuItemDialog } from "@/components/dashboard/menu/edit-menu-item-dialog"
import { useMenu } from "@/contexts/menu-context"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"

interface MenuItemsTableProps {
  items: ReturnType<typeof useMenu>["menuItems"]
  onSort?: (key: string) => void
  sortConfig?: { key: string; direction: "asc" | "desc" } | null
}

export function MenuItemsTable({ items, onSort, sortConfig }: MenuItemsTableProps) {
  const { toggleFeatured, toggleAvailable, deleteMenuItem, getCategoryById } = useMenu()
  const [editingItem, setEditingItem] = useState<(typeof items)[0] | null>(null)
  const [itemToDelete, setItemToDelete] = useState<string | null>(null)
  const [selectedItems, setSelectedItems] = useState<string[]>([])

  // Funktion zum Löschen eines Menüelements
  const handleDelete = () => {
    if (itemToDelete) {
      deleteMenuItem(itemToDelete)
      setItemToDelete(null)
    }
  }

  // Funktion zum Auswählen/Abwählen aller Elemente
  const toggleSelectAll = () => {
    if (selectedItems.length === items.length) {
      setSelectedItems([])
    } else {
      setSelectedItems(items.map((item) => item.id))
    }
  }

  // Funktion zum Auswählen/Abwählen eines Elements
  const toggleSelectItem = (id: string) => {
    if (selectedItems.includes(id)) {
      setSelectedItems(selectedItems.filter((itemId) => itemId !== id))
    } else {
      setSelectedItems([...selectedItems, id])
    }
  }

  // Leerer Zustand
  if (items.length === 0) {
    return (
      <div className="text-center py-8 border rounded-md bg-muted/10">
        <p className="text-muted-foreground">Keine Menüelemente gefunden</p>
        <p className="text-sm text-muted-foreground mt-1">
          Passen Sie Ihre Filter an oder fügen Sie neue Menüelemente hinzu
        </p>
      </div>
    )
  }

  return (
    <>
      <div className="rounded-md border overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full caption-bottom text-sm">
            <thead className="border-b bg-muted/30">
              <tr>
                <th className="h-12 w-12 px-4 text-left align-middle">
                  <Checkbox
                    checked={selectedItems.length === items.length && items.length > 0}
                    onCheckedChange={toggleSelectAll}
                    aria-label="Alle auswählen"
                  />
                </th>
                <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">
                  <Button
                    variant="ghost"
                    onClick={() => onSort?.("name")}
                    className="flex items-center gap-1 hover:bg-transparent -ml-3"
                  >
                    Name
                    {sortConfig?.key === "name" && (
                      <ArrowUpDown
                        className={`h-4 w-4 ${sortConfig.direction === "asc" ? "rotate-0" : "rotate-180"}`}
                      />
                    )}
                  </Button>
                </th>
                <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">
                  <Button
                    variant="ghost"
                    onClick={() => onSort?.("category")}
                    className="flex items-center gap-1 hover:bg-transparent -ml-3"
                  >
                    Kategorie
                    {sortConfig?.key === "category" && (
                      <ArrowUpDown
                        className={`h-4 w-4 ${sortConfig.direction === "asc" ? "rotate-0" : "rotate-180"}`}
                      />
                    )}
                  </Button>
                </th>
                <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Diät-Optionen</th>
                <th className="h-12 px-4 text-right align-middle font-medium text-muted-foreground">
                  <Button
                    variant="ghost"
                    onClick={() => onSort?.("price")}
                    className="flex items-center gap-1 hover:bg-transparent -ml-3"
                  >
                    Preis
                    {sortConfig?.key === "price" && (
                      <ArrowUpDown
                        className={`h-4 w-4 ${sortConfig.direction === "asc" ? "rotate-0" : "rotate-180"}`}
                      />
                    )}
                  </Button>
                </th>
                <th className="h-12 px-4 text-center align-middle font-medium text-muted-foreground">Status</th>
                <th className="h-12 w-[100px] px-4 align-middle font-medium text-muted-foreground">Aktionen</th>
              </tr>
            </thead>
            <tbody>
              {items.map((item) => {
                // Hole die Kategorie für dieses Menüelement
                const category = getCategoryById(item.category)
                const isSelected = selectedItems.includes(item.id)

                return (
                  <tr
                    key={item.id}
                    className={`border-b hover:bg-muted/20 transition-colors ${isSelected ? "bg-primary/5" : ""}`}
                  >
                    <td className="p-4 align-middle">
                      <Checkbox
                        checked={isSelected}
                        onCheckedChange={() => toggleSelectItem(item.id)}
                        aria-label={`${item.name} auswählen`}
                      />
                    </td>
                    <td className="p-4 align-middle font-medium">
                      {item.name}
                      <div className="text-xs text-muted-foreground line-clamp-1 mt-1">{item.description}</div>
                    </td>
                    <td className="p-4 align-middle">
                      {category && (
                        <Badge variant="outline" className="text-xs">
                          {category.name}
                        </Badge>
                      )}
                    </td>
                    <td className="p-4 align-middle">
                      <div className="flex flex-wrap gap-1">
                        {item.vegetarian && (
                          <Badge variant="outline" className="bg-green-50 text-green-600 border-green-200 text-xs">
                            Vegetarisch
                          </Badge>
                        )}
                        {item.vegan && (
                          <Badge
                            variant="outline"
                            className="bg-emerald-50 text-emerald-600 border-emerald-200 text-xs"
                          >
                            Vegan
                          </Badge>
                        )}
                        {item.glutenFree && (
                          <Badge variant="outline" className="bg-amber-50 text-amber-600 border-amber-200 text-xs">
                            Glutenfrei
                          </Badge>
                        )}
                      </div>
                    </td>
                    <td className="p-4 align-middle text-right font-medium">{item.price.toFixed(2)} €</td>
                    <td className="p-4 align-middle">
                      <div className="flex items-center justify-center gap-2">
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8"
                          onClick={() => toggleFeatured(item.id)}
                          title={item.featured ? "Nicht mehr empfehlen" : "Als empfohlen markieren"}
                        >
                          {item.featured ? (
                            <Star className="h-4 w-4 text-amber-500 fill-amber-500" />
                          ) : (
                            <Star className="h-4 w-4 text-muted-foreground" />
                          )}
                        </Button>

                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8"
                          onClick={() => toggleAvailable(item.id)}
                          title={item.available ? "Als nicht verfügbar markieren" : "Als verfügbar markieren"}
                        >
                          {item.available ? (
                            <Eye className="h-4 w-4 text-green-500" />
                          ) : (
                            <EyeOff className="h-4 w-4 text-red-500" />
                          )}
                        </Button>
                      </div>
                    </td>
                    <td className="p-4 align-middle">
                      <div className="flex items-center justify-end">
                        <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => setEditingItem(item)}>
                          <Edit className="h-4 w-4" />
                          <span className="sr-only">Bearbeiten</span>
                        </Button>

                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon" className="h-8 w-8">
                              <MoreHorizontal className="h-4 w-4" />
                              <span className="sr-only">Aktionen</span>
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end" className="w-[160px]">
                            <DropdownMenuItem onClick={() => setEditingItem(item)}>
                              <Edit className="mr-2 h-4 w-4" />
                              Bearbeiten
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem className="text-red-500" onClick={() => setItemToDelete(item.id)}>
                              <Trash2 className="mr-2 h-4 w-4" />
                              Löschen
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </div>

      {editingItem && (
        <EditMenuItemDialog
          item={editingItem}
          open={!!editingItem}
          onOpenChange={(open) => !open && setEditingItem(null)}
        />
      )}

      {/* Bestätigungsdialog zum Löschen */}
      <AlertDialog open={!!itemToDelete} onOpenChange={(open) => !open && setItemToDelete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Menüelement löschen</AlertDialogTitle>
            <AlertDialogDescription>
              Sind Sie sicher, dass Sie dieses Menüelement löschen möchten? Diese Aktion kann nicht rückgängig gemacht
              werden.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Abbrechen</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} className="bg-red-600 hover:bg-red-700">
              Löschen
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}
