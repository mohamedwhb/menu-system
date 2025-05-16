"use client"

import type React from "react"

import { useState } from "react"
import { Search, Calendar, Filter } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Calendar as CalendarComponent } from "@/components/ui/calendar"
import { format } from "date-fns"
import { de } from "date-fns/locale"

export function OrdersFilter() {
  const [filter, setFilter] = useState("all")
  const [date, setDate] = useState<Date | undefined>(undefined)
  const [searchQuery, setSearchQuery] = useState("")

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    // Implement search functionality
    console.log("Searching for:", searchQuery)
  }

  const clearFilters = () => {
    setFilter("all")
    setDate(undefined)
    setSearchQuery("")
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <div className="flex flex-wrap items-center gap-2">
          <Select value={filter} onValueChange={setFilter}>
            <SelectTrigger className="w-[180px] bg-white border-[#EAEAEA]">
              <SelectValue placeholder="Filter" />
            </SelectTrigger>
            <SelectContent className="bg-white border-[#EAEAEA]">
              <SelectItem value="all">Alle Bestellungen</SelectItem>
              <SelectItem value="new">Neue Bestellungen</SelectItem>
              <SelectItem value="in-progress">In Bearbeitung</SelectItem>
              <SelectItem value="completed">Abgeschlossen</SelectItem>
              <SelectItem value="cancelled">Storniert</SelectItem>
            </SelectContent>
          </Select>

          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                size="sm"
                className="border-[#EAEAEA] hover:bg-[#F7F7F7] flex items-center gap-2"
              >
                <Calendar className="h-4 w-4" />
                {date ? format(date, "dd.MM.yyyy", { locale: de }) : "Datum wählen"}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0 bg-white" align="start">
              <CalendarComponent mode="single" selected={date} onSelect={setDate} initialFocus />
            </PopoverContent>
          </Popover>

          {(filter !== "all" || date || searchQuery) && (
            <Button variant="ghost" size="sm" onClick={clearFilters} className="text-[#6B7280] hover:text-[#1F1F1F]">
              Filter zurücksetzen
            </Button>
          )}
        </div>

        <form onSubmit={handleSearch} className="relative w-full sm:w-auto">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
          <Input
            type="search"
            placeholder="Bestellung suchen..."
            className="pl-9 w-full sm:w-[250px] bg-white border-[#EAEAEA]"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </form>
      </div>

      {filter !== "all" && (
        <div className="flex items-center gap-2 text-sm text-[#6B7280]">
          <Filter className="h-4 w-4" />
          <span>
            Aktive Filter:
            {filter === "new" && " Neue Bestellungen"}
            {filter === "in-progress" && " In Bearbeitung"}
            {filter === "completed" && " Abgeschlossen"}
            {filter === "cancelled" && " Storniert"}
            {date && `, Datum: ${format(date, "dd.MM.yyyy", { locale: de })}`}
          </span>
        </div>
      )}
    </div>
  )
}
