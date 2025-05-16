"use client"

import { useState, useEffect, useRef, useMemo, useCallback } from "react"
import { ChevronLeft, ChevronRight, MoreHorizontal, AlertCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { cn } from "@/lib/utils"
import {
  format,
  addDays,
  startOfWeek,
  endOfWeek,
  eachDayOfInterval,
  isSameDay,
  addMonths,
  subMonths,
  isToday,
  parseISO,
  isSameMonth,
  startOfMonth,
  endOfMonth,
  getDay,
} from "date-fns"
import { de } from "date-fns/locale"
import { reservations } from "@/data/reservations"
import { ViewReservationDialog } from "@/components/dashboard/reservations/view-reservation-dialog"

const HOURS = Array.from({ length: 14 }, (_, i) => i + 8) // 8:00 - 22:00

export function ReservationCalendar() {
  const [view, setView] = useState<"day" | "week" | "month">("week")
  const [currentDate, setCurrentDate] = useState(new Date())
  const [selectedReservation, setSelectedReservation] = useState<(typeof reservations)[0] | null>(null)
  const [draggedReservation, setDraggedReservation] = useState<string | null>(null)
  const scrollContainerRef = useRef<HTMLDivElement>(null)

  // Scroll to current time on initial render
  useEffect(() => {
    if (scrollContainerRef.current) {
      const currentHour = new Date().getHours()
      const scrollPosition = Math.max(0, (currentHour - 8) * 100 - 100) // 100px per hour, offset by 8am
      scrollContainerRef.current.scrollTop = scrollPosition
    }
  }, [view])

  const handlePrevious = () => {
    if (view === "day") {
      setCurrentDate((prev) => addDays(prev, -1))
    } else if (view === "week") {
      setCurrentDate((prev) => addDays(prev, -7))
    } else {
      setCurrentDate((prev) => subMonths(prev, 1))
    }
  }

  const handleNext = () => {
    if (view === "day") {
      setCurrentDate((prev) => addDays(prev, 1))
    } else if (view === "week") {
      setCurrentDate((prev) => addDays(prev, 7))
    } else {
      setCurrentDate((prev) => addMonths(prev, 1))
    }
  }

  const handleToday = () => {
    setCurrentDate(new Date())
  }

  // Get days for the week view
  const weekStart = startOfWeek(currentDate, { weekStartsOn: 1 }) // Start on Monday
  const weekEnd = endOfWeek(currentDate, { weekStartsOn: 1 })
  const weekDays = eachDayOfInterval({ start: weekStart, end: weekEnd })

  // Get days for the month view
  const monthStart = startOfMonth(currentDate)
  const monthEnd = endOfMonth(currentDate)
  const monthDays = eachDayOfInterval({ start: monthStart, end: monthEnd })

  // Add days from previous and next month to fill the calendar grid
  const firstDayOfMonth = getDay(monthStart) || 7 // Convert Sunday (0) to 7 for European calendars
  const prevMonthDays =
    firstDayOfMonth > 1
      ? eachDayOfInterval({
          start: addDays(monthStart, -(firstDayOfMonth - 1)),
          end: addDays(monthStart, -1),
        })
      : []

  const lastDayOfMonth = getDay(monthEnd) || 7
  const nextMonthDays =
    lastDayOfMonth < 7
      ? eachDayOfInterval({
          start: addDays(monthEnd, 1),
          end: addDays(monthEnd, 7 - lastDayOfMonth),
        })
      : []

  const calendarDays = [...prevMonthDays, ...monthDays, ...nextMonthDays]

  // Filter reservations for the current view
  const getFilteredReservations = useCallback(() => {
    if (view === "day") {
      return reservations.filter((res) => isSameDay(parseISO(res.date), currentDate))
    } else if (view === "week") {
      return reservations.filter((res) => {
        const resDate = parseISO(res.date)
        return resDate >= weekStart && resDate <= weekEnd
      })
    } else {
      return reservations.filter((res) => {
        const resDate = parseISO(res.date)
        return isSameMonth(resDate, currentDate)
      })
    }
  }, [view, currentDate, weekStart, weekEnd])

  const filteredReservations = useMemo(() => getFilteredReservations(), [getFilteredReservations])

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

  // Check for reservation conflicts
  const hasConflict = (reservation: (typeof reservations)[0]) => {
    const resDate = parseISO(reservation.date)
    const resEnd = new Date(resDate.getTime() + (reservation.duration || 2) * 60 * 60 * 1000)

    return filteredReservations.some((other) => {
      if (other.id === reservation.id || other.table !== reservation.table) return false

      const otherDate = parseISO(other.date)
      const otherEnd = new Date(otherDate.getTime() + (other.duration || 2) * 60 * 60 * 1000)

      return (resDate < otherEnd && resEnd > otherDate) || (otherDate < resEnd && otherEnd > resDate)
    })
  }

  // Handle drag and drop
  const handleDragStart = (id: string) => {
    setDraggedReservation(id)
  }

  const handleDragEnd = () => {
    setDraggedReservation(null)
  }

  // Render day view
  const renderDayView = () => {
    return (
      <div className="flex flex-col h-[600px]">
        <div className="text-center py-2 border-b border-[#EAEAEA] font-medium">
          <span className={cn(isToday(currentDate) && "text-[#006AFF]")}>
            {format(currentDate, "EEEE, d. MMMM yyyy", { locale: de })}
          </span>
        </div>
        <div className="flex-1 overflow-y-auto" ref={scrollContainerRef}>
          <div className="relative min-h-[1400px]">
            {/* Time slots */}
            {HOURS.map((hour) => (
              <div key={hour} className="absolute w-full h-[100px]" style={{ top: `${(hour - 8) * 100}px` }}>
                <div className="border-t border-[#EAEAEA] pt-2 text-xs text-[#6B7280] w-16">{hour}:00</div>
              </div>
            ))}

            {/* Current time indicator */}
            {isToday(currentDate) && (
              <div
                className="absolute left-0 right-0 border-t border-[#006AFF] z-10"
                style={{
                  top: `${(new Date().getHours() - 8) * 100 + (new Date().getMinutes() / 60) * 100}px`,
                }}
              >
                <div className="absolute -top-1 -left-1 w-2 h-2 rounded-full bg-[#006AFF]"></div>
              </div>
            )}

            {/* Reservations */}
            {filteredReservations.map((reservation) => {
              const resDate = parseISO(reservation.date)
              const hours = resDate.getHours() - 8 // Offset by 8am
              const minutes = resDate.getMinutes()
              const duration = reservation.duration || 2 // Default 2 hours
              const conflict = hasConflict(reservation)

              return (
                <div
                  key={reservation.id}
                  className={cn(
                    "absolute left-20 right-4 rounded-md border p-2 shadow-sm hover:shadow-md transition-shadow cursor-pointer",
                    draggedReservation === reservation.id ? "opacity-50" : "opacity-100",
                    conflict ? "border-[#DC2626]" : "border-[#EAEAEA]",
                    reservation.status === "cancelled" ? "opacity-60" : "",
                  )}
                  style={{
                    top: `${hours * 100 + (minutes / 60) * 100}px`,
                    height: `${duration * 100 - 10}px`,
                    backgroundColor: reservation.status === "cancelled" ? "#F9FAFB" : "white",
                  }}
                  onClick={() => setSelectedReservation(reservation)}
                  draggable
                  onDragStart={() => handleDragStart(reservation.id)}
                  onDragEnd={handleDragEnd}
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <div className="font-medium text-sm">{reservation.name}</div>
                      <div className="text-xs text-[#6B7280]">
                        {reservation.guests} {reservation.guests === 1 ? "Person" : "Personen"} • Tisch{" "}
                        {reservation.table}
                      </div>
                    </div>
                    <div className="flex items-center gap-1">
                      {conflict && (
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <AlertCircle className="h-4 w-4 text-[#DC2626]" />
                            </TooltipTrigger>
                            <TooltipContent>
                              <p>Konflikt: Tisch ist bereits reserviert</p>
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                      )}
                      <Badge variant="outline" className={cn("text-xs", getStatusColor(reservation.status))}>
                        {reservation.status === "confirmed"
                          ? "Bestätigt"
                          : reservation.status === "pending"
                            ? "Ausstehend"
                            : "Storniert"}
                      </Badge>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </div>
    )
  }

  // Render week view
  const renderWeekView = () => {
    return (
      <div className="flex flex-col h-[600px]">
        <div className="grid grid-cols-7 border-b border-[#EAEAEA]">
          {weekDays.map((day) => (
            <div
              key={day.toString()}
              className={cn("text-center py-2 text-sm", isToday(day) && "bg-[#F0F7FF] font-medium text-[#006AFF]")}
            >
              <div className="font-medium">{format(day, "EEEE", { locale: de })}</div>
              <div className="text-xs text-[#6B7280]">{format(day, "d. MMM", { locale: de })}</div>
            </div>
          ))}
        </div>
        <div className="flex-1 overflow-y-auto" ref={scrollContainerRef}>
          <div className="relative min-h-[1400px]">
            {/* Time slots */}
            {HOURS.map((hour) => (
              <div key={hour} className="absolute w-full h-[100px]" style={{ top: `${(hour - 8) * 100}px` }}>
                <div className="border-t border-[#EAEAEA] pt-2 text-xs text-[#6B7280] w-16">{hour}:00</div>
                <div className="grid grid-cols-7 h-full">
                  {weekDays.map((day) => (
                    <div key={day.toString()} className="border-l border-[#EAEAEA] h-full"></div>
                  ))}
                </div>
              </div>
            ))}

            {/* Current time indicator */}
            {weekDays.some((day) => isToday(day)) && (
              <div
                className="absolute left-0 right-0 border-t border-[#006AFF] z-10"
                style={{
                  top: `${(new Date().getHours() - 8) * 100 + (new Date().getMinutes() / 60) * 100}px`,
                }}
              >
                <div className="absolute -top-1 -left-1 w-2 h-2 rounded-full bg-[#006AFF]"></div>
              </div>
            )}

            {/* Reservations */}
            {filteredReservations.map((reservation) => {
              const resDate = parseISO(reservation.date)
              const dayIndex = weekDays.findIndex((day) => isSameDay(day, resDate))
              if (dayIndex === -1) return null

              const hours = resDate.getHours() - 8 // Offset by 8am
              const minutes = resDate.getMinutes()
              const duration = reservation.duration || 2 // Default 2 hours
              const conflict = hasConflict(reservation)

              return (
                <div
                  key={reservation.id}
                  className={cn(
                    "absolute rounded-md border p-2 shadow-sm hover:shadow-md transition-shadow cursor-pointer",
                    draggedReservation === reservation.id ? "opacity-50" : "opacity-100",
                    conflict ? "border-[#DC2626]" : "border-[#EAEAEA]",
                    reservation.status === "cancelled" ? "opacity-60" : "",
                  )}
                  style={{
                    top: `${hours * 100 + (minutes / 60) * 100}px`,
                    height: `${duration * 100 - 10}px`,
                    left: `calc(${(dayIndex * 100) / 7}% + 20px)`,
                    width: `calc(${100 / 7}% - 24px)`,
                    backgroundColor: reservation.status === "cancelled" ? "#F9FAFB" : "white",
                  }}
                  onClick={() => setSelectedReservation(reservation)}
                  draggable
                  onDragStart={() => handleDragStart(reservation.id)}
                  onDragEnd={handleDragEnd}
                >
                  <div className="flex flex-col h-full overflow-hidden">
                    <div className="font-medium text-sm truncate">{reservation.name}</div>
                    <div className="text-xs text-[#6B7280] truncate">
                      {reservation.guests} {reservation.guests === 1 ? "Person" : "Personen"} • Tisch{" "}
                      {reservation.table}
                    </div>
                    <div className="flex items-center gap-1 mt-1">
                      {conflict && <AlertCircle className="h-3 w-3 text-[#DC2626] shrink-0" />}
                      <Badge variant="outline" className={cn("text-xs w-fit", getStatusColor(reservation.status))}>
                        {reservation.status === "confirmed"
                          ? "Bestätigt"
                          : reservation.status === "pending"
                            ? "Ausstehend"
                            : "Storniert"}
                      </Badge>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </div>
    )
  }

  // Render month view
  const renderMonthView = () => {
    // Group reservations by day
    const reservationsByDay = filteredReservations.reduce(
      (acc, reservation) => {
        const date = parseISO(reservation.date)
        const dateStr = format(date, "yyyy-MM-dd")

        if (!acc[dateStr]) {
          acc[dateStr] = []
        }

        acc[dateStr].push(reservation)
        return acc
      },
      {} as Record<string, typeof filteredReservations>,
    )

    return (
      <div className="h-[600px] overflow-y-auto">
        <div className="grid grid-cols-7 text-center py-2 border-b border-[#EAEAEA]">
          {["Mo", "Di", "Mi", "Do", "Fr", "Sa", "So"].map((day) => (
            <div key={day} className="text-sm font-medium">
              {day}
            </div>
          ))}
        </div>

        <div className="grid grid-cols-7 auto-rows-fr h-[540px]">
          {calendarDays.map((day) => {
            const dateStr = format(day, "yyyy-MM-dd")
            const dayReservations = reservationsByDay[dateStr] || []
            const isCurrentMonth = isSameMonth(day, currentDate)

            return (
              <div
                key={day.toString()}
                className={cn(
                  "border border-[#EAEAEA] p-1 min-h-[90px]",
                  !isCurrentMonth && "bg-[#F9FAFB] opacity-50",
                  isToday(day) && "bg-[#F0F7FF]",
                )}
              >
                <div className={cn("text-right text-sm p-1", isToday(day) && "font-bold text-[#006AFF]")}>
                  {format(day, "d")}
                </div>

                <div className="space-y-1 mt-1">
                  {dayReservations.slice(0, 3).map((reservation) => (
                    <div
                      key={reservation.id}
                      className={cn("text-xs p-1 rounded truncate cursor-pointer", getStatusColor(reservation.status))}
                      onClick={() => setSelectedReservation(reservation)}
                    >
                      {format(parseISO(reservation.date), "HH:mm")} - {reservation.name}
                    </div>
                  ))}

                  {dayReservations.length > 3 && (
                    <div className="text-xs text-center text-[#6B7280]">+{dayReservations.length - 3} weitere</div>
                  )}
                </div>
              </div>
            )
          })}
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={handlePrevious}>
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <Button variant="outline" size="sm" onClick={handleToday}>
            Heute
          </Button>
          <Button variant="outline" size="sm" onClick={handleNext}>
            <ChevronRight className="h-4 w-4" />
          </Button>
          <h2 className="text-lg font-medium ml-2">
            {view === "month"
              ? format(currentDate, "MMMM yyyy", { locale: de })
              : format(weekStart, "d. MMM", { locale: de }) + " - " + format(weekEnd, "d. MMM yyyy", { locale: de })}
          </h2>
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <Tabs value={view} onValueChange={(v) => setView(v as "day" | "week" | "month")}>
            <TabsList className="bg-[#F7F7F7]">
              <TabsTrigger value="day" className="data-[state=active]:bg-white">
                Tag
              </TabsTrigger>
              <TabsTrigger value="week" className="data-[state=active]:bg-white">
                Woche
              </TabsTrigger>
              <TabsTrigger value="month" className="data-[state=active]:bg-white">
                Monat
              </TabsTrigger>
            </TabsList>
          </Tabs>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="icon" className="h-9 w-9">
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-[200px] bg-white border-[#EAEAEA]">
              <DropdownMenuItem>Alle Reservierungen exportieren</DropdownMenuItem>
              <DropdownMenuItem>Drucken</DropdownMenuItem>
              <DropdownMenuItem>Einstellungen</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {view === "day" && renderDayView()}
      {view === "week" && renderWeekView()}
      {view === "month" && renderMonthView()}

      {selectedReservation && (
        <ViewReservationDialog
          reservation={selectedReservation}
          open={!!selectedReservation}
          onOpenChange={(open) => !open && setSelectedReservation(null)}
        />
      )}
    </div>
  )
}
