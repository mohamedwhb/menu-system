"use client"

import type React from "react"

import { useState } from "react"
import { Search, Filter } from "lucide-react"
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
import { useMenu } from "@/contexts/menu-context"

interface MenuFilterProps {
  onFilterChange: (filters: {
    search: string
    categories: string[]
    dietary: { vegetarian: boolean; vegan: boolean; glutenFree: boolean }
    availability: { available: boolean; unavailable: boolean }
  }) => void
}

export function MenuFilter({ onFilterChange }: MenuFilterProps) {
  const { categories } = useMenu()
  const [search, setSearch] = useState("")
  const [selectedCategories, setSelectedCategories] = useState<string[]>([])
  const [dietary, setDietary] = useState({
    vegetarian: false,
    vegan: false,
    glutenFree: false,
  })
  const [availability, setAvailability] = useState({
    available: true,
    unavailable: true,
  })

  // Aktive Kategorien filtern und sortieren
  const activeCategories = categories.filter((cat) => cat.active).sort((a, b) => a.order - b.order)

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    setSearch(value)
    onFilterChange({
      search: value,
      categories: selectedCategories,
      dietary,
      availability,
    })
  }

  const toggleCategory = (categoryId: string) => {
    const newSelectedCategories = selectedCategories.includes(categoryId)
      ? selectedCategories.filter((id) => id !== categoryId)
      : [...selectedCategories, categoryId]

    setSelectedCategories(newSelectedCategories)
    onFilterChange({
      search,
      categories: newSelectedCategories,
      dietary,
      availability,
    })
  }

  const toggleDietary = (key: keyof typeof dietary) => {
    const newDietary = { ...dietary, [key]: !dietary[key] }
    setDietary(newDietary)
    onFilterChange({
      search,
      categories: selectedCategories,
      dietary: newDietary,
      availability,
    })
  }

  const toggleAvailability = (key: keyof typeof availability) => {
    const newAvailability = { ...availability, [key]: !availability[key] }
    setAvailability(newAvailability)
    onFilterChange({
      search,
      categories: selectedCategories,
      dietary,
      availability: newAvailability,
    })
  }

  return (
    <div className="flex flex-col sm:flex-row gap-2 mb-4">
      <div className="relative flex-1">
        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
        <Input type="search" placeholder="Suchen..." className="pl-8" value={search} onChange={handleSearchChange} />
      </div>

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" className="gap-1">
            <Filter className="h-4 w-4" />
            Filter
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-56">
          <DropdownMenuLabel>Kategorien</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuGroup className="max-h-[200px] overflow-y-auto">
            {activeCategories.map((category) => (
              <DropdownMenuItem key={category.id} onSelect={(e) => e.preventDefault()}>
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id={`category-${category.id}`}
                    checked={selectedCategories.includes(category.id)}
                    onCheckedChange={() => toggleCategory(category.id)}
                  />
                  <label
                    htmlFor={`category-${category.id}`}
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
                  >
                    {category.name}
                  </label>
                </div>
              </DropdownMenuItem>
            ))}
          </DropdownMenuGroup>

          <DropdownMenuLabel className="mt-2">Diät-Optionen</DropdownMenuLabel>
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
