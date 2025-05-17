"use client"

import type React from "react"

import { useState } from "react"
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
import { useMenu } from "@/contexts/menu-context"
import { Badge } from "@/components/ui/badge"
import { X } from "lucide-react"

interface AddMenuItemDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function AddMenuItemDialog({ open, onOpenChange }: AddMenuItemDialogProps) {
  const { addMenuItem, allergens, categories } = useMenu()
  const [name, setName] = useState("")
  const [description, setDescription] = useState("")
  const [price, setPrice] = useState("")
  const [category, setCategory] = useState("")
  const [isVegetarian, setIsVegetarian] = useState(false)
  const [isVegan, setIsVegan] = useState(false)
  const [isGlutenFree, setIsGlutenFree] = useState(false)
  const [isFeatured, setIsFeatured] = useState(false)
  const [selectedAllergens, setSelectedAllergens] = useState<string[]>([])
  const [ingredients, setIngredients] = useState<string[]>([])
  const [newIngredient, setNewIngredient] = useState("")

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    // Add the new menu item
    addMenuItem({
      name,
      description,
      price: Number.parseFloat(price),
      category: category || "uncategorized",
      vegetarian: isVegetarian,
      vegan: isVegan,
      glutenFree: isGlutenFree,
      featured: isFeatured,
      available: true,
      allergens: selectedAllergens.length > 0 ? selectedAllergens : undefined,
      ingredients: ingredients.length > 0 ? ingredients : undefined,
    })

    // Reset form
    setName("")
    setDescription("")
    setPrice("")
    setCategory("")
    setIsVegetarian(false)
    setIsVegan(false)
    setIsGlutenFree(false)
    setIsFeatured(false)
    setSelectedAllergens([])
    setIngredients([])
    setNewIngredient("")

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
            <DialogTitle>Neues Gericht hinzufügen</DialogTitle>
            <DialogDescription>Fügen Sie ein neues Gericht zu Ihrer Speisekarte hinzu.</DialogDescription>
          </DialogHeader>

          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="name">Name</Label>
              <Input
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="z.B. Pasta Carbonara"
                required
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="description">Beschreibung</Label>
              <Textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Kurze Beschreibung des Gerichts"
                className="resize-none"
                rows={3}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="price">Preis (€)</Label>
                <Input
                  id="price"
                  type="number"
                  step="0.01"
                  min="0"
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  placeholder="0.00"
                  required
                />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="category">Kategorie</Label>
                <Select value={category} onValueChange={setCategory}>
                  <SelectTrigger id="category">
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
              <Label>Bild</Label>
              <Input type="file" accept="image/*" />
            </div>

            <div className="grid gap-2">
              <Label>Diät-Optionen</Label>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="vegetarian" className="cursor-pointer">
                    Vegetarisch
                  </Label>
                  <Switch id="vegetarian" checked={isVegetarian} onCheckedChange={setIsVegetarian} />
                </div>

                <div className="flex items-center justify-between">
                  <Label htmlFor="vegan" className="cursor-pointer">
                    Vegan
                  </Label>
                  <Switch id="vegan" checked={isVegan} onCheckedChange={setIsVegan} />
                </div>

                <div className="flex items-center justify-between">
                  <Label htmlFor="glutenFree" className="cursor-pointer">
                    Glutenfrei
                  </Label>
                  <Switch id="glutenFree" checked={isGlutenFree} onCheckedChange={setIsGlutenFree} />
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <Label htmlFor="featured" className="cursor-pointer">
                Als empfohlen markieren
              </Label>
              <Switch id="featured" checked={isFeatured} onCheckedChange={setIsFeatured} />
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
                          id={`allergen-${allergen.id}`}
                          checked={selectedAllergens.includes(allergen.id)}
                          onCheckedChange={() => toggleAllergen(allergen.id)}
                        />
                        <Label htmlFor={`allergen-${allergen.id}`} className="cursor-pointer text-sm">
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
            <Button type="submit">Speichern</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
