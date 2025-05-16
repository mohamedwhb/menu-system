"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { reservations } from "@/data/reservations"
import { format } from "date-fns"
import { de } from "date-fns/locale"

interface Table {
  id: string
  x: number
  y: number
  width: number
  height: number
  shape: "square" | "rectangle" | "circle" | "oval"
  number: string
  seats: number
  status: "available" | "reserved" | "occupied"
  rotation: number
  reservationId?: string
}

interface TableDetailsPopoverProps {
  table: Table
  onClose: () => void
  onUpdate: (updatedTable: Table) => void
}

export function TableDetailsPopover({ table, onClose, onUpdate }: TableDetailsPopoverProps) {
  const [tableNumber, setTableNumber] = useState(table.number)
  const [tableSeats, setTableSeats] = useState(table.seats.toString())
  const [tableStatus, setTableStatus] = useState(table.status)
  const [tableWidth, setTableWidth] = useState(table.width.toString())
  const [tableHeight, setTableHeight] = useState(table.height.toString())
  const [reservationId, setReservationId] = useState(table.reservationId || "")

  // Get reservation details if available
  const reservation = reservationId ? reservations.find((r) => r.id === reservationId) : null

  const handleSave = () => {
    const updatedTable: Table = {
      ...table,
      number: tableNumber,
      seats: Number.parseInt(tableSeats, 10),
      status: tableStatus,
      width: Number.parseInt(tableWidth, 10),
      height: Number.parseInt(tableHeight, 10),
      reservationId: reservationId || undefined,
    }

    onUpdate(updatedTable)
    onClose()
  }

  return (
    <div className="absolute bottom-4 right-4 w-80 bg-white border border-[#EAEAEA] rounded-lg shadow-lg p-4 z-10">
      <div className="flex justify-between items-center mb-4">
        <h3 className="font-medium">Tischdetails</h3>
        <Button variant="ghost" size="sm" className="h-6 w-6 p-0" onClick={onClose}>
          ×
        </Button>
      </div>

      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-3">
          <div className="space-y-1">
            <Label htmlFor="table-number">Tischnummer</Label>
            <Input id="table-number" value={tableNumber} onChange={(e) => setTableNumber(e.target.value)} />
          </div>
          <div className="space-y-1">
            <Label htmlFor="table-seats">Plätze</Label>
            <Input
              id="table-seats"
              type="number"
              min="1"
              max="12"
              value={tableSeats}
              onChange={(e) => setTableSeats(e.target.value)}
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div className="space-y-1">
            <Label htmlFor="table-width">Breite (px)</Label>
            <Input
              id="table-width"
              type="number"
              min="40"
              value={tableWidth}
              onChange={(e) => setTableWidth(e.target.value)}
            />
          </div>
          <div className="space-y-1">
            <Label htmlFor="table-height">Höhe (px)</Label>
            <Input
              id="table-height"
              type="number"
              min="40"
              value={tableHeight}
              onChange={(e) => setTableHeight(e.target.value)}
            />
          </div>
        </div>

        <div className="space-y-1">
          <Label htmlFor="table-status">Status</Label>
          <Select value={tableStatus} onValueChange={setTableStatus}>
            <SelectTrigger id="table-status">
              <SelectValue placeholder="Status wählen" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="available">Verfügbar</SelectItem>
              <SelectItem value="reserved">Reserviert</SelectItem>
              <SelectItem value="occupied">Besetzt</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {(tableStatus === "reserved" || tableStatus === "occupied") && (
          <div className="space-y-1">
            <Label htmlFor="reservation">Reservierung</Label>
            <Select value={reservationId} onValueChange={setReservationId}>
              <SelectTrigger id="reservation">
                <SelectValue placeholder="Reservierung zuweisen" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="none">Keine Reservierung</SelectItem>
                {reservations
                  .filter((r) => r.status !== "cancelled")
                  .map((r) => (
                    <SelectItem key={r.id} value={r.id}>
                      {r.name} - {format(new Date(r.date), "HH:mm", { locale: de })}
                    </SelectItem>
                  ))}
              </SelectContent>
            </Select>
          </div>
        )}

        {reservation && (
          <div className="mt-2 p-2 bg-[#F9FAFB] rounded-md text-sm">
            <div className="font-medium">{reservation.name}</div>
            <div className="text-[#6B7280]">
              {format(new Date(reservation.date), "HH:mm", { locale: de })} Uhr •{reservation.guests}{" "}
              {reservation.guests === 1 ? "Person" : "Personen"}
            </div>
            {reservation.phone && <div className="text-[#6B7280]">{reservation.phone}</div>}
          </div>
        )}

        <div className="flex justify-end gap-2 mt-2">
          <Button variant="outline" onClick={onClose}>
            Abbrechen
          </Button>
          <Button onClick={handleSave}>Speichern</Button>
        </div>
      </div>
    </div>
  )
}
