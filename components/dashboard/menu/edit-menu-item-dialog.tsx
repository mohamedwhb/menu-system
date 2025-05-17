"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Checkbox } from "@/components/ui/checkbox"
import { useMenu, type MenuItem } from "@/contexts/menu-context"
import { Badge } from "@/components/ui/badge"
import { X } from "lucide-react"

interface EditMenuItemDialogProps {
  item: MenuItem
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function EditMenuItemDialog({ item, open, onOpenChange }: EditMenuItemDialogProps) {
  const { updateMenuItem, allergens, categories } = useMenu()
  const [name, setName] = useState(item.name)
  const [description, setDescription] = useState(item.description || "")
  const [price, setPrice] = useState(item.price.toString())
  const [category, setCategory] = useState(item.category || "")
  const [isVegetarian, setIsVegetarian] = useState(item.vegetarian || false)
  const [isVegan, setIsVegan] = useState(item.vegan || false)
  const [isGlutenFree, setIsGlutenFree] = useState(item.glutenFree || false)
  const [isFeatured, setIsFeatured] = useState(item.featured || false)
  const [isAvailable, setIsAvailable] = useState(item.available !== false) // Default to true if undefined
  const [selectedAllergens, setSelectedAllergens] = useState<string[]>(item.allergens || [])
  const [ingredients, setIngredients] = useState<string[]>(item.ingredients || [])
  const [newIngredient, setNewIngredient] = useState("")

  // Update form when item changes
  useEffect(() => {
    setName(item.name)
    setDescription(item.description || "")
    setPrice(item.price.toString())
    setCategory(item.category || "")
    setIsVegetarian(item.vegetarian || false)
    setIsVegan(item.vegan || false)
    setIsGlutenFree(item.glutenFree || false)
    setIsFeatured(item.featured || false)
    setIsAvailable(item.available !== false)
    setSelectedAllergens(item.allergens || [])
    setIngredients(item.ingredients || [])
  }, [item])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    // Update the menu item
    updateMenuItem(item.id, {
      name,
      description,
      price: Number.parseFloat(price),
      category: category || "uncategorized",
      vegetarian: isVegetarian,
      vegan: isVegan,
      glutenFree: isGlutenFree,
      featured: isFeatured,
      available: isAvailable,
      allergens: selectedAllergens.length > 0 ? selectedAllergens : undefined,
      ingredients: ingredients.length > 0 ? ingredients : undefined,
    })

    onOpenChange(false)
  }

  const toggleAllergen = (allergenId: string) => {
    setSelectedAllergens((prev) =>
      prev.includes(allergenId) ? prev.filter((id) => id !== allergenId) : [...prev, allergenId],
    )
  }

  const addIngredient = () => {
    if (newIngredient.trim() && !ingredients.includes(newIngredient.trim())) {
      setIngredients((prev) => [...prev, newIngredient.trim()])
      setNewIngredient("")
    }
  }

  const removeIngredient = (ingredient: string) => {
    setIngredients((prev) => prev.filter((item) => item !== ingredient))
  }

