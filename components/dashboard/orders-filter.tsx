"use client"

import { useState } from "react"
import { Search } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

export function OrdersFilter() {
  const [filter, setFilter] = useState("all")

  return (
    <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
      <div className="flex items-center gap-2">
        <Select value={filter} onValueChange={setFilter}>
          <SelectTrigger className="w-[180px] bg-white border-[#EAEAEA]">
            <SelectValue placeholder="Filter" />
          </SelectTrigger>
          <SelectContent className="bg-white border-[#EAEAEA]">
            <SelectItem value="all">Alle Bestellungen</SelectItem>
            <SelectItem value="open">Offene Bestellungen</SelectItem>
            <SelectItem value="paid">Bezahlte Bestellungen</SelectItem>
          </SelectContent>
        </Select>

        <Button variant="outline" size="sm" className="border-[#EAEAEA] hover:bg-[#F7F7F7]">
          Heute
        </Button>
        <Button variant="ghost" size="sm">
          Diese Woche
        </Button>
      </div>

      <div className="relative w-full sm:w-auto">
        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
        <Input
          type="search"
          placeholder="Bestellung suchen..."
          className="pl-9 w-full sm:w-[250px] bg-white border-[#EAEAEA]"
        />
      </div>
    </div>
  )
}
