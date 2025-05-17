"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Search, Filter, X } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Checkbox } from "@/components/ui/checkbox"

export interface MenuFilters {
  search: string
  dietary: {
    vegetarian: boolean
    vegan: boolean
    glutenFree: boolean
  }
  availability: {
    available: boolean
    unavailable: boolean
  }
}

interface MenuFilterProps {
  onFilterChange: (filters: MenuFilters) => void
  initialFilters?: Partial<MenuFilters>
}

export function MenuFilter({ onFilterChange, initialFilters }: MenuFilterProps) {
  const [search, setSearch] = useState(initialFilters?.search || "")
  const [dietary, setDietary] = useState({
    vegetarian: initialFilters?.dietary?.vegetarian || false,
    vegan: initialFilters?.dietary?.vegan || false,
    glutenFree: initialFilters?.dietary?.glutenFree || false,
  })
  const [availability, setAvailability] = useState({
    available: initialFilters?.availability?.available ?? true,
    unavailable: initialFilters?.availability?.unavailable ?? true,
  })

  // Wenn sich die initialFilters ändern, aktualisieren wir den State
  useEffect(() => {
    if (initialFilters) {
      if (initialFilters.search !== undefined) setSearch(initialFilters.search)
      if (initialFilters.dietary) setDietary({ ...dietary, ...initialFilters.dietary })
      if (initialFilters.availability) setAvailability({ ...availability, ...initialFilters.availability })
    }
  }, [initialFilters])

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    setSearch(value)
    onFilterChange({
      search: value,
      dietary,
      availability,
    })
  }

  const clearSearch = () => {
    setSearch("")
    onFilterChange({
      search: "",
      dietary,
      availability,
    })
  }

  const toggleDietary = (key: keyof typeof dietary) => {
    const newDietary = { ...dietary, [key]: !dietary[key] }
    setDietary(newDietary)
    onFilterChange({
      search,
      dietary: newDietary,
      availability,
    })
  }

  const toggleAvailability = (key: keyof typeof availability) => {
    const newAvailability = { ...availability, [key]: !availability[key] }
    setAvailability(newAvailability)
    onFilterChange({
      search,
      dietary,
      availability: newAvailability,
    })
  }

  // Zählen der aktiven Filter (ohne Verfügbarkeit, da diese standardmäßig aktiviert sind)
  const activeFilterCount = Object.values(dietary).filter(Boolean).length

  return (
    <div className="flex flex-col sm:flex-row gap-2 mb-4">
      <div className="relative flex-1">
        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
        <Input
          type="search"
          placeholder="Suchen..."
          className="pl-8 pr-8"
          value={search}
          onChange={handleSearchChange}
        />
        {search && (
          <Button
            variant="ghost"
            size="icon"
            className="absolute right-1 top-1 h-7 w-7 rounded-full p-0 opacity-70 hover:opacity-100"
            onClick={clearSearch}
          >
            <X className="h-4 w-4" />
            <span className="sr-only">Suche löschen</span>
          </Button>
        )}
      </div>

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" className="gap-1 whitespace-nowrap">
            <Filter className="h-4 w-4" />
            Filter
            {activeFilterCount > 0 && (
              <span className="ml-1 rounded-full bg-primary w-5 h-5 text-xs flex items-center justify-center text-primary-foreground">
                {activeFilterCount}
              </span>
            )}
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-56">
          <DropdownMenuLabel>Diät-Optionen</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuGroup>
            <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="filter-vegetarian"
                  checked={dietary.vegetarian}
                  onCheckedChange={() => toggleDietary("vegetarian")}
                />
                <label
                  htmlFor="filter-vegetarian"
                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
                >
                  Vegetarisch
                </label>
              </div>
            </DropdownMenuItem>
            <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
              <div className="flex items-center space-x-2">
                <Checkbox id="filter-vegan" checked={dietary.vegan} onCheckedChange={() => toggleDietary("vegan")} />
                <label
                  htmlFor="filter-vegan"
                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
                >
                  Vegan
                </label>
              </div>
            </DropdownMenuItem>
            <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="filter-glutenFree"
                  checked={dietary.glutenFree}
                  onCheckedChange={() => toggleDietary("glutenFree")}
                />
                <label
                  htmlFor="filter-glutenFree"
                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
                >
                  Glutenfrei
                </label>
              </div>
            </DropdownMenuItem>
          </DropdownMenuGroup>

          <DropdownMenuLabel className="mt-2">Verfügbarkeit</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuGroup>
            <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="filter-available"
                  checked={availability.available}
                  onCheckedChange={() => toggleAvailability("available")}
                />
                <label
                  htmlFor="filter-available"
                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
                >
                  Verfügbar
                </label>
              </div>
            </DropdownMenuItem>
            <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="filter-unavailable"
                  checked={availability.unavailable}
                  onCheckedChange={() => toggleAvailability("unavailable")}
                />
                <label
                  htmlFor="filter-unavailable"
                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
                >
                  Nicht verfügbar
                </label>
              </div>
            </DropdownMenuItem>
          </DropdownMenuGroup>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  )
}
