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
import type { menuItems } from "@/data/menu-items"

interface EditMenuItemDialogProps {
  item: (typeof menuItems)[0]
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function EditMenuItemDialog({ item, open, onOpenChange }: EditMenuItemDialogProps) {
  const [name, setName] = useState(item.name)
  const [description, setDescription] = useState(item.description || "")
  const [price, setPrice] = useState(item.price.toString())
  const [category, setCategory] = useState(item.category || "")
  const [isVegetarian, setIsVegetarian] = useState(item.vegetarian || false)
  const [isVegan, setIsVegan] = useState(item.vegan || false)
  const [isGlutenFree, setIsGlutenFree] = useState(item.glutenFree || false)
  const [isFeatured, setIsFeatured] = useState(item.featured || false)
  const [isAvailable, setIsAvailable] = useState(item.available || true)

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
    setIsAvailable(item.available || true)
  }, [item])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Handle form submission
    console.log({
      id: item.id,
      name,
      description,
      price: Number.parseFloat(price),
      category,
      vegetarian: isVegetarian,
      vegan: isVegan,
      glutenFree: isGlutenFree,
      featured: isFeatured,
      available: isAvailable,
    })
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px] bg-white">
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
                    <SelectItem value="starters">Vorspeisen</SelectItem>
                    <SelectItem value="mains">Hauptgerichte</SelectItem>
                    <SelectItem value="desserts">Desserts</SelectItem>
                    <SelectItem value="drinks">Getränke</SelectItem>
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
