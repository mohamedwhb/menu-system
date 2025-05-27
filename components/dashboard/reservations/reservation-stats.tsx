"use client"

import { useMemo } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { BarChart3, TrendingUp, TrendingDown, Users, Calendar, Clock, MapPin } from "lucide-react"
import { format, parseISO, startOfWeek, endOfWeek, eachDayOfInterval, isSameDay } from "date-fns"
import { de } from "date-fns/locale"
import type { reservations } from "@/data/reservations"

interface ReservationStatsProps {
  reservations: typeof reservations
  stats: {
    total: number
    today: number
    confirmed: number
    pending: number
    cancelled: number
    totalGuests: number
    avgGuestsPerReservation: number
  }
}

export function ReservationStats({ reservations, stats }: ReservationStatsProps) {
  // Weekly data
  const weeklyData = useMemo(() => {
    const today = new Date()
    const weekStart = startOfWeek(today, { weekStartsOn: 1 })
    const weekEnd = endOfWeek(today, { weekStartsOn: 1 })
    const weekDays = eachDayOfInterval({ start: weekStart, end: weekEnd })

    return weekDays.map((day) => {
      const dayReservations = reservations.filter((res) => isSameDay(parseISO(res.date), day))
      return {
        day: format(day, "EEEE", { locale: de }),
        date: format(day, "dd.MM", { locale: de }),
        reservations: dayReservations.length,
        guests: dayReservations.reduce((sum, res) => sum + res.guests, 0),
      }
    })
  }, [reservations])

  // Table utilization
  const tableStats = useMemo(() => {
    const tableData: Record<string, { reservations: number; guests: number }> = {}

    reservations.forEach((res) => {
      if (!tableData[res.table]) {
        tableData[res.table] = { reservations: 0, guests: 0 }
      }
      tableData[res.table].reservations++
      tableData[res.table].guests += res.guests
    })

    return Object.entries(tableData)
      .map(([table, data]) => ({
        table,
        ...data,
        utilization: Math.min((data.reservations / 10) * 100, 100), // Assuming max 10 reservations per table
      }))
      .sort((a, b) => b.utilization - a.utilization)
  }, [reservations])

  // Time distribution
  const timeDistribution = useMemo(() => {
    const hours: Record<number, number> = {}

    reservations.forEach((res) => {
      const hour = parseISO(res.date).getHours()
      hours[hour] = (hours[hour] || 0) + 1
    })

    return Object.entries(hours)
      .map(([hour, count]) => ({
        hour: Number.parseInt(hour),
        count,
        percentage: (count / reservations.length) * 100,
      }))
      .sort((a, b) => a.hour - b.hour)
  }, [reservations])

  const maxWeeklyReservations = Math.max(...weeklyData.map((d) => d.reservations))
  const maxWeeklyGuests = Math.max(...weeklyData.map((d) => d.guests))

  return (
    <div className="space-y-6">
      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Gesamtreservierungen</CardTitle>
            <Calendar className="h-4 w-4 text-[#6B7280]" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.total}</div>
            <p className="text-xs text-[#6B7280]">
              <span className="text-[#16A34A]">+12%</span> vs. letzter Monat
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Durchschnittliche Gäste</CardTitle>
            <Users className="h-4 w-4 text-[#6B7280]" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.avgGuestsPerReservation}</div>
            <p className="text-xs text-[#6B7280]">
              <span className="text-[#DC2626]">-2%</span> vs. letzter Monat
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Bestätigungsrate</CardTitle>
            <TrendingUp className="h-4 w-4 text-[#6B7280]" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {stats.total > 0 ? Math.round((stats.confirmed / stats.total) * 100) : 0}%
            </div>
            <p className="text-xs text-[#6B7280]">
              <span className="text-[#16A34A]">+5%</span> vs. letzter Monat
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Stornierungsrate</CardTitle>
            <TrendingDown className="h-4 w-4 text-[#6B7280]" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {stats.total > 0 ? Math.round((stats.cancelled / stats.total) * 100) : 0}%
            </div>
            <p className="text-xs text-[#6B7280]">
              <span className="text-[#16A34A]">-3%</span> vs. letzter Monat
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Weekly Overview */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BarChart3 className="h-5 w-5" />
            Wochenübersicht
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {weeklyData.map((day, index) => (
              <div key={index} className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="font-medium">{day.day}</span>
                  <span className="text-[#6B7280]">{day.date}</span>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <div className="flex items-center justify-between text-xs mb-1">
                      <span>Reservierungen</span>
                      <span>{day.reservations}</span>
                    </div>
                    <Progress
                      value={maxWeeklyReservations > 0 ? (day.reservations / maxWeeklyReservations) * 100 : 0}
                      className="h-2"
                    />
                  </div>
                  <div>
                    <div className="flex items-center justify-between text-xs mb-1">
                      <span>Gäste</span>
                      <span>{day.guests}</span>
                    </div>
                    <Progress value={maxWeeklyGuests > 0 ? (day.guests / maxWeeklyGuests) * 100 : 0} className="h-2" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Table Utilization */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MapPin className="h-5 w-5" />
              Tischauslastung
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {tableStats.slice(0, 8).map((table) => (
                <div key={table.table} className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="font-medium">Tisch {table.table}</span>
                    <span className="text-[#6B7280]">
                      {table.reservations} Res. • {table.guests} Gäste
                    </span>
                  </div>
                  <Progress value={table.utilization} className="h-2" />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Time Distribution */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="h-5 w-5" />
              Zeitverteilung
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {timeDistribution.map((time) => (
                <div key={time.hour} className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="font-medium">{time.hour}:00 Uhr</span>
                    <span className="text-[#6B7280]">
                      {time.count} ({Math.round(time.percentage)}%)
                    </span>
                  </div>
                  <Progress value={time.percentage} className="h-2" />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
