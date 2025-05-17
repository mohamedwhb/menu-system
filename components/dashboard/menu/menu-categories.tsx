"use client"

import { useState } from "react"
import { useMenu } from "@/contexts/menu-context"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Edit, Plus, Check, Trash2, GripVertical } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
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
import { cn } from "@/lib/utils"

interface MenuCategoriesProps {
  selectedCategory?: string
  onCategorySelect?: (categoryId: string) => void
}

export function MenuCategories({ selectedCategory = "all", onCategorySelect }: MenuCategoriesProps) {
  const { categories, addCategory, updateCategory, deleteCategory, getItemCountByCategory } = useMenu()
  const [isEditing, setIsEditing] = useState(false)
  const [showAddDialog, setShowAddDialog] = useState(false)
  const [editingCategory, setEditingCategory] = useState<(typeof categories)[0] | null>(null)
  const [categoryToDelete, setCategoryToDelete] = useState<string | null>(null)

  // Neue Kategorie-Formularfelder
  const [newCategoryName, setNewCategoryName] = useState("")
  const [newCategoryDescription, setNewCategoryDescription] = useState("")
  const [newCategoryActive, setNewCategoryActive] = useState(true)

  // Bearbeitungs-Formularfelder
  const [editName, setEditName] = useState("")
  const [editDescription, setEditDescription] = useState("")
  const [editActive, setEditActive] = useState(true)

  // Aktive Kategorien filtern und sortieren
  const sortedCategories = [...categories].sort((a, b) => a.order - b.order)

  const handleAddCategory = () => {
    if (newCategoryName.trim()) {
      addCategory({
        name: newCategoryName.trim(),
        description: newCategoryDescription.trim(),
        active: newCategoryActive,
        order: categories.length, // Neue Kategorie am Ende hinzufügen
      })

      // Formular zurücksetzen
      setNewCategoryName("")
      setNewCategoryDescription("")
      setNewCategoryActive(true)
      setShowAddDialog(false)
    }
  }

  const handleEditCategory = () => {
    if (editingCategory && editName.trim()) {
      updateCategory(editingCategory.id, {
        name: editName.trim(),
        description: editDescription.trim(),
        active: editActive,
      })

      // Bearbeitungsmodus beenden
      setEditingCategory(null)
    }
  }

  const handleDeleteCategory = () => {
    if (categoryToDelete) {
      deleteCategory(categoryToDelete)
      setCategoryToDelete(null)
    }
  }

  const openEditDialog = (category: (typeof categories)[0]) => {
    setEditingCategory(category)
    setEditName(category.name)
    setEditDescription(category.description || "")
    setEditActive(category.active)
  }

  const handleCategoryClick = (categoryId: string) => {
    if (onCategorySelect && !isEditing) {
      onCategorySelect(categoryId)
    }
  }

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-medium">Kategorien</h2>
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setIsEditing(!isEditing)}
            className={isEditing ? "bg-muted" : ""}
          >
            {isEditing ? (
              <>
                <Check className="h-4 w-4 mr-1" />
                Fertig
              </>
            ) : (
              <>
                <Edit className="h-4 w-4 mr-1" />
                Bearbeiten
              </>
            )}
          </Button>
          <Button variant="outline" size="sm" onClick={() => setShowAddDialog(true)}>
            <Plus className="h-4 w-4 mr-1" />
            Hinzufügen
          </Button>
        </div>
      </div>

      <div className="flex flex-wrap gap-2">
        {sortedCategories.map((category) => {
          // Anzahl der Menüelemente in dieser Kategorie
          const itemCount = getItemCountByCategory(category.id)
          const isSelected = selectedCategory === category.id

          return (
            <div
              key={category.id}
              className={cn(
                "group flex items-center gap-1 rounded-full border px-3 py-1 text-sm",
                category.active ? "bg-white" : "bg-muted text-muted-foreground",
                isEditing && "pr-1",
                isSelected && "bg-primary/10 border-primary/30 text-primary font-medium",
                !isEditing && "cursor-pointer hover:bg-primary/5 hover:border-primary/20",
              )}
              onClick={() => handleCategoryClick(category.id)}
            >
              {isEditing && <GripVertical className="h-3 w-3 text-muted-foreground cursor-move" />}
              <span>{category.name}</span>
              {itemCount > 0 && (
                <Badge variant={isSelected ? "default" : "secondary"} className="ml-1 h-5 min-w-5 px-1 rounded-full">
                  {itemCount}
                </Badge>
              )}
              {isEditing && (
                <div className="flex gap-1 ml-1">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-5 w-5 rounded-full p-0 opacity-0 group-hover:opacity-100 transition-opacity"
                    onClick={(e) => {
                      e.stopPropagation()
                      openEditDialog(category)
                    }}
                  >
                    <Edit className="h-3 w-3" />
                    <span className="sr-only">Bearbeiten</span>
                  </Button>
                  {category.id !== "all" && category.id !== "uncategorized" && (
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-5 w-5 rounded-full p-0 opacity-0 group-hover:opacity-100 transition-opacity text-red-500 hover:text-red-600 hover:bg-red-50"
                      onClick={(e) => {
                        e.stopPropagation()
                        setCategoryToDelete(category.id)
                      }}
                    >
                      <Trash2 className="h-3 w-3" />
                      <span className="sr-only">Löschen</span>
                    </Button>
                  )}
                </div>
              )}
            </div>
          )
        })}
      </div>

      {/* Dialog zum Hinzufügen einer neuen Kategorie */}
      <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Neue Kategorie hinzufügen</DialogTitle>
            <DialogDescription>Erstellen Sie eine neue Kategorie für Ihre Menüelemente.</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="name">Name</Label>
              <Input
                id="name"
                value={newCategoryName}
                onChange={(e) => setNewCategoryName(e.target.value)}
                placeholder="z.B. Desserts"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="description">Beschreibung (optional)</Label>
              <Textarea
                id="description"
                value={newCategoryDescription}
                onChange={(e) => setNewCategoryDescription(e.target.value)}
                placeholder="Kurze Beschreibung der Kategorie"
                rows={3}
              />
            </div>
            <div className="flex items-center justify-between">
              <Label htmlFor="active">Aktiv</Label>
              <Switch id="active" checked={newCategoryActive} onCheckedChange={setNewCategoryActive} />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowAddDialog(false)}>
              Abbrechen
            </Button>
            <Button onClick={handleAddCategory} disabled={!newCategoryName.trim()}>
              Hinzufügen
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Dialog zum Bearbeiten einer Kategorie */}
      <Dialog open={!!editingCategory} onOpenChange={(open) => !open && setEditingCategory(null)}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Kategorie bearbeiten</DialogTitle>
            <DialogDescription>Ändern Sie die Details dieser Kategorie.</DialogDescription>
          </DialogHeader>
          {editingCategory && (
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="edit-name">Name</Label>
                <Input
                  id="edit-name"
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                  placeholder="z.B. Desserts"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="edit-description">Beschreibung (optional)</Label>
                <Textarea
                  id="edit-description"
                  value={editDescription}
                  onChange={(e) => setEditDescription(e.target.value)}
                  placeholder="Kurze Beschreibung der Kategorie"
                  rows={3}
                />
              </div>
              <div className="flex items-center justify-between">
                <Label htmlFor="edit-active">Aktiv</Label>
                <Switch id="edit-active" checked={editActive} onCheckedChange={setEditActive} />
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setEditingCategory(null)}>
              Abbrechen
            </Button>
            <Button onClick={handleEditCategory} disabled={!editName.trim()}>
              Speichern
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Bestätigungsdialog zum Löschen */}
      <AlertDialog open={!!categoryToDelete} onOpenChange={(open) => !open && setCategoryToDelete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Kategorie löschen</AlertDialogTitle>
            <AlertDialogDescription>
              Sind Sie sicher, dass Sie diese Kategorie löschen möchten? Alle Menüelemente in dieser Kategorie werden
              als "Nicht kategorisiert" markiert.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Abbrechen</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteCategory} className="bg-red-600 hover:bg-red-700">
              Löschen
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
