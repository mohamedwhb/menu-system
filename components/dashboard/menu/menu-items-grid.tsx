"use client"

import Image from "next/image"
import { Edit, MoreHorizontal, Star, StarOff, Eye, EyeOff, Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
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

export function MenuItemsGrid() {
  const { menuItems, toggleFeatured, toggleAvailable, deleteMenuItem, getCategoryById } = useMenu()
  const [editingItem, setEditingItem] = useState<(typeof menuItems)[0] | null>(null)
  const [itemToDelete, setItemToDelete] = useState<string | null>(null)

  // Funktion zum Löschen eines Menüelements
  const handleDelete = () => {
    if (itemToDelete) {
      deleteMenuItem(itemToDelete)
      setItemToDelete(null)
    }
  }

  return (
    <>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {menuItems.map((item) => {
          // Hole die Kategorie für dieses Menüelement
          const category = getCategoryById(item.category)

          return (
            <div
              key={item.id}
              className="border border-[#EAEAEA] rounded-lg overflow-hidden bg-white hover:shadow-md transition-shadow"
            >
              <div className="relative h-48 w-full bg-[#F7F7F7]">
                {item.image ? (
                  <Image src={item.image || "/placeholder.svg"} alt={item.name} fill className="object-cover" />
                ) : (
                  <div className="absolute inset-0 flex items-center justify-center text-[#6B7280]">Kein Bild</div>
                )}

                {item.featured && <Badge className="absolute top-2 left-2 bg-[#006AFF]">Empfohlen</Badge>}

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
                      <StarOff className="h-4 w-4 text-[#6B7280]" />
                    ) : (
                      <Star className="h-4 w-4 text-[#6B7280]" />
                    )}
                  </Button>

                  <Button
                    variant="outline"
                    size="icon"
                    className="h-8 w-8 bg-white/90 hover:bg-white border-transparent"
                    onClick={() => toggleAvailable(item.id)}
                  >
                    {item.available ? (
                      <EyeOff className="h-4 w-4 text-[#6B7280]" />
                    ) : (
                      <Eye className="h-4 w-4 text-[#6B7280]" />
                    )}
                  </Button>

                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button
                        variant="outline"
                        size="icon"
                        className="h-8 w-8 bg-white/90 hover:bg-white border-transparent"
                      >
                        <MoreHorizontal className="h-4 w-4 text-[#6B7280]" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-[160px] bg-white border-[#EAEAEA]">
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
                    <h3 className="font-medium text-[#1F1F1F]">{item.name}</h3>
                    <p className="text-sm text-[#6B7280] line-clamp-2 mt-1">{item.description}</p>
                  </div>
                  <div className="text-[#1F1F1F] font-medium">{item.price.toFixed(2)} €</div>
                </div>

                <div className="flex flex-wrap gap-1 mt-3">
                  {category && (
                    <Badge variant="outline" className="text-xs">
                      {category.name}
                    </Badge>
                  )}
                  {item.vegetarian && (
                    <Badge variant="outline" className="bg-[#F0FDF4] text-[#16A34A] border-[#DCFCE7] text-xs">
                      Vegetarisch
                    </Badge>
                  )}
                  {item.vegan && (
                    <Badge variant="outline" className="bg-[#ECFDF5] text-[#059669] border-[#D1FAE5] text-xs">
                      Vegan
                    </Badge>
                  )}
                  {item.glutenFree && (
                    <Badge variant="outline" className="bg-[#FEF3C7] text-[#D97706] border-[#FDE68A] text-xs">
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
