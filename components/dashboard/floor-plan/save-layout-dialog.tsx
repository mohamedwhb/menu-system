"use client"

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
import { Switch } from "@/components/ui/switch"

interface SaveLayoutDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function SaveLayoutDialog({ open, onOpenChange }: SaveLayoutDialogProps) {
  const [name, setName] = useState("")
  const [description, setDescription] = useState("")
  const [isDefault, setIsDefault] = useState(false)

  const handleSave = () => {
    // Handle saving the layout
    console.log({
      name,
      description,
      isDefault,
    })
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px] bg-white">
        <DialogHeader>
          <DialogTitle>Tischplan speichern</DialogTitle>
          <DialogDescription>
            Speichern Sie das aktuelle Layout als neuen Tischplan oder aktualisieren Sie einen bestehenden.
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="name">Name</Label>
            <Input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="z.B. Hauptraum, Terrasse, etc."
              required
            />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="description">Beschreibung (optional)</Label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Kurze Beschreibung des Layouts"
              className="resize-none"
              rows={3}
            />
          </div>

          <div className="flex items-center justify-between">
            <Label htmlFor="default" className="cursor-pointer">
              Als Standard-Layout festlegen
            </Label>
            <Switch id="default" checked={isDefault} onCheckedChange={setIsDefault} />
          </div>
        </div>

        <DialogFooter>
          <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
            Abbrechen
          </Button>
          <Button type="button" onClick={handleSave}>
            Speichern
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
