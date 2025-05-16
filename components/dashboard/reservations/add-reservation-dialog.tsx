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
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { cn } from "@/lib/utils"
import { format } from "date-fns"
import { de } from "date-fns/locale"
import { CalendarIcon, Clock } from "lucide-react"
import { floorPlans } from "@/data/floor-plans"

interface AddReservationDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function AddReservationDialog({ open, onOpenChange }: AddReservationDialogProps) {
  const [date, setDate] = useState<Date | undefined>(new Date())
  const [time, setTime] = useState("19:00")
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [phone, setPhone] = useState("")
  const [guests, setGuests] = useState("2")
  const [table, setTable] = useState("")
  const [duration, setDuration] = useState("2")
  const [notes, setNotes] = useState("")
  const [status, setStatus] = useState("confirmed")
  const [showFloorPlan, setShowFloorPlan] = useState(false)

  // Get all available tables from all floor plans
  const allTables = floorPlans.flatMap((plan) =>
    plan.floors.flatMap((floor) =>
      floor.rooms.flatMap((room) =>
        room.tables.map((table) => ({
          id: table.id,
          number: table.number,
          floorPlan: plan.name,
          floor: floor.name,
          room: room.name,
          seats: table.seats,
          status: table.status,
        })),
      ),
    ),
  )

  // Filter tables by status and capacity
  const availableTables = allTables.filter(
    (table) => table.status === "available" && table.seats >= Number.parseInt(guests, 10),
  )

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Handle form submission
    console.log({
      date,
      time,
      name,
      email,
      phone,
      guests: Number(guests),
      table,
      duration: Number(duration),
      notes,
      status,
    })
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] bg-white">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>Neue Reservierung</DialogTitle>
            <DialogDescription>Erstellen Sie eine neue Tischreservierung.</DialogDescription>
          </DialogHeader>

          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="date">Datum</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      id="date"
                      variant="outline"
                      className={cn("w-full justify-start text-left font-normal", !date && "text-muted-foreground")}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {date ? format(date, "PPP", { locale: de }) : <span>Datum wählen</span>}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0 bg-white border-[#EAEAEA]" align="start">
                    <Calendar mode="single" selected={date} onSelect={setDate} initialFocus locale={de} />
                  </PopoverContent>
                </Popover>
              </div>

              <div className="grid gap-2">
                <Label htmlFor="time">Uhrzeit</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button id="time" variant="outline" className="w-full justify-start text-left font-normal">
                      <Clock className="mr-2 h-4 w-4" />
                      {time || "Uhrzeit wählen"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0 bg-white border-[#EAEAEA]" align="start">
                    <div className="p-4 grid grid-cols-3 gap-2 max-h-[300px] overflow-y-auto">
                      {Array.from({ length: 28 }, (_, i) => {
                        const hour = Math.floor(i / 2) + 12
                        const minute = i % 2 === 0 ? "00" : "30"
                        const timeString = `${hour}:${minute}`
                        return (
                          <Button
                            key={timeString}
                            variant="outline"
                            className={cn(time === timeString && "bg-[#F0F7FF] text-[#006AFF]")}
                            onClick={() => {
                              setTime(timeString)
                              document.body.click() // Close the popover
                            }}
                          >
                            {timeString}
                          </Button>
                        )
                      })}
                    </div>
                  </PopoverContent>
                </Popover>
              </div>
            </div>

            <div className="grid gap-2">
              <Label htmlFor="name">Name</Label>
              <Input
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Vollständiger Name"
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="email">E-Mail</Label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="email@example.com"
                />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="phone">Telefon</Label>
                <Input
                  id="phone"
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="+49 123 456789"
                />
              </div>
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="guests">Anzahl der Gäste</Label>
                <Select value={guests} onValueChange={setGuests}>
                  <SelectTrigger id="guests">
                    <SelectValue placeholder="Anzahl wählen" />
                  </SelectTrigger>
                  <SelectContent>
                    {Array.from({ length: 12 }, (_, i) => (
                      <SelectItem key={i + 1} value={(i + 1).toString()}>
                        {i + 1}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="grid gap-2 col-span-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="table">Tisch</Label>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="h-6 text-xs text-[#006AFF]"
                    onClick={() => setShowFloorPlan(!showFloorPlan)}
                  >
                    {showFloorPlan ? "Liste anzeigen" : "Tischplan anzeigen"}
                  </Button>
                </div>

                {showFloorPlan ? (
                  <div className="border border-[#EAEAEA] rounded-md h-[150px] overflow-auto p-2">
                    <div className="text-center text-sm text-[#6B7280] py-4">
                      Tischplan-Auswahl wird in einer zukünftigen Version verfügbar sein.
                    </div>
                  </div>
                ) : (
                  <Select value={table} onValueChange={setTable}>
                    <SelectTrigger id="table">
                      <SelectValue placeholder="Tisch wählen" />
                    </SelectTrigger>
                    <SelectContent>
                      {availableTables.length === 0 ? (
                        <SelectItem value="" disabled>
                          Keine passenden Tische verfügbar
                        </SelectItem>
                      ) : (
                        availableTables.map((table) => (
                          <SelectItem key={table.id} value={table.number}>
                            Tisch {table.number} ({table.seats} Plätze) - {table.floor}, {table.room}
                          </SelectItem>
                        ))
                      )}
                    </SelectContent>
                  </Select>
                )}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="duration">Dauer (Stunden)</Label>
                <Select value={duration} onValueChange={setDuration}>
                  <SelectTrigger id="duration">
                    <SelectValue placeholder="Dauer wählen" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1">1 Stunde</SelectItem>
                    <SelectItem value="1.5">1,5 Stunden</SelectItem>
                    <SelectItem value="2">2 Stunden</SelectItem>
                    <SelectItem value="2.5">2,5 Stunden</SelectItem>
                    <SelectItem value="3">3 Stunden</SelectItem>
                    <SelectItem value="4">4 Stunden</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="grid gap-2">
                <Label htmlFor="status">Status</Label>
                <Select value={status} onValueChange={setStatus}>
                  <SelectTrigger id="status">
                    <SelectValue placeholder="Status wählen" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="confirmed">Bestätigt</SelectItem>
                    <SelectItem value="pending">Ausstehend</SelectItem>
                    <SelectItem value="cancelled">Storniert</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid gap-2">
              <Label htmlFor="notes">Notizen</Label>
              <Textarea
                id="notes"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Spezielle Anforderungen oder Notizen"
                className="resize-none"
                rows={3}
              />
            </div>
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Abbrechen
            </Button>
            <Button type="submit">Reservierung erstellen</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
