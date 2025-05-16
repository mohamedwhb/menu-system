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

export function MenuFilter() {
  const [showVegetarian, setShowVegetarian] = useState(false)
  const [showVegan, setShowVegan] = useState(false)
  const [showGlutenFree, setShowGlutenFree] = useState(false)
  const [showFeatured, setShowFeatured] = useState(false)

  return (
    <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
      <div className="relative w-full sm:w-auto">
        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
        <Input
          type="search"
          placeholder="Gericht suchen..."
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
            <DropdownMenuLabel>Diät-Optionen</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuCheckboxItem checked={showVegetarian} onCheckedChange={setShowVegetarian}>
              Vegetarisch
            </DropdownMenuCheckboxItem>
            <DropdownMenuCheckboxItem checked={showVegan} onCheckedChange={setShowVegan}>
              Vegan
            </DropdownMenuCheckboxItem>
            <DropdownMenuCheckboxItem checked={showGlutenFree} onCheckedChange={setShowGlutenFree}>
              Glutenfrei
            </DropdownMenuCheckboxItem>
            <DropdownMenuSeparator />
            <DropdownMenuLabel>Status</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuCheckboxItem checked={showFeatured} onCheckedChange={setShowFeatured}>
              Empfohlen
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
