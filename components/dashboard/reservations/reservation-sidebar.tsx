"use client"

import { useState, useMemo } from "react"
import { CalendarIcon, Filter, Users, Clock, Search, ChevronDown, ChevronUp } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import { Badge } from "@/components/ui/badge"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { cn } from "@/lib/utils"
import { format, parseISO } from "date-fns"
import { de } from "date-fns/locale"
import { reservations } from "@/data/reservations"

export function ReservationSidebar() {
  const [date, setDate] = useState<Date | undefined>(new Date())
  const [showCalendar, setShowCalendar] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState<string[]>(["confirmed", "pending"])
  const [showFilters, setShowFilters] = useState(false)
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc")

  // Get today's reservations
  const todayReservations = useMemo(() => {
    let filtered = reservations.filter((res) => {
      const resDate = parseISO(res.date)
      return (
        date &&
        resDate.getDate() === date.getDate() &&
        resDate.getMonth() === date.getMonth() &&
        resDate.getFullYear() === date.getFullYear() &&
        statusFilter.includes(res.status)
      )
    })

    // Apply search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase()
      filtered = filtered.filter(
        (res) =>
          res.name.toLowerCase().includes(query) ||
          (res.email && res.email.toLowerCase().includes(query)) ||
          (res.phone && res.phone.toLowerCase().includes(query)) ||
          res.table.toString().includes(query),
      )
    }

    // Sort by time
    filtered.sort((a, b) => {
      const timeA = parseISO(a.date).getTime()
      const timeB = parseISO(b.date).getTime()
      return sortOrder === "asc" ? timeA - timeB : timeB - timeA
    })

    return filtered
  }, [date, statusFilter, searchQuery, sortOrder])

  // Calculate statistics
  const stats = useMemo(() => {
    const activeReservations = todayReservations.filter((r) => r.status !== "cancelled")

    return {
      count: activeReservations.length,
      guests: activeReservations.reduce((sum, res) => sum + res.guests, 0),
      tables: [...new Set(activeReservations.map((r) => r.table))].length,
      pending: todayReservations.filter((r) => r.status === "pending").length,
    }
  }, [todayReservations])

  // Get status badge color
  const getStatusColor = (status: string) => {
    switch (status) {
      case "confirmed":
        return "bg-[#DCFCE7] text-[#16A34A] border-[#DCFCE7]"
      case "pending":
        return "bg-[#FEF9C3] text-[#CA8A04] border-[#FEF9C3]"
      case "cancelled":
        return "bg-[#FEE2E2] text-[#DC2626] border-[#FEE2E2]"
      default:
        return "bg-[#F3F4F6] text-[#6B7280] border-[#F3F4F6]"
    }
  }

  // Toggle status filter
  const toggleStatusFilter = (status: string) => {
    if (statusFilter.includes(status)) {
      setStatusFilter(statusFilter.filter((s) => s !== status))
    } else {
      setStatusFilter([...statusFilter, status])
    }
  }

  return (
    <div className="space-y-6">
      <div className="rounded-lg border border-[#EAEAEA] bg-white p-6 shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-medium">Datum</h3>
          <Popover open={showCalendar} onOpenChange={setShowCalendar}>
            <PopoverTrigger asChild>
              <Button variant="outline" className="w-full justify-start text-left font-normal">
                <CalendarIcon className="mr-2 h-4 w-4" />
                {date ? format(date, "PPP", { locale: de }) : <span>Datum wählen</span>}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0 bg-white border-[#EAEAEA]" align="start">
              <Calendar
                mode="single"
                selected={date}
                onSelect={(newDate) => {
                  setDate(newDate)
                  setShowCalendar(false)
                }}
                initialFocus
                locale={de}
              />
            </PopoverContent>
          </Popover>
        </div>

        <div className="flex items-center justify-between mb-4">
          <h3 className="font-medium">Statistik</h3>
        </div>

        <div className="grid grid-cols-2 gap-2 mb-6">
          <div className="rounded-md border border-[#EAEAEA] p-3">
            <div className="text-xs text-[#6B7280]">Reservierungen</div>
            <div className="text-2xl font-semibold mt-1">{stats.count}</div>
            {stats.pending > 0 && <div className="text-xs text-[#CA8A04] mt-1">{stats.pending} ausstehend</div>}
          </div>
          <div className="rounded-md border border-[#EAEAEA] p-3">
            <div className="text-xs text-[#6B7280]">Gäste</div>
            <div className="text-2xl font-semibold mt-1">{stats.guests}</div>
            <div className="text-xs text-[#6B7280] mt-1">{stats.tables} Tische</div>
          </div>
        </div>

        <div className="flex items-center justify-between mb-4">
          <h3 className="font-medium">Heutige Reservierungen</h3>
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="sm" className="h-8 px-2" onClick={() => setShowFilters(!showFilters)}>
              <Filter className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="h-8 px-2"
              onClick={() => setSortOrder(sortOrder === "asc" ? "desc" : "asc")}
            >
              {sortOrder === "asc" ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
            </Button>
          </div>
        </div>

        {showFilters && (
          <div className="mb-4 space-y-3 p-3 border border-[#EAEAEA] rounded-md bg-[#F9FAFB]">
            <div className="relative">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-[#6B7280]" />
              <Input
                type="search"
                placeholder="Suchen..."
                className="pl-9 bg-white border-[#EAEAEA]"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>

            <div>
              <div className="text-sm font-medium mb-2">Status</div>
              <div className="flex flex-wrap gap-2">
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="confirmed"
                    checked={statusFilter.includes("confirmed")}
                    onCheckedChange={() => toggleStatusFilter("confirmed")}
                  />
                  <label htmlFor="confirmed" className="text-sm">
                    Bestätigt
                  </label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="pending"
                    checked={statusFilter.includes("pending")}
                    onCheckedChange={() => toggleStatusFilter("pending")}
                  />
                  <label htmlFor="pending" className="text-sm">
                    Ausstehend
                  </label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="cancelled"
                    checked={statusFilter.includes("cancelled")}
                    onCheckedChange={() => toggleStatusFilter("cancelled")}
                  />
                  <label htmlFor="cancelled" className="text-sm">
                    Storniert
                  </label>
                </div>
              </div>
            </div>
          </div>
        )}

        {todayReservations.length === 0 ? (
          <div className="text-center py-6 text-[#6B7280]">
            <p>Keine Reservierungen für heute.</p>
          </div>
        ) : (
          <div className="space-y-3 max-h-[400px] overflow-y-auto pr-1">
            {todayReservations.map((reservation) => (
              <div
                key={reservation.id}
                className="rounded-md border border-[#EAEAEA] p-3 hover:shadow-sm transition-shadow"
              >
                <div className="flex justify-between items-start">
                  <div className="font-medium">{reservation.name}</div>
                  <Badge variant="outline" className={cn("text-xs", getStatusColor(reservation.status))}>
                    {reservation.status === "confirmed"
                      ? "Bestätigt"
                      : reservation.status === "pending"
                        ? "Ausstehend"
                        : "Storniert"}
                  </Badge>
                </div>
                <div className="flex items-center text-sm text-[#6B7280] mt-1">
                  <Clock className="h-3.5 w-3.5 mr-1" />
                  {format(parseISO(reservation.date), "HH:mm", { locale: de })} Uhr • Tisch {reservation.table}
                </div>
                <div className="flex items-center text-sm text-[#6B7280] mt-1">
                  <Users className="h-3.5 w-3.5 mr-1" />
                  {reservation.guests} {reservation.guests === 1 ? "Person" : "Personen"}
                </div>
                {reservation.notes && (
                  <div className="text-xs text-[#6B7280] mt-2 border-t border-[#EAEAEA] pt-2">{reservation.notes}</div>
                )}
                <div className="flex gap-2 mt-2 pt-2 border-t border-[#EAEAEA]">
                  <Button variant="outline" size="sm" className="h-7 text-xs w-full">
                    Bearbeiten
                  </Button>
                  <Button variant="outline" size="sm" className="h-7 text-xs w-full">
                    Details
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="rounded-lg border border-[#EAEAEA] bg-white p-6 shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-medium">Tischbelegung</h3>
          <Select defaultValue="today">
            <SelectTrigger className="w-[120px] h-8 text-xs">
              <SelectValue placeholder="Zeitraum" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="today">Heute</SelectItem>
              <SelectItem value="week">Diese Woche</SelectItem>
              <SelectItem value="month">Dieser Monat</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <div className="text-sm">Tisch 1</div>
            <div className="w-2/3 bg-[#F3F4F6] rounded-full h-2">
              <div className="bg-[#16A34A] h-2 rounded-full" style={{ width: "75%" }}></div>
            </div>
            <div className="text-xs text-[#6B7280]">75%</div>
          </div>
          <div className="flex items-center justify-between">
            <div className="text-sm">Tisch 2</div>
            <div className="w-2/3 bg-[#F3F4F6] rounded-full h-2">
              <div className="bg-[#16A34A] h-2 rounded-full" style={{ width: "50%" }}></div>
            </div>
            <div className="text-xs text-[#6B7280]">50%</div>
          </div>
          <div className="flex items-center justify-between">
            <div className="text-sm">Tisch 3</div>
            <div className="w-2/3 bg-[#F3F4F6] rounded-full h-2">
              <div className="bg-[#16A34A] h-2 rounded-full" style={{ width: "25%" }}></div>
            </div>
            <div className="text-xs text-[#6B7280]">25%</div>
          </div>
          <div className="flex items-center justify-between">
            <div className="text-sm">Tisch 4</div>
            <div className="w-2/3 bg-[#F3F4F6] rounded-full h-2">
              <div className="bg-[#16A34A] h-2 rounded-full" style={{ width: "100%" }}></div>
            </div>
            <div className="text-xs text-[#6B7280]">100%</div>
          </div>
        </div>

        <Button variant="outline" size="sm" className="w-full mt-4">
          Zum Tischplan
        </Button>
      </div>
    </div>
  )
}
