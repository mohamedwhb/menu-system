"use client"

import { ArrowUpRight, ArrowDownRight, TrendingUp, Clock, CheckCircle, XCircle } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { orders } from "@/data/orders"

export function OrdersStats() {
  // Calculate statistics
  const totalOrders = orders.length
  const totalRevenue = orders.reduce((sum, order) => sum + order.amount, 0)

  const newOrders = orders.filter((order) => order.status === "new").length
  const inProgressOrders = orders.filter((order) => order.status === "in-progress").length
  const completedOrders = orders.filter((order) => order.status === "completed").length
  const cancelledOrders = orders.filter((order) => order.status === "cancelled").length

  // Calculate average order value
  const averageOrderValue = totalRevenue / totalOrders

  // Fake comparison with previous period (would come from real data)
  const revenueChange = 12.5
  const ordersChange = 8.3
  const averageChange = 4.2

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <Card className="bg-white border-[#EAEAEA]">
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-sm font-medium text-[#6B7280]">Gesamtumsatz</CardTitle>
          <div className={`flex items-center text-xs ${revenueChange >= 0 ? "text-green-600" : "text-red-600"}`}>
            {revenueChange >= 0 ? (
              <ArrowUpRight className="h-3 w-3 mr-1" />
            ) : (
              <ArrowDownRight className="h-3 w-3 mr-1" />
            )}
            {Math.abs(revenueChange)}%
          </div>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{totalRevenue.toFixed(2)} €</div>
          <p className="text-xs text-[#6B7280] mt-1">Verglichen mit dem Vormonat</p>
        </CardContent>
      </Card>

      <Card className="bg-white border-[#EAEAEA]">
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-sm font-medium text-[#6B7280]">Bestellungen</CardTitle>
          <div className={`flex items-center text-xs ${ordersChange >= 0 ? "text-green-600" : "text-red-600"}`}>
            {ordersChange >= 0 ? (
              <ArrowUpRight className="h-3 w-3 mr-1" />
            ) : (
              <ArrowDownRight className="h-3 w-3 mr-1" />
            )}
            {Math.abs(ordersChange)}%
          </div>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{totalOrders}</div>
          <p className="text-xs text-[#6B7280] mt-1">
            {newOrders} neue, {inProgressOrders} in Bearbeitung
          </p>
        </CardContent>
      </Card>

      <Card className="bg-white border-[#EAEAEA]">
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-sm font-medium text-[#6B7280]">Durchschnittswert</CardTitle>
          <div className={`flex items-center text-xs ${averageChange >= 0 ? "text-green-600" : "text-red-600"}`}>
            {averageChange >= 0 ? (
              <ArrowUpRight className="h-3 w-3 mr-1" />
            ) : (
              <ArrowDownRight className="h-3 w-3 mr-1" />
            )}
            {Math.abs(averageChange)}%
          </div>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{averageOrderValue.toFixed(2)} €</div>
          <p className="text-xs text-[#6B7280] mt-1">Pro Bestellung</p>
        </CardContent>
      </Card>

      <Card className="bg-white border-[#EAEAEA]">
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-sm font-medium text-[#6B7280]">Status</CardTitle>
        </CardHeader>
        <CardContent className="pt-0">
          <div className="grid grid-cols-2 gap-2">
            <div className="flex items-center gap-1">
              <Clock className="h-3 w-3 text-amber-500" />
              <span className="text-xs text-[#6B7280]">Offen:</span>
              <span className="text-xs font-medium">{newOrders + inProgressOrders}</span>
            </div>
            <div className="flex items-center gap-1">
              <CheckCircle className="h-3 w-3 text-green-500" />
              <span className="text-xs text-[#6B7280]">Abgeschlossen:</span>
              <span className="text-xs font-medium">{completedOrders}</span>
            </div>
            <div className="flex items-center gap-1">
              <TrendingUp className="h-3 w-3 text-blue-500" />
              <span className="text-xs text-[#6B7280]">In Bearbeitung:</span>
              <span className="text-xs font-medium">{inProgressOrders}</span>
            </div>
            <div className="flex items-center gap-1">
              <XCircle className="h-3 w-3 text-red-500" />
              <span className="text-xs text-[#6B7280]">Storniert:</span>
              <span className="text-xs font-medium">{cancelledOrders}</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
