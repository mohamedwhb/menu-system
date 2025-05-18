"use client"

import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { CheckCircle2, Clock } from "lucide-react"

export function RecentOrders() {
  // In einer echten Anwendung würden diese Daten von einer API kommen
  const recentOrders = [
    {
      id: "ORD-007",
      customer: "Markus Schmidt",
      table: "Tisch 3",
      time: "Vor 5 Minuten",
      amount: "€42,80",
      status: "open",
      items: ["Pizza Margherita", "Tiramisu", "2x Wasser"],
    },
    {
      id: "ORD-006",
      customer: "Julia Weber",
      table: "Tisch 7",
      time: "Vor 12 Minuten",
      amount: "€35,50",
      status: "paid",
      items: ["Pasta Carbonara", "Salat", "Wein"],
    },
    {
      id: "ORD-005",
      customer: "Thomas Müller",
      table: "Tisch 2",
      time: "Vor 28 Minuten",
      amount: "€56,20",
      status: "paid",
      items: ["Steak", "Pommes", "Bier"],
    },
    {
      id: "ORD-004",
      customer: "Anna Schneider",
      table: "Tisch 5",
      time: "Vor 45 Minuten",
      amount: "€29,90",
      status: "paid",
      items: ["Burger", "Pommes", "Cola"],
    },
    {
      id: "ORD-003",
      customer: "Michael Wagner",
      table: "Tisch 1",
      time: "Vor 1 Stunde",
      amount: "€38,70",
      status: "paid",
      items: ["Risotto", "Tiramisu", "Wasser"],
    },
  ]

  return (
    <div className="space-y-4">
      {recentOrders.map((order) => (
        <div key={order.id} className="flex items-center justify-between space-x-4">
          <div className="flex items-center space-x-4">
            <Avatar className="h-8 w-8">
              <AvatarFallback className="bg-blue-100 text-blue-600">
                {order.customer
                  .split(" ")
                  .map((n) => n[0])
                  .join("")}
              </AvatarFallback>
            </Avatar>
            <div>
              <p className="text-sm font-medium leading-none">{order.customer}</p>
              <p className="text-sm text-muted-foreground">{order.table}</p>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <div className="text-right">
              <p className="text-sm font-medium">{order.amount}</p>
              <p className="text-xs text-muted-foreground">{order.time}</p>
            </div>
            <Badge variant={order.status === "paid" ? "outline" : "default"} className="ml-2">
              {order.status === "paid" ? (
                <div className="flex items-center space-x-1">
                  <CheckCircle2 className="h-3 w-3 text-green-500" />
                  <span className="text-green-500">Bezahlt</span>
                </div>
              ) : (
                <div className="flex items-center space-x-1">
                  <Clock className="h-3 w-3 text-amber-500" />
                  <span className="text-amber-500">Offen</span>
                </div>
              )}
            </Badge>
          </div>
        </div>
      ))}
    </div>
  )
}
