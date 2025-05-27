"use client"

import { useState, useEffect, useMemo, useCallback, useTransition } from "react"
import { ReservationHeader } from "@/components/dashboard/reservations/reservation-header"
import { ReservationCalendar } from "@/components/dashboard/reservations/reservation-calendar"
import { ReservationSidebar } from "@/components/dashboard/reservations/reservation-sidebar"
import { ReservationList } from "@/components/dashboard/reservations/reservation-list"
import { ReservationStats } from "@/components/dashboard/reservations/reservation-stats"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Calendar, List, BarChart3, Settings, Download, Upload } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { reservations } from "@/data/reservations"
import { format, parseISO, isSameDay } from "date-fns"
import { de } from "date-fns/locale"

// Types
interface ReservationFilters {
  status: string[]
  dateRange: { from: Date | null; to: Date | null }
  tableNumbers: string[]
  guestCount: { min: number; max: number }
  searchQuery: string
}

interface ReservationSettings {
  autoRefresh: boolean
  refreshInterval: number
  defaultView: "calendar" | "list" | "stats"
  showConflicts: boolean
  enableNotifications: boolean
}

export default function ReservationsPage() {
  const [isPending, startTransition] = useTransition()
  const [activeView, setActiveView] = useState<"calendar" | "list" | "stats">("calendar")
  const [selectedDate, setSelectedDate] = useState<Date>(new Date())
  const [isLoading, setIsLoading] = useState(false)
  const { toast } = useToast()

  // Filters state
  const [filters, setFilters] = useState<ReservationFilters>({
    status: ["confirmed", "pending"],
    dateRange: { from: null, to: null },
    tableNumbers: [],
    guestCount: { min: 1, max: 20 },
    searchQuery: "",
  })

  // Settings state
  const [settings, setSettings] = useState<ReservationSettings>({
    autoRefresh: true,
    refreshInterval: 30000, // 30 seconds
    defaultView: "calendar",
    showConflicts: true,
    enableNotifications: true,
  })

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.ctrlKey || event.metaKey) {
        switch (event.key) {
          case "n":
            event.preventDefault()
            // Trigger new reservation dialog
            document.dispatchEvent(new CustomEvent("openNewReservation"))
            break
          case "f":
            event.preventDefault()
            // Focus search
            document.querySelector<HTMLInputElement>('[placeholder*="Suchen"]')?.focus()
            break
          case "1":
            event.preventDefault()
            setActiveView("calendar")
            break
          case "2":
            event.preventDefault()
            setActiveView("list")
            break
          case "3":
            event.preventDefault()
            setActiveView("stats")
            break
          case "e":
            event.preventDefault()
            handleExport()
            break
        }
      }
    }

    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [])

  // Auto-refresh functionality
  useEffect(() => {
    if (!settings.autoRefresh) return

    const interval = setInterval(() => {
      // Simulate data refresh
      console.log("Auto-refreshing reservations...")
    }, settings.refreshInterval)

    return () => clearInterval(interval)
  }, [settings.autoRefresh, settings.refreshInterval])

  // Filtered and sorted reservations
  const filteredReservations = useMemo(() => {
    const filtered = reservations.filter((reservation) => {
      // Status filter
      if (!filters.status.includes(reservation.status)) return false

      // Date range filter
      const resDate = parseISO(reservation.date)
      if (filters.dateRange.from && resDate < filters.dateRange.from) return false
      if (filters.dateRange.to && resDate > filters.dateRange.to) return false

      // Table filter
      if (filters.tableNumbers.length > 0 && !filters.tableNumbers.includes(reservation.table)) return false

      // Guest count filter
      if (reservation.guests < filters.guestCount.min || reservation.guests > filters.guestCount.max) return false

      // Search filter
      if (filters.searchQuery) {
        const query = filters.searchQuery.toLowerCase()
        return (
          reservation.name.toLowerCase().includes(query) ||
          (reservation.email && reservation.email.toLowerCase().includes(query)) ||
          (reservation.phone && reservation.phone.toLowerCase().includes(query)) ||
          reservation.table.toString().includes(query)
        )
      }

      return true
    })

    // Sort by date
    filtered.sort((a, b) => parseISO(a.date).getTime() - parseISO(b.date).getTime())

    return filtered
  }, [filters])

  // Statistics
  const stats = useMemo(() => {
    const today = new Date()
    const todayReservations = filteredReservations.filter((res) => isSameDay(parseISO(res.date), today))

    return {
      total: filteredReservations.length,
      today: todayReservations.length,
      confirmed: filteredReservations.filter((r) => r.status === "confirmed").length,
      pending: filteredReservations.filter((r) => r.status === "pending").length,
      cancelled: filteredReservations.filter((r) => r.status === "cancelled").length,
      totalGuests: filteredReservations.reduce((sum, r) => sum + r.guests, 0),
      avgGuestsPerReservation:
        filteredReservations.length > 0
          ? Math.round(filteredReservations.reduce((sum, r) => sum + r.guests, 0) / filteredReservations.length)
          : 0,
    }
  }, [filteredReservations])

  // Handlers
  const handleViewChange = useCallback((view: "calendar" | "list" | "stats") => {
    startTransition(() => {
      setActiveView(view)
    })
  }, [])

  const handleFilterChange = useCallback((newFilters: Partial<ReservationFilters>) => {
    startTransition(() => {
      setFilters((prev) => ({ ...prev, ...newFilters }))
    })
  }, [])

  const handleExport = useCallback(async () => {
    setIsLoading(true)
    try {
      // Simulate export
      await new Promise((resolve) => setTimeout(resolve, 1000))

      const csvContent = [
        "Name,Datum,Uhrzeit,Gäste,Tisch,Status,Email,Telefon",
        ...filteredReservations.map((res) =>
          [
            res.name,
            format(parseISO(res.date), "dd.MM.yyyy", { locale: de }),
            format(parseISO(res.date), "HH:mm", { locale: de }),
            res.guests,
            res.table,
            res.status,
            res.email || "",
            res.phone || "",
          ].join(","),
        ),
      ].join("\n")

      const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" })
      const link = document.createElement("a")
      const url = URL.createObjectURL(blob)
      link.setAttribute("href", url)
      link.setAttribute("download", `reservierungen_${format(new Date(), "yyyy-MM-dd")}.csv`)
      link.style.visibility = "hidden"
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      URL.revokeObjectURL(url)

      toast({
        title: "Export erfolgreich",
        description: `${filteredReservations.length} Reservierungen exportiert`,
      })
    } catch (error) {
      toast({
        title: "Export fehlgeschlagen",
        description: "Beim Exportieren ist ein Fehler aufgetreten",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }, [filteredReservations, toast])

  const handleImport = useCallback(
    async (file: File) => {
      setIsLoading(true)
      try {
        // Simulate import
        await new Promise((resolve) => setTimeout(resolve, 1500))

        toast({
          title: "Import erfolgreich",
          description: "Reservierungen wurden importiert",
        })
      } catch (error) {
        toast({
          title: "Import fehlgeschlagen",
          description: "Beim Importieren ist ein Fehler aufgetreten",
          variant: "destructive",
        })
      } finally {
        setIsLoading(false)
      }
    },
    [toast],
  )

  const handleBulkAction = useCallback(
    async (action: string, reservationIds: string[]) => {
      setIsLoading(true)
      try {
        // Simulate bulk action
        await new Promise((resolve) => setTimeout(resolve, 1000))

        toast({
          title: "Aktion erfolgreich",
          description: `${action} für ${reservationIds.length} Reservierungen ausgeführt`,
        })
      } catch (error) {
        toast({
          title: "Aktion fehlgeschlagen",
          description: "Beim Ausführen der Aktion ist ein Fehler aufgetreten",
          variant: "destructive",
        })
      } finally {
        setIsLoading(false)
      }
    },
    [toast],
  )

  return (
    <div className="space-y-6">
      {/* Header with enhanced functionality */}
      <ReservationHeader
        onViewChange={handleViewChange}
        onFilterChange={handleFilterChange}
        onExport={handleExport}
        onImport={handleImport}
        filters={filters}
        isLoading={isLoading || isPending}
        stats={stats}
      />

      {/* Quick Stats Bar */}
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-4">
        <div className="rounded-lg border border-[#EAEAEA] bg-white p-4 text-center">
          <div className="text-2xl font-bold text-[#006AFF]">{stats.total}</div>
          <div className="text-xs text-[#6B7280]">Gesamt</div>
        </div>
        <div className="rounded-lg border border-[#EAEAEA] bg-white p-4 text-center">
          <div className="text-2xl font-bold text-[#16A34A]">{stats.today}</div>
          <div className="text-xs text-[#6B7280]">Heute</div>
        </div>
        <div className="rounded-lg border border-[#EAEAEA] bg-white p-4 text-center">
          <div className="text-2xl font-bold text-[#16A34A]">{stats.confirmed}</div>
          <div className="text-xs text-[#6B7280]">Bestätigt</div>
        </div>
        <div className="rounded-lg border border-[#EAEAEA] bg-white p-4 text-center">
          <div className="text-2xl font-bold text-[#CA8A04]">{stats.pending}</div>
          <div className="text-xs text-[#6B7280]">Ausstehend</div>
        </div>
        <div className="rounded-lg border border-[#EAEAEA] bg-white p-4 text-center">
          <div className="text-2xl font-bold text-[#DC2626]">{stats.cancelled}</div>
          <div className="text-xs text-[#6B7280]">Storniert</div>
        </div>
        <div className="rounded-lg border border-[#EAEAEA] bg-white p-4 text-center">
          <div className="text-2xl font-bold text-[#6B7280]">{stats.totalGuests}</div>
          <div className="text-xs text-[#6B7280]">Gäste</div>
        </div>
        <div className="rounded-lg border border-[#EAEAEA] bg-white p-4 text-center">
          <div className="text-2xl font-bold text-[#6B7280]">Ø {stats.avgGuestsPerReservation}</div>
          <div className="text-xs text-[#6B7280]">Gäste/Res.</div>
        </div>
      </div>

      {/* Enhanced View Tabs */}
      <Tabs value={activeView} onValueChange={(v) => handleViewChange(v as "calendar" | "list" | "stats")}>
        <div className="flex items-center justify-between">
          <TabsList className="bg-[#F7F7F7]">
            <TabsTrigger value="calendar" className="data-[state=active]:bg-white gap-2">
              <Calendar className="h-4 w-4" />
              Kalender
            </TabsTrigger>
            <TabsTrigger value="list" className="data-[state=active]:bg-white gap-2">
              <List className="h-4 w-4" />
              Liste
            </TabsTrigger>
            <TabsTrigger value="stats" className="data-[state=active]:bg-white gap-2">
              <BarChart3 className="h-4 w-4" />
              Statistiken
            </TabsTrigger>
          </TabsList>

          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" onClick={handleExport} disabled={isLoading}>
              <Download className="h-4 w-4 mr-2" />
              Export
            </Button>
            <Button variant="outline" size="sm" disabled={isLoading}>
              <Upload className="h-4 w-4 mr-2" />
              Import
            </Button>
            <Button variant="outline" size="sm">
              <Settings className="h-4 w-4" />
            </Button>
          </div>
        </div>

        <TabsContent value="calendar" className="mt-6">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            <div className="lg:col-span-3">
              <div className="rounded-lg border border-[#EAEAEA] bg-white p-6 shadow-sm">
                <ReservationCalendar
                  reservations={filteredReservations}
                  selectedDate={selectedDate}
                  onDateChange={setSelectedDate}
                  showConflicts={settings.showConflicts}
                />
              </div>
            </div>
            <div className="lg:col-span-1">
              <ReservationSidebar
                reservations={filteredReservations}
                selectedDate={selectedDate}
                onFilterChange={handleFilterChange}
                filters={filters}
              />
            </div>
          </div>
        </TabsContent>

        <TabsContent value="list" className="mt-6">
          <div className="rounded-lg border border-[#EAEAEA] bg-white shadow-sm">
            <ReservationList
              reservations={filteredReservations}
              onBulkAction={handleBulkAction}
              isLoading={isLoading}
            />
          </div>
        </TabsContent>

        <TabsContent value="stats" className="mt-6">
          <ReservationStats reservations={filteredReservations} stats={stats} />
        </TabsContent>
      </Tabs>

      {/* Keyboard Shortcuts Help */}
      <div className="fixed bottom-4 right-4 text-xs text-[#6B7280] bg-white border border-[#EAEAEA] rounded-md p-2 shadow-sm">
        <div className="font-medium mb-1">Tastenkürzel:</div>
        <div>Ctrl+N: Neue Reservierung</div>
        <div>Ctrl+F: Suchen</div>
        <div>Ctrl+E: Exportieren</div>
        <div>Ctrl+1/2/3: Ansicht wechseln</div>
      </div>
    </div>
  )
}
