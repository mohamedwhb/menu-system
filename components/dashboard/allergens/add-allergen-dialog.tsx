"use client"

import type React from "react"

import { useState } from "react"
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

interface AddAllergenDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function AddAllergenDialog({ open, onOpenChange }: AddAllergenDialogProps) {
  const { addAllergen } = useMenu()
  const [name, setName] = useState("")
  const [description, setDescription] = useState("")
  const [severity, setSeverity] = useState<"low" | "medium" | "high">("medium")

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    addAllergen({
      name,
      description,
      severity,
    })

    toast({
      title: "Allergen hinzugefügt",
      description: `${name} wurde erfolgreich hinzugefügt.`,
    })

    // Formular zurücksetzen
    setName("")
    setDescription("")
    setSeverity("medium")

    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px] bg-white">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>Neues Allergen hinzufügen</DialogTitle>
            <DialogDescription>
              Fügen Sie ein neues Allergen oder einen Inhaltsstoff hinzu, der in Ihren Gerichten vorkommen kann.
            </DialogDescription>
          </DialogHeader>

          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="name">Name</Label>
              <Input
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="z.B. Gluten, Laktose, etc."
                required
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="description">Beschreibung</Label>
              <Textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Beschreibung des Allergens oder Inhaltsstoffs"
                className="resize-none"
                rows={3}
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="severity">Schweregrad</Label>
              <Select value={severity} onValueChange={(value) => setSeverity(value as "low" | "medium" | "high")}>
                <SelectTrigger id="severity">
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
            <Button type="submit">Hinzufügen</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
