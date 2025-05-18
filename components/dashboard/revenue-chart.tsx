"use client"

import { useEffect, useState } from "react"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export function RevenueChart() {
  const [mounted, setMounted] = useState(false)

  // Stellen Sie sicher, dass der Chart nur auf dem Client gerendert wird
  useEffect(() => {
    setMounted(true)
  }, [])

  // In einer echten Anwendung würden diese Daten von einer API kommen
  const dailyData = [
    { name: "Mo", aktuell: 1200, vorwoche: 900 },
    { name: "Di", aktuell: 1400, vorwoche: 1200 },
    { name: "Mi", aktuell: 1300, vorwoche: 1100 },
    { name: "Do", aktuell: 1500, vorwoche: 1300 },
    { name: "Fr", aktuell: 2000, vorwoche: 1600 },
    { name: "Sa", aktuell: 2200, vorwoche: 2000 },
    { name: "So", aktuell: 1800, vorwoche: 1500 },
  ]

  const weeklyData = [
    { name: "KW 1", aktuell: 8500, vorwoche: 7500 },
    { name: "KW 2", aktuell: 9200, vorwoche: 8000 },
    { name: "KW 3", aktuell: 8700, vorwoche: 8200 },
    { name: "KW 4", aktuell: 9500, vorwoche: 8700 },
  ]

  if (!mounted) {
    return (
      <div className="flex h-[300px] items-center justify-center">
        <p className="text-sm text-muted-foreground">Lade Chart...</p>
      </div>
    )
  }

  return (
    <Tabs defaultValue="daily" className="space-y-4">
      <TabsList className="grid w-full grid-cols-2">
        <TabsTrigger value="daily">Täglich</TabsTrigger>
        <TabsTrigger value="weekly">Wöchentlich</TabsTrigger>
      </TabsList>
      <TabsContent value="daily" className="h-[300px]">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={dailyData}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip formatter={(value) => [`€${value}`, undefined]} labelFormatter={(label) => `${label}tag`} />
            <Legend />
            <Line
              type="monotone"
              dataKey="aktuell"
              name="Aktuelle Woche"
              stroke="#006AFF"
              strokeWidth={2}
              dot={{ r: 4 }}
              activeDot={{ r: 6 }}
            />
            <Line
              type="monotone"
              dataKey="vorwoche"
              name="Vorwoche"
              stroke="#6B7280"
              strokeWidth={2}
              strokeDasharray="5 5"
              dot={{ r: 4 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </TabsContent>
      <TabsContent value="weekly" className="h-[300px]">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={weeklyData}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip formatter={(value) => [`€${value}`, undefined]} />
            <Legend />
            <Line
              type="monotone"
              dataKey="aktuell"
              name="Aktueller Monat"
              stroke="#006AFF"
              strokeWidth={2}
              dot={{ r: 4 }}
              activeDot={{ r: 6 }}
            />
            <Line
              type="monotone"
              dataKey="vorwoche"
              name="Vormonat"
              stroke="#6B7280"
              strokeWidth={2}
              strokeDasharray="5 5"
              dot={{ r: 4 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </TabsContent>
    </Tabs>
  )
}
