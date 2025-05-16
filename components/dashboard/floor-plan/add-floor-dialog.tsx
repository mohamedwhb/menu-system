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
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"

interface AddFloorDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function AddFloorDialog({ open, onOpenChange }: AddFloorDialogProps) {
  const [name, setName] = useState("")
  const [level, setLevel] = useState("0") // 0 = ground floor, positive = above ground, negative = below ground
  const [floorType, setFloorType] = useState("standard") // standard, basement, rooftop

  const handleSave = () => {
    // Handle saving the floor
    console.log({
      name,
      level: Number.parseInt(level, 10),
      floorType,
    })
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px] bg-white">
        <DialogHeader>
          <DialogTitle>Etage hinzufügen</DialogTitle>
          <DialogDescription>Fügen Sie eine neue Etage zum Gebäude hinzu.</DialogDescription>
        </DialogHeader>

        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="name">Name</Label>
            <Input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="z.B. Erdgeschoss, 1. Stock, etc."
              required
            />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="level">Etagennummer</Label>
            <Input
              id="level"
              type="number"
              value={level}
              onChange={(e) => setLevel(e.target.value)}
              placeholder="0 für Erdgeschoss, -1 für Untergeschoss, 1 für 1. Stock"
            />
            <p className="text-xs text-[#6B7280]">
              0 = Erdgeschoss, positive Zahlen = Obergeschosse, negative Zahlen = Untergeschosse
            </p>
          </div>

          <div className="grid gap-2">
            <Label>Etagentyp</Label>
            <RadioGroup value={floorType} onValueChange={setFloorType}>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="standard" id="standard" />
                <Label htmlFor="standard" className="cursor-pointer">
                  Standard
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="basement" id="basement" />
                <Label htmlFor="basement" className="cursor-pointer">
                  Untergeschoss
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="rooftop" id="rooftop" />
                <Label htmlFor="rooftop" className="cursor-pointer">
                  Dachterrasse
                </Label>
              </div>
            </RadioGroup>
          </div>
        </div>

        <DialogFooter>
          <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
            Abbrechen
          </Button>
          <Button type="button" onClick={handleSave}>
            Etage hinzufügen
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