  // Filtere aktive Kategorien und sortiere sie nach Reihenfolge
  const activeCategories = categories
    .filter((cat) => cat.active && cat.id !== "all" && cat.id !== "uncategorized")
    .sort((a, b) => a.order - b.order)

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px] bg-white max-h-[90vh] overflow-y-auto">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>Gericht bearbeiten</DialogTitle>
            <DialogDescription>Ändern Sie die Details dieses Gerichts.</DialogDescription>
          </DialogHeader>

          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="edit-name">Name</Label>
              <Input id="edit-name" value={name} onChange={(e) => setName(e.target.value)} required />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="edit-description">Beschreibung</Label>
              <Textarea
                id="edit-description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="resize-none"
                rows={3}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="edit-price">Preis (€)</Label>
                <Input
                  id="edit-price"
                  type="number"
                  step="0.01"
                  min="0"
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  required
                />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="edit-category">Kategorie</Label>
                <Select value={category} onValueChange={setCategory}>
                  <SelectTrigger id="edit-category">
                    <SelectValue placeholder="Kategorie auswählen" />
                  </SelectTrigger>
                  <SelectContent>
                    {activeCategories.map((cat) => (
                      <SelectItem key={cat.id} value={cat.id}>
                        {cat.name}
                      </SelectItem>
                    ))}
                    <SelectItem value="uncategorized">Nicht kategorisiert</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid gap-2">
              <Label>Aktuelles Bild</Label>
              {item.image ? (
                <div className="relative h-32 rounded-md overflow-hidden">
                  <img src={item.image || "/placeholder.svg"} alt={item.name} className="object-cover w-full h-full" />
                </div>
              ) : (
                <div className="h-32 rounded-md bg-[#F7F7F7] flex items-center justify-center text-[#6B7280]">
                  Kein Bild
                </div>
              )}
            </div>

            <div className="grid gap-2">
              <Label>Neues Bild (optional)</Label>
              <Input type="file" accept="image/*" />
            </div>

            <div className="grid gap-2">
              <Label>Diät-Optionen</Label>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="edit-vegetarian" className="cursor-pointer">
                    Vegetarisch
                  </Label>
                  <Switch id="edit-vegetarian" checked={isVegetarian} onCheckedChange={setIsVegetarian} />
                </div>

                <div className="flex items-center justify-between">
                  <Label htmlFor="edit-vegan" className="cursor-pointer">
                    Vegan
                  </Label>
                  <Switch id="edit-vegan" checked={isVegan} onCheckedChange={setIsVegan} />
                </div>

                <div className="flex items-center justify-between">
                  <Label htmlFor="edit-glutenFree" className="cursor-pointer">
                    Glutenfrei
                  </Label>
                  <Switch id="edit-glutenFree" checked={isGlutenFree} onCheckedChange={setIsGlutenFree} />
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="edit-featured" className="cursor-pointer">
                  Als empfohlen markieren
                </Label>
                <Switch id="edit-featured" checked={isFeatured} onCheckedChange={setIsFeatured} />
              </div>

              <div className="flex items-center justify-between">
                <Label htmlFor="edit-available" className="cursor-pointer">
                  Verfügbar
                </Label>
                <Switch id="edit-available" checked={isAvailable} onCheckedChange={setIsAvailable} />
              </div>
            </div>

            {/* Allergene */}
            <div className="grid gap-2">
              <Label>Allergene</Label>
              <div className="border rounded-md p-3 space-y-2">
                {allergens.length === 0 ? (
                  <p className="text-sm text-muted-foreground">Keine Allergene verfügbar</p>
                ) : (
                  <div className="grid grid-cols-2 gap-2">
                    {allergens.map((allergen) => (
                      <div key={allergen.id} className="flex items-center space-x-2">
                        <Checkbox
                          id={`edit-allergen-${allergen.id}`}
                          checked={selectedAllergens.includes(allergen.id)}
                          onCheckedChange={() => toggleAllergen(allergen.id)}
                        />
                        <Label htmlFor={`edit-allergen-${allergen.id}`} className="cursor-pointer text-sm">
                          {allergen.name}
                        </Label>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Inhaltsstoffe */}
            <div className="grid gap-2">
              <Label>Inhaltsstoffe</Label>
              <div className="flex gap-2">
                <Input
                  value={newIngredient}
                  onChange={(e) => setNewIngredient(e.target.value)}
                  placeholder="Neuer Inhaltsstoff"
                  className="flex-1"
                />
                <Button type="button" onClick={addIngredient} variant="outline">
                  Hinzufügen
                </Button>
              </div>
              <div className="flex flex-wrap gap-2 mt-2">
                {ingredients.map((ingredient) => (
                  <Badge key={ingredient} variant="secondary" className="flex items-center gap-1">
                    {ingredient}
                    <button
                      type="button"
                      onClick={() => removeIngredient(ingredient)}
                      className="ml-1 rounded-full hover:bg-muted p-0.5"
                    >
                      <X className="h-3 w-3" />
                      <span className="sr-only">Entfernen</span>
                    </button>
                  </Badge>
                ))}
                {ingredients.length === 0 && (
                  <p className="text-sm text-muted-foreground">Keine Inhaltsstoffe hinzugefügt</p>
                )}
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Abbrechen
            </Button>
            <Button type="submit">Änderungen speichern</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
