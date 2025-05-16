"use client"

import { useState } from "react"
import { Clock, Filter, Users, Building, DoorOpen } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { floorPlans } from "@/data/floor-plans"
import { reservations } from "@/data/reservations"
import { format } from "date-fns"
import { de } from "date-fns/locale"

export function FloorPlanSidebar() {
  const [selectedFloorPlan, setSelectedFloorPlan] = useState(floorPlans[0].id)
  const [timeFilter, setTimeFilter] = useState("now")
  const [activeTab, setActiveTab] = useState("overview")

  // Get today's reservations
  const todayReservations = reservations.filter((res) => {
    const resDate = new Date(res.date)
    const today = new Date()
    return (
      resDate.getDate() === today.getDate() &&
      resDate.getMonth() === today.getMonth() &&
      resDate.getFullYear() === today.getFullYear()
    )
  })

  // Sort by time
  todayReservations.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())

  // Get current floor plan
  const currentPlan = floorPlans.find((plan) => plan.id === selectedFloorPlan) || floorPlans[0]

  // Get all tables from all rooms and floors
  const allTables = currentPlan.floors.flatMap((floor) => floor.rooms.flatMap((room) => room.tables))

  // Get table statistics
  const availableTables = allTables.filter((table) => table.status === "available").length
  const reservedTables = allTables.filter((table) => table.status === "reserved").length
  const occupiedTables = allTables.filter((table) => table.status === "occupied").length
  const totalTables = allTables.length

  // Get total seats
  const totalSeats = allTables.reduce((sum, table) => sum + table.seats, 0)
  const availableSeats = allTables
    .filter((table) => table.status === "available")
    .reduce((sum, table) => sum + table.seats, 0)

  // Get floor and room counts
  const floorCount = currentPlan.floors.length
  const roomCount = currentPlan.floors.reduce((sum, floor) => sum + floor.rooms.length, 0)

  return (
    <div className="space-y-6">
      <div className="rounded-lg border border-[#EAEAEA] bg-white p-6 shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-medium">Tischplan</h3>
        </div>

        <div className="space-y-4">
          <div className="grid gap-2">
            <label htmlFor="floor-plan" className="text-sm text-[#6B7280]">
              Aktueller Plan
            </label>
            <Select value={selectedFloorPlan} onValueChange={setSelectedFloorPlan}>
              <SelectTrigger id="floor-plan">
                <SelectValue placeholder="Plan auswählen" />
              </SelectTrigger>
              <SelectContent>
                {floorPlans.map((plan) => (
                  <SelectItem key={plan.id} value={plan.id}>
                    {plan.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="grid gap-2">
            <label htmlFor="time-filter" className="text-sm text-[#6B7280]">
              Zeitpunkt
            </label>
            <Select value={timeFilter} onValueChange={setTimeFilter}>
              <SelectTrigger id="time-filter">
                <SelectValue placeholder="Zeitpunkt wählen" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="now">Aktuell</SelectItem>
                <SelectItem value="lunch">Mittagszeit (12:00 - 14:00)</SelectItem>
                <SelectItem value="dinner">Abendessen (18:00 - 21:00)</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      <div className="rounded-lg border border-[#EAEAEA] bg-white p-6 shadow-sm">
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="bg-[#F7F7F7] w-full mb-4">
            <TabsTrigger value="overview" className="flex-1 data-[state=active]:bg-white">
              Übersicht
            </TabsTrigger>
            <TabsTrigger value="floors" className="flex-1 data-[state=active]:bg-white">
              Etagen
            </TabsTrigger>
            <TabsTrigger value="reservations" className="flex-1 data-[state=active]:bg-white">
              Reservierungen
            </TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="mt-0">
            <h3 className="font-medium mb-3">Statistik</h3>
            <div className="grid grid-cols-2 gap-3 mb-4">
              <div className="rounded-md border border-[#EAEAEA] p-3">
                <div className="text-xs text-[#6B7280]">Verfügbare Tische</div>
                <div className="text-2xl font-semibold mt-1">
                  {availableTables}/{totalTables}
                </div>
              </div>
              <div className="rounded-md border border-[#EAEAEA] p-3">
                <div className="text-xs text-[#6B7280]">Verfügbare Plätze</div>
                <div className="text-2xl font-semibold mt-1">
                  {availableSeats}/{totalSeats}
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="rounded-md border border-[#EAEAEA] p-3">
                <div className="text-xs text-[#6B7280]">Etagen</div>
                <div className="text-2xl font-semibold mt-1">{floorCount}</div>
              </div>
              <div className="rounded-md border border-[#EAEAEA] p-3">
                <div className="text-xs text-[#6B7280]">Räume</div>
                <div className="text-2xl font-semibold mt-1">{roomCount}</div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="floors" className="mt-0">
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-medium">Etagen & Räume</h3>
              <Button variant="ghost" size="sm" className="h-8 px-2">
                <Filter className="h-4 w-4" />
              </Button>
            </div>

            <div className="space-y-4 max-h-[300px] overflow-y-auto pr-1">
              {currentPlan.floors.map((floor) => (
                <div key={floor.id} className="space-y-2">
                  <div className="flex items-center gap-2">
                    <Building className="h-4 w-4 text-[#6B7280]" />
                    <span className="font-medium">
                      {floor.name}{" "}
                      {floor.level === 0
                        ? "(EG)"
                        : floor.level > 0
                          ? `(${floor.level}. OG)`
                          : `(${Math.abs(floor.level)}. UG)`}
                    </span>
                  </div>

                  <div className="pl-6 space-y-2">
                    {floor.rooms.map((room) => (
                      <div
                        key={room.id}
                        className="flex items-center justify-between p-2 border border-[#EAEAEA] rounded-md"
                      >
                        <div className="flex items-center gap-2">
                          <DoorOpen className="h-4 w-4 text-[#6B7280]" />
                          <span>{room.name}</span>
                        </div>
                        <Badge variant="outline" className="bg-[#F3F4F6] text-[#6B7280] border-[#EAEAEA]">
                          {room.tables.length} Tische
                        </Badge>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="reservations" className="mt-0">
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-medium">Heutige Reservierungen</h3>
              <Button variant="ghost" size="sm" className="h-8 px-2">
                <Filter className="h-4 w-4" />
              </Button>
            </div>

            <div className="space-y-3 max-h-[300px] overflow-y-auto pr-1">
              {todayReservations.length === 0 ? (
                <div className="text-center py-6 text-[#6B7280]">
                  <p>Keine Reservierungen für heute.</p>
                </div>
              ) : (
                todayReservations.map((reservation) => (
                  <div
                    key={reservation.id}
                    className="rounded-md border border-[#EAEAEA] p-3 hover:shadow-sm transition-shadow"
                  >
                    <div className="flex justify-between items-start">
                      <div className="font-medium">{reservation.name}</div>
                      <Badge
                        variant="outline"
                        className={
                          reservation.status === "confirmed"
                            ? "bg-[#DCFCE7] text-[#16A34A] border-[#DCFCE7]"
                            : reservation.status === "pending"
                              ? "bg-[#FEF9C3] text-[#CA8A04] border-[#FEF9C3]"
                              : "bg-[#FEE2E2] text-[#DC2626] border-[#FEE2E2]"
                        }
                      >
                        {reservation.status === "confirmed"
                          ? "Bestätigt"
                          : reservation.status === "pending"
                            ? "Ausstehend"
                            : "Storniert"}
                      </Badge>
                    </div>
                    <div className="flex items-center text-sm text-[#6B7280] mt-1">
                      <Clock className="h-3.5 w-3.5 mr-1" />
                      {format(new Date(reservation.date), "HH:mm", { locale: de })} Uhr • Tisch {reservation.table}
                    </div>
                    <div className="flex items-center text-sm text-[#6B7280] mt-1">
                      <Users className="h-3.5 w-3.5 mr-1" />
                      {reservation.guests} {reservation.guests === 1 ? "Person" : "Personen"}
                    </div>
                  </div>
                ))
              )}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
