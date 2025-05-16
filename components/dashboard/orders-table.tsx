"use client"

import { useState } from "react"
import { ArrowUpDown, MoreHorizontal, CheckCircle2, Clock } from "lucide-react"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"

// Sample data for the table
const orders = [
  {
    id: "ORD-001",
    table: "Tisch 5",
    time: "12:30",
    date: "15.05.2023",
    items: ["Pasta Carbonara", "Tiramisu", "Wasser"],
    status: "paid",
    amount: 32.5,
  },
  {
    id: "ORD-002",
    table: "Tisch 3",
    time: "13:15",
    date: "15.05.2023",
    items: ["Pizza Margherita", "Salat", "Cola"],
    status: "open",
    amount: 24.9,
  },
  {
    id: "ORD-003",
    table: "Tisch 8",
    time: "14:45",
    date: "15.05.2023",
    items: ["Risotto", "Tiramisu", "Wein"],
    status: "paid",
    amount: 41.2,
  },
  {
    id: "ORD-004",
    table: "Tisch 2",
    time: "15:30",
    date: "15.05.2023",
    items: ["Steak", "Pommes", "Bier"],
    status: "open",
    amount: 38.5,
  },
  {
    id: "ORD-005",
    table: "Tisch 7",
    time: "16:20",
    date: "15.05.2023",
    items: ["Burger", "Pommes", "Milchshake"],
    status: "paid",
    amount: 28.9,
  },
  {
    id: "ORD-006",
    table: "Tisch 1",
    time: "17:10",
    date: "15.05.2023",
    items: ["Pasta Bolognese", "Salat", "Wasser"],
    status: "open",
    amount: 26.5,
  },
]

export function OrdersTable() {
  const [sortColumn, setSortColumn] = useState<string | null>(null)
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc")

  const handleSort = (column: string) => {
    if (sortColumn === column) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc")
    } else {
      setSortColumn(column)
      setSortDirection("asc")
    }
  }

  return (
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
            {orders.map((order) => (
              <tr key={order.id} className="border-b border-[#EAEAEA] hover:bg-[#F9FAFB] transition-colors">
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
                        {item}
                      </span>
                    ))}
                  </div>
                </td>
                <td className="p-4 align-middle">
                  <div className="flex items-center gap-2">
                    {order.status === "paid" ? (
                      <>
                        <CheckCircle2 className="h-4 w-4 text-[#00C286]" />
                        <span className="text-[#00C286]">Bezahlt</span>
                      </>
                    ) : (
                      <>
                        <Clock className="h-4 w-4 text-[#FF9800]" />
                        <span className="text-[#FF9800]">Offen</span>
                      </>
                    )}
                  </div>
                </td>
                <td className="p-4 align-middle text-right font-medium">{order.amount.toFixed(2)} €</td>
                <td className="p-4 align-middle">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon" className="h-8 w-8">
                        <MoreHorizontal className="h-4 w-4" />
                        <span className="sr-only">Aktionen</span>
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="bg-white border-[#EAEAEA]">
                      <DropdownMenuItem>Details anzeigen</DropdownMenuItem>
                      <DropdownMenuItem>Bearbeiten</DropdownMenuItem>
                      <DropdownMenuItem className="text-red-500">Stornieren</DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="flex items-center justify-between px-4 py-3 border-t border-[#EAEAEA] bg-[#F9FAFB]">
        <div className="text-sm text-[#6B7280]">
          Zeige <strong>6</strong> von <strong>24</strong> Bestellungen
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" disabled className="border-[#EAEAEA]">
            Zurück
          </Button>
          <Button variant="outline" size="sm" className="border-[#EAEAEA] hover:bg-[#F7F7F7]">
            Weiter
          </Button>
        </div>
      </div>
    </div>
  )
}
