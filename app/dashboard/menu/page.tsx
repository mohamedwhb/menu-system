"use client"

import { useState } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { MenuHeader } from "@/components/dashboard/menu/menu-header"
import { MenuFilter } from "@/components/dashboard/menu/menu-filter"
import { MenuItemsGrid } from "@/components/dashboard/menu/menu-items-grid"
import { MenuItemsTable } from "@/components/dashboard/menu/menu-items-table"
import { MenuCategories } from "@/components/dashboard/menu/menu-categories"
import { useMenu } from "@/contexts/menu-context"

export default function MenuPage() {
  const { menuItems } = useMenu()
  const [view, setView] = useState<"grid" | "table">("grid")
  const [filteredItems, setFilteredItems] = useState(menuItems)

  const handleFilterChange = (filters: {
    search: string
    categories: string[]
    dietary: { vegetarian: boolean; vegan: boolean; glutenFree: boolean }
    availability: { available: boolean; unavailable: boolean }
  }) => {
    const filtered = menuItems.filter((item) => {
      // Suche
      if (
        filters.search &&
        !item.name.toLowerCase().includes(filters.search.toLowerCase()) &&
        !item.description?.toLowerCase().includes(filters.search.toLowerCase())
      ) {
        return false
      }

      // Kategorien
      if (filters.categories.length > 0 && !filters.categories.includes(item.category)) {
        return false
      }

      // Diät-Optionen
      if (filters.dietary.vegetarian && !item.vegetarian) {
        return false
      }
      if (filters.dietary.vegan && !item.vegan) {
        return false
      }
      if (filters.dietary.glutenFree && !item.glutenFree) {
        return false
      }

      // Verfügbarkeit
      if (item.available && !filters.availability.available) {
        return false
      }
      if (!item.available && !filters.availability.unavailable) {
        return false
      }

      return true
    })

    setFilteredItems(filtered)
  }

  return (
    <div className="space-y-6">
      <MenuHeader onViewChange={setView} currentView={view} />

      <MenuCategories />

      <MenuFilter onFilterChange={handleFilterChange} />

      <Tabs defaultValue="all" className="space-y-4">
        <TabsList>
          <TabsTrigger value="all">Alle Gerichte</TabsTrigger>
          <TabsTrigger value="featured">Empfohlene Gerichte</TabsTrigger>
        </TabsList>
        <TabsContent value="all" className="space-y-4">
          {view === "grid" ? <MenuItemsGrid items={filteredItems} /> : <MenuItemsTable items={filteredItems} />}
        </TabsContent>
        <TabsContent value="featured" className="space-y-4">
          {view === "grid" ? (
            <MenuItemsGrid items={filteredItems.filter((item) => item.featured)} />
          ) : (
            <MenuItemsTable items={filteredItems.filter((item) => item.featured)} />
          )}
        </TabsContent>
      </Tabs>
    </div>
  )
}
