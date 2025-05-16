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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { floorPlans } from "@/data/floor-plans"

interface AddRoomDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function AddRoomDialog({ open, onOpenChange }: AddRoomDialogProps) {
  const [name, setName] = useState("")
  const [floorId, setFloorId] = useState("")
  const [width, setWidth] = useState("500")
  const [height, setHeight] = useState("500")

  // Get all floors from all floor plans
  const allFloors = floorPlans.flatMap((plan) => plan.floors)

  const handleSave = () => {
    // Handle saving the room
    console.log({
      name,
      floorId,
      width: Number.parseInt(width, 10),
      height: Number.parseInt(height, 10),
    })
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px] bg-white">
        <DialogHeader>
          <DialogTitle>Raum hinzufügen</DialogTitle>
          <DialogDescription>Fügen Sie einen neuen Raum zu einer bestehenden Etage hinzu.</DialogDescription>
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
            <Label htmlFor="floor">Etage</Label>
            <Select value={floorId} onValueChange={setFloorId}>
              <SelectTrigger id="floor">
                <SelectValue placeholder="Etage auswählen" />
              </SelectTrigger>
              <SelectContent>
                {allFloors.map((floor) => (
                  <SelectItem key={floor.id} value={floor.id}>
                    {floor.name}{" "}
                    {floor.level === 0
                      ? "(EG)"
                      : floor.level > 0
                        ? `(${floor.level}. OG)`
                        : `(${Math.abs(floor.level)}. UG)`}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="grid gap-2">
              <Label htmlFor="width">Breite (px)</Label>
              <Input id="width" type="number" min="100" value={width} onChange={(e) => setWidth(e.target.value)} />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="height">Höhe (px)</Label>
              <Input id="height" type="number" min="100" value={height} onChange={(e) => setHeight(e.target.value)} />
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
            Abbrechen
          </Button>
          <Button type="button" onClick={handleSave}>
            Raum hinzufügen
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
