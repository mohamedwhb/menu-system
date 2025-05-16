"use client"

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

interface Room {
  id: string
  name: string
}

interface RoomSelectorProps {
  rooms: Room[]
  selectedRoomId: string
  onSelectRoom: (roomId: string) => void
}

export function RoomSelector({ rooms, selectedRoomId, onSelectRoom }: RoomSelectorProps) {
  return (
    <div className="flex items-center gap-2">
      <span className="text-sm font-medium">Raum:</span>
      <Select value={selectedRoomId} onValueChange={onSelectRoom}>
        <SelectTrigger className="w-[180px]">
          <SelectValue placeholder="Raum auswählen" />
        </SelectTrigger>
        <SelectContent>
          {rooms.length === 0 ? (
            <SelectItem value="no-rooms" disabled>
              Keine Räume verfügbar
            </SelectItem>
          ) : (
            rooms.map((room) => (
              <SelectItem key={room.id} value={room.id}>
                {room.name}
              </SelectItem>
            ))
          )}
        </SelectContent>
      </Select>
    </div>
  )
}
