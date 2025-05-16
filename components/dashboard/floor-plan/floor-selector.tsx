"use client"

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

interface Floor {
  id: string
  name: string
  level: number
  rooms: any[]
}

interface FloorSelectorProps {
  floors: Floor[]
  selectedFloorId: string
  onSelectFloor: (floorId: string) => void
}

export function FloorSelector({ floors, selectedFloorId, onSelectFloor }: FloorSelectorProps) {
  // Sort floors by level (ground floor first, then ascending)
  const sortedFloors = [...floors].sort((a, b) => a.level - b.level)

  return (
    <div className="flex items-center gap-2">
      <span className="text-sm font-medium">Etage:</span>
      <Select value={selectedFloorId} onValueChange={onSelectFloor}>
        <SelectTrigger className="w-[180px]">
          <SelectValue placeholder="Etage auswählen" />
        </SelectTrigger>
        <SelectContent>
          {sortedFloors.map((floor) => (
            <SelectItem key={floor.id} value={floor.id}>
              {floor.name}{" "}
              {floor.level === 0 ? "(EG)" : floor.level > 0 ? `(${floor.level}. OG)` : `(${Math.abs(floor.level)}. UG)`}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  )
}
