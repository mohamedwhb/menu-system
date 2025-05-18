"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowUpRight, ArrowDownRight, Users, ShoppingBag, Euro, Utensils } from "lucide-react"

export function DashboardStats() {
  // In einer echten Anwendung würden diese Daten von einer API kommen
  const stats = [
    {
      title: "Gesamtumsatz",
      value: "€2.350,25",
      change: "+12,5%",
      trend: "up",
      icon: Euro,
    },
    {
      title: "Bestellungen",
      value: "42",
      change: "+8,2%",
      trend: "up",
      icon: ShoppingBag,
    },
    {
      title: "Kunden",
      value: "28",
      change: "+5,7%",
      trend: "up",
      icon: Users,
    },
    {
      title: "Durchschn. Bestellwert",
      value: "€35,80",
      change: "-2,3%",
      trend: "down",
      icon: Utensils,
    },
  ]

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {stats.map((stat, index) => (
        <Card key={index}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
            <stat.icon className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stat.value}</div>
            <div className="flex items-center space-x-1 text-xs">
              {stat.trend === "up" ? (
                <ArrowUpRight className="h-4 w-4 text-green-500" />
              ) : (
                <ArrowDownRight className="h-4 w-4 text-red-500" />
              )}
              <span className={stat.trend === "up" ? "text-green-500" : "text-red-500"}>{stat.change}</span>
              <span className="text-muted-foreground">im Vergleich zur Vorwoche</span>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
