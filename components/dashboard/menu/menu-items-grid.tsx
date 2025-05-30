"use client"

import Image from "next/image"
import { Edit, MoreHorizontal, Star, StarOff, Eye, EyeOff, Trash2 } from "lucide-react"
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
import { useState } from "react"
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

interface MenuItemsGridProps {
  items: ReturnType<typeof useMenu>["menuItems"]
}

export function MenuItemsGrid({ items }: MenuItemsGridProps) {
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
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {items.map((item) => {
          // Hole die Kategorie für dieses Menüelement
          const category = getCategoryById(item.category)
          const isSelected = selectedItems.includes(item.id)

          return (
            <div
              key={item.id}
              className={`border rounded-lg overflow-hidden bg-white hover:shadow-md transition-shadow ${
                isSelected ? "ring-2 ring-primary ring-offset-2" : ""
              }`}
            >
              <div className="relative h-48 w-full bg-muted/30">
                <div className="absolute top-2 left-2 z-10">
                  <Checkbox
                    checked={isSelected}
                    onCheckedChange={() => toggleSelectItem(item.id)}
                    aria-label={`${item.name} auswählen`}
                    className="bg-white/90 border-gray-300"
                  />
                </div>

                {item.image ? (
                  <Image
                    src={item.image || "/placeholder.svg?height=192&width=384&query=food"}
                    alt={item.name}
                    fill
                    className="object-cover"
                    onError={(e) => {
                      // Fallback to placeholder if image fails to load
                      const target = e.target as HTMLImageElement
                      target.src = "/diverse-food-spread.png"
                    }}
                  />
                ) : (
                  <div className="absolute inset-0 flex items-center justify-center text-muted-foreground">
                    Kein Bild
                  </div>
                )}

                {item.featured && <Badge className="absolute top-2 left-8 bg-primary">Empfohlen</Badge>}

                {!item.available && (
                  <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                    <Badge variant="outline" className="bg-black/70 text-white border-white">
                      Nicht verfügbar
                    </Badge>
                  </div>
                )}

                <div className="absolute top-2 right-2 flex gap-1">
                  <Button
                    variant="outline"
                    size="icon"
                    className="h-8 w-8 bg-white/90 hover:bg-white border-transparent"
                    onClick={() => toggleFeatured(item.id)}
                  >
                    {item.featured ? (
                      <StarOff className="h-4 w-4 text-muted-foreground" />
                    ) : (
                      <Star className="h-4 w-4 text-muted-foreground" />
                    )}
                  </Button>

                  <Button
                    variant="outline"
                    size="icon"
                    className="h-8 w-8 bg-white/90 hover:bg-white border-transparent"
                    onClick={() => toggleAvailable(item.id)}
                  >
                    {item.available ? (
                      <EyeOff className="h-4 w-4 text-muted-foreground" />
                    ) : (
                      <Eye className="h-4 w-4 text-muted-foreground" />
                    )}
                  </Button>

                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button
                        variant="outline"
                        size="icon"
                        className="h-8 w-8 bg-white/90 hover:bg-white border-transparent"
                      >
                        <MoreHorizontal className="h-4 w-4 text-muted-foreground" />
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
              </div>

              <div className="p-4">
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="font-medium">{item.name}</h3>
                    <p className="text-sm text-muted-foreground line-clamp-2 mt-1">{item.description}</p>
                  </div>
                  <div className="font-medium">{item.price.toFixed(2)} €</div>
                </div>

                <div className="flex flex-wrap gap-1 mt-3">
                  {category && (
                    <Badge variant="outline" className="text-xs">
                      {category.name}
                    </Badge>
                  )}
                  {item.vegetarian && (
                    <Badge variant="outline" className="bg-green-50 text-green-600 border-green-200 text-xs">
                      Vegetarisch
                    </Badge>
                  )}
                  {item.vegan && (
                    <Badge variant="outline" className="bg-emerald-50 text-emerald-600 border-emerald-200 text-xs">
                      Vegan
                    </Badge>
                  )}
                  {item.glutenFree && (
                    <Badge variant="outline" className="bg-amber-50 text-amber-600 border-amber-200 text-xs">
                      Glutenfrei
                    </Badge>
                  )}
                </div>
              </div>
            </div>
          )
        })}
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
