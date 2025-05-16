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

interface AddMenuItemDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function AddMenuItemDialog({ open, onOpenChange }: AddMenuItemDialogProps) {
  const [name, setName] = useState("")
  const [description, setDescription] = useState("")
  const [price, setPrice] = useState("")
  const [category, setCategory] = useState("")
  const [isVegetarian, setIsVegetarian] = useState(false)
  const [isVegan, setIsVegan] = useState(false)
  const [isGlutenFree, setIsGlutenFree] = useState(false)
  const [isFeatured, setIsFeatured] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Handle form submission
    console.log({
      name,
      description,
      price: Number.parseFloat(price),
      category,
      isVegetarian,
      isVegan,
      isGlutenFree,
      isFeatured,
    })
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px] bg-white">
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
                    <SelectItem value="starters">Vorspeisen</SelectItem>
                    <SelectItem value="mains">Hauptgerichte</SelectItem>
                    <SelectItem value="desserts">Desserts</SelectItem>
                    <SelectItem value="drinks">Getränke</SelectItem>
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
