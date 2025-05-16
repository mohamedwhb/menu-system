"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import {
  ArrowUpDown,
  MoreHorizontal,
  CheckCircle2,
  Clock,
  AlertCircle,
  XCircle,
  ChevronLeft,
  ChevronRight,
  Receipt,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Badge } from "@/components/ui/badge"
import { ViewOrderDialog } from "@/components/dashboard/orders/view-order-dialog"
import { orders } from "@/data/orders"

export function OrdersTable() {
  const router = useRouter()
  const [sortColumn, setSortColumn] = useState<string | null>(null)
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc")
  const [selectedOrder, setSelectedOrder] = useState<string | null>(null)
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 10

  const handleSort = (column: string) => {
    if (sortColumn === column) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc")
    } else {
      setSortColumn(column)
      setSortDirection("asc")
    }
  }

  // Sort orders based on current sort settings
  const sortedOrders = [...orders].sort((a, b) => {
    if (!sortColumn) return 0

    let valueA, valueB

    switch (sortColumn) {
      case "id":
        valueA = a.id
        valueB = b.id
        break
      case "table":
        valueA = a.table
        valueB = b.table
        break
      case "time":
        valueA = new Date(`${a.date} ${a.time}`).getTime()
        valueB = new Date(`${b.date} ${b.time}`).getTime()
        break
      case "status":
        valueA = a.status
        valueB = b.status
        break
      case "amount":
        valueA = a.amount
        valueB = b.amount
        break
      default:
        return 0
    }

    if (valueA < valueB) return sortDirection === "asc" ? -1 : 1
    if (valueA > valueB) return sortDirection === "asc" ? 1 : -1
    return 0
  })

  // Pagination
  const totalPages = Math.ceil(sortedOrders.length / itemsPerPage)
  const paginatedOrders = sortedOrders.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage)

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "new":
        return (
          <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200 flex items-center gap-1">
            <Clock className="h-3 w-3" />
            Neu
          </Badge>
        )
      case "in-progress":
        return (
          <Badge variant="outline" className="bg-amber-50 text-amber-700 border-amber-200 flex items-center gap-1">
            <Clock className="h-3 w-3" />
            In Bearbeitung
          </Badge>
        )
      case "completed":
        return (
          <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200 flex items-center gap-1">
            <CheckCircle2 className="h-3 w-3" />
            Abgeschlossen
          </Badge>
        )
      case "cancelled":
        return (
          <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200 flex items-center gap-1">
            <XCircle className="h-3 w-3" />
            Storniert
          </Badge>
        )
      default:
        return null
    }
  }

  const viewReceipt = (orderId: string) => {
    router.push(`/dashboard/orders/${orderId}/receipt`)
  }

  return (
    <>
      <div className="rounded-md border border-[#EAEAEA] overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full caption-bottom text-sm">
            <thead className="border-b border-[#EAEAEA] bg-[#F9FAFB]">
              <tr>
                <th className="h-12 px-4 text-left align-middle font-medium text-[#6B7280]">
                  <Button
                    variant="ghost"
                    onClick={() => handleSort("id")}
                    className="flex items-center gap-1 hover:bg-transparent hover:text-[#1F1F1F] -ml-3"
                  >
                    Bestellung
                    <ArrowUpDown className="h-4 w-4" />
                  </Button>
                </th>
                <th className="h-12 px-4 text-left align-middle font-medium text-[#6B7280]">
                  <Button
                    variant="ghost"
                    onClick={() => handleSort("table")}
                    className="flex items-center gap-1 hover:bg-transparent hover:text-[#1F1F1F] -ml-3"
                  >
                    Tisch
                    <ArrowUpDown className="h-4 w-4" />
                  </Button>
                </th>
                <th className="h-12 px-4 text-left align-middle font-medium text-[#6B7280]">
                  <Button
                    variant="ghost"
                    onClick={() => handleSort("time")}
                    className="flex items-center gap-1 hover:bg-transparent hover:text-[#1F1F1F] -ml-3"
                  >
                    Zeit
                    <ArrowUpDown className="h-4 w-4" />
                  </Button>
                </th>
                <th className="h-12 px-4 text-left align-middle font-medium text-[#6B7280]">Artikel</th>
                <th className="h-12 px-4 text-left align-middle font-medium text-[#6B7280]">
                  <Button
                    variant="ghost"
                    onClick={() => handleSort("status")}
                    className="flex items-center gap-1 hover:bg-transparent hover:text-[#1F1F1F] -ml-3"
                  >
                    Status
                    <ArrowUpDown className="h-4 w-4" />
                  </Button>
                </th>
                <th className="h-12 px-4 text-right align-middle font-medium text-[#6B7280]">
                  <Button
                    variant="ghost"
                    onClick={() => handleSort("amount")}
                    className="flex items-center gap-1 hover:bg-transparent hover:text-[#1F1F1F] -ml-3"
                  >
                    Betrag
                    <ArrowUpDown className="h-4 w-4" />
                  </Button>
                </th>
                <th className="h-12 w-[50px] px-4 align-middle"></th>
              </tr>
            </thead>
            <tbody>
              {paginatedOrders.map((order) => (
                <tr
                  key={order.id}
                  className="border-b border-[#EAEAEA] hover:bg-[#F9FAFB] transition-colors cursor-pointer"
                  onClick={() => setSelectedOrder(order.id)}
                >
                  <td className="p-4 align-middle font-medium text-[#1F1F1F]">{order.id}</td>
                  <td className="p-4 align-middle">{order.table}</td>
                  <td className="p-4 align-middle">
                    <div>{order.time}</div>
                    <div className="text-xs text-[#6B7280]">{order.date}</div>
                  </td>
                  <td className="p-4 align-middle">
                    <div className="flex flex-col">
                      {order.items.map((item, index) => (
                        <span key={index} className={index > 0 ? "text-xs text-[#6B7280]" : ""}>
                          {item.name} {item.quantity > 1 && `(${item.quantity}x)`}
                        </span>
                      ))}
                      {order.items.length > 3 && (
                        <span className="text-xs text-[#6B7280]">+{order.items.length - 3} weitere</span>
                      )}
                    </div>
                  </td>
                  <td className="p-4 align-middle">{getStatusBadge(order.status)}</td>
                  <td className="p-4 align-middle text-right font-medium">{order.amount.toFixed(2)} €</td>
                  <td className="p-4 align-middle" onClick={(e) => e.stopPropagation()}>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                          <MoreHorizontal className="h-4 w-4" />
                          <span className="sr-only">Aktionen</span>
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="bg-white border-[#EAEAEA]">
                        <DropdownMenuItem onClick={() => setSelectedOrder(order.id)}>Details anzeigen</DropdownMenuItem>
                        <DropdownMenuItem onClick={() => viewReceipt(order.id)}>
                          <Receipt className="h-4 w-4 mr-2" />
                          Beleg anzeigen
                        </DropdownMenuItem>
                        {order.status === "new" && <DropdownMenuItem>In Bearbeitung setzen</DropdownMenuItem>}
                        {(order.status === "new" || order.status === "in-progress") && (
                          <DropdownMenuItem>Als abgeschlossen markieren</DropdownMenuItem>
                        )}
                        {order.status !== "cancelled" && (
                          <DropdownMenuItem className="text-red-500">Stornieren</DropdownMenuItem>
                        )}
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </td>
                </tr>
              ))}

              {paginatedOrders.length === 0 && (
                <tr>
                  <td colSpan={7} className="p-8 text-center text-[#6B7280]">
                    <div className="flex flex-col items-center gap-2">
                      <AlertCircle className="h-8 w-8 text-[#9CA3AF]" />
                      <h3 className="text-lg font-medium text-[#1F1F1F]">Keine Bestellungen gefunden</h3>
                      <p>Es wurden keine Bestellungen gefunden, die den Filterkriterien entsprechen.</p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <div className="flex items-center justify-between px-4 py-3 border-t border-[#EAEAEA] bg-[#F9FAFB]">
          <div className="text-sm text-[#6B7280]">
            Zeige <strong>{(currentPage - 1) * itemsPerPage + 1}</strong> bis{" "}
            <strong>{Math.min(currentPage * itemsPerPage, orders.length)}</strong> von <strong>{orders.length}</strong>{" "}
            Bestellungen
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              disabled={currentPage === 1}
              onClick={() => setCurrentPage(currentPage - 1)}
              className="border-[#EAEAEA]"
            >
              <ChevronLeft className="h-4 w-4 mr-1" /> Zurück
            </Button>
            <Button
              variant="outline"
              size="sm"
              disabled={currentPage === totalPages}
              onClick={() => setCurrentPage(currentPage + 1)}
              className="border-[#EAEAEA] hover:bg-[#F7F7F7]"
            >
              Weiter <ChevronRight className="h-4 w-4 ml-1" />
            </Button>
          </div>
        </div>
      </div>

      {selectedOrder && (
        <ViewOrderDialog
          orderId={selectedOrder}
          open={!!selectedOrder}
          onOpenChange={(open) => {
            if (!open) setSelectedOrder(null)
          }}
        />
      )}
    </>
  )
}
