"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useMenu } from "@/contexts/menu-context"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { toast } from "@/hooks/use-toast"

interface EditAllergenDialogProps {
  allergenId: string
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function EditAllergenDialog({ allergenId, open, onOpenChange }: EditAllergenDialogProps) {
  const { allergens, updateAllergen } = useMenu()
  const [name, setName] = useState("")
  const [description, setDescription] = useState("")
  const [severity, setSeverity] = useState<"low" | "medium" | "high">("medium")

  // Lade die Daten des Allergens
  useEffect(() => {
    const allergen = allergens.find((a) => a.id === allergenId)
    if (allergen) {
      setName(allergen.name)
      setDescription(allergen.description)
      setSeverity(allergen.severity)
    }
  }, [allergenId, allergens])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    updateAllergen(allergenId, {
      name,
      description,
      severity,
    })

    toast({
      title: "Allergen aktualisiert",
      description: `${name} wurde erfolgreich aktualisiert.`,
    })

    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px] bg-white">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>Allergen bearbeiten</DialogTitle>
            <DialogDescription>Bearbeiten Sie die Details dieses Allergens oder Inhaltsstoffs.</DialogDescription>
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

            <div className="grid gap-2">
              <Label htmlFor="edit-severity">Schweregrad</Label>
              <Select value={severity} onValueChange={(value) => setSeverity(value as "low" | "medium" | "high")}>
                <SelectTrigger id="edit-severity">
                  <SelectValue placeholder="Schweregrad auswählen" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="low">Niedrig</SelectItem>
                  <SelectItem value="medium">Mittel</SelectItem>
                  <SelectItem value="high">Hoch</SelectItem>
                </SelectContent>
              </Select>
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
