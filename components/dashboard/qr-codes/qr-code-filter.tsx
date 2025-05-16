"use client"

import { Search, Filter } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuCheckboxItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useState } from "react"

export function QrCodeFilter() {
  const [showActive, setShowActive] = useState(true)
  const [showInactive, setShowInactive] = useState(true)

  return (
    <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between mb-6">
      <div className="relative w-full sm:w-auto">
        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
        <Input
          type="search"
          placeholder="Tischnummer oder Name suchen..."
          className="pl-9 w-full sm:w-[250px] bg-white border-[#EAEAEA]"
        />
      </div>

      <div className="flex items-center gap-2 w-full sm:w-auto">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="border-[#EAEAEA]">
              <Filter className="mr-2 h-4 w-4" />
              Filter
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56 bg-white border-[#EAEAEA]">
            <DropdownMenuLabel>Status</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuCheckboxItem checked={showActive} onCheckedChange={setShowActive}>
              Aktiv
            </DropdownMenuCheckboxItem>
            <DropdownMenuCheckboxItem checked={showInactive} onCheckedChange={setShowInactive}>
              Inaktiv
            </DropdownMenuCheckboxItem>
          </DropdownMenuContent>
        </DropdownMenu>

        <Button variant="outline" className="border-[#EAEAEA]">
          Sortieren
        </Button>
      </div>
    </div>
  )
}
