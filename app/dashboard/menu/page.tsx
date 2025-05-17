"use client"

import { useState, useMemo, useCallback } from "react"
import { PlusCircle, Search, Filter, ArrowUpDown, Grid, List, Download, Upload } from "lucide-react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu"
import { MenuItemsGrid } from "@/components/dashboard/menu/menu-items-grid"
import { MenuItemsTable } from "@/components/dashboard/menu/menu-items-table"
import { MenuCategories } from "@/components/dashboard/menu/menu-categories"
import { AddMenuItemDialog } from "@/components/dashboard/menu/add-menu-item-dialog"
import { useMenu } from "@/contexts/menu-context"
import { useToast } from "@/hooks/use-toast"

export default function MenuPage() {
  const { menuItems, categories } = useMenu()
  const { toast } = useToast()
  const [view, setView] = useState<"grid" | "table">("grid")
  const [selectedCategory, setSelectedCategory] = useState("all")
  const [searchQuery, setSearchQuery] = useState("")
  const [showAddDialog, setShowAddDialog] = useState(false)
  const [activeTab, setActiveTab] = useState<"all" | "featured" | "unavailable">("all")
  const [sortConfig, setSortConfig] = useState<{ key: string; direction: "asc" | "desc" } | null>(null)
  const [filters, setFilters] = useState({
    dietary: {
      vegetarian: false,
      vegan: false,
      glutenFree: false,
    },
    availability: {
      available: true,
      unavailable: true,
    },
  })

  // Filtern der Menüelemente basierend auf den aktuellen Filtern und der ausgewählten Kategorie
  const filteredItems = useMemo(() => {
    return menuItems
      .filter((item) => {
        // Kategorie-Filter
        if (selectedCategory !== "all" && item.category !== selectedCategory) {
          return false
        }

        // Suche
        if (
          searchQuery &&
          !item.name.toLowerCase().includes(searchQuery.toLowerCase()) &&
          !item.description?.toLowerCase().includes(searchQuery.toLowerCase())
        ) {
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

        // Tab-Filter
        if (activeTab === "featured" && !item.featured) {
          return false
        }
        if (activeTab === "unavailable" && item.available) {
          return false
        }

        return true
      })
      .sort((a, b) => {
        if (!sortConfig) return 0

        let aValue = a[sortConfig.key as keyof typeof a]
        let bValue = b[sortConfig.key as keyof typeof b]

        // Spezialfall für Kategorie (Name statt ID anzeigen)
        if (sortConfig.key === "category") {
          const categoryA = categories.find((c) => c.id === a.category)
          const categoryB = categories.find((c) => c.id === b.category)
          aValue = categoryA?.name || ""
          bValue = categoryB?.name || ""
        }

        if (typeof aValue === "string" && typeof bValue === "string") {
          return sortConfig.direction === "asc" ? aValue.localeCompare(bValue) : bValue.localeCompare(aValue)
        }

        if (typeof aValue === "number" && typeof bValue === "number") {
          return sortConfig.direction === "asc" ? aValue - bValue : bValue - aValue
        }

        return 0
      })
  }, [menuItems, selectedCategory, searchQuery, filters, activeTab, sortConfig, categories])

  // Handler für die Kategorieauswahl
  const handleCategorySelect = useCallback((categoryId: string) => {
    setSelectedCategory(categoryId)
  }, [])

  // Handler für die Sortierung
  const handleSort = useCallback((key: string) => {
    setSortConfig((prevConfig) => {
      if (prevConfig?.key === key) {
        return {
          key,
          direction: prevConfig.direction === "asc" ? "desc" : "asc",
        }
      }
      return { key, direction: "asc" }
    })
  }, [])

  // Handler für den Filter-Toggle
  const toggleFilter = useCallback((type: "dietary" | "availability", key: string) => {
    setFilters((prev) => ({
      ...prev,
      [type]: {
        ...prev[type],
        [key]: !prev[type][key as keyof (typeof prev)[type]],
      },
    }))
  }, [])

  // Exportieren der Menüdaten
  const handleExport = useCallback(() => {
    try {
      const dataStr = JSON.stringify({ menuItems, categories }, null, 2)
      const dataUri = "data:application/json;charset=utf-8," + encodeURIComponent(dataStr)

      const exportFileDefaultName = `menu-export-${new Date().toISOString().slice(0, 10)}.json`

      const linkElement = document.createElement("a")
      linkElement.setAttribute("href", dataUri)
      linkElement.setAttribute("download", exportFileDefaultName)
      linkElement.click()

      toast({
        title: "Menü exportiert",
        description: "Die Menüdaten wurden erfolgreich exportiert.",
      })
    } catch (error) {
      toast({
        title: "Export fehlgeschlagen",
        description: "Beim Exportieren der Menüdaten ist ein Fehler aufgetreten.",
        variant: "destructive",
      })
    }
  }, [menuItems, categories, toast])

  // Importieren von Menüdaten
  const handleImport = useCallback(() => {
    const input = document.createElement("input")
    input.type = "file"
    input.accept = ".json"

    input.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0]
      if (!file) return

      const reader = new FileReader()
      reader.onload = (event) => {
        try {
          const data = JSON.parse(event.target?.result as string)

          // Hier würde die Logik zum Importieren der Daten in den Kontext kommen
          // Für dieses Beispiel zeigen wir nur eine Toast-Nachricht

          toast({
            title: "Menü importiert",
            description: `${data.menuItems?.length || 0} Menüelemente und ${data.categories?.length || 0} Kategorien wurden importiert.`,
          })
        } catch (error) {
          toast({
            title: "Import fehlgeschlagen",
            description: "Die Datei enthält kein gültiges Menü-Format.",
            variant: "destructive",
          })
        }
      }
      reader.readAsText(file)
    }

    input.click()
  }, [toast])

  // Zählen der aktiven Filter
  const activeFilterCount = Object.values(filters.dietary).filter(Boolean).length

  // Anzahl der gefilterten Elemente
  const filteredCount = filteredItems.length
  const totalCount = menuItems.length

  return (
    <div className="space-y-6">
      {/* Header mit Aktionen */}
      <div className="flex flex-col sm:flex-row justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Menü-Verwaltung</h1>
          <p className="text-muted-foreground mt-1">Verwalten Sie Ihre Menüelemente und Kategorien</p>
        </div>
        <div className="flex items-center gap-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm">
                <Download className="h-4 w-4 mr-2" />
                Exportieren/Importieren
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={handleExport}>
                <Download className="h-4 w-4 mr-2" />
                Menü exportieren
              </DropdownMenuItem>
              <DropdownMenuItem onClick={handleImport}>
                <Upload className="h-4 w-4 mr-2" />
                Menü importieren
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          <Button onClick={() => setShowAddDialog(true)}>
            <PlusCircle className="h-4 w-4 mr-2" />
            Gericht hinzufügen
          </Button>
        </div>
      </div>

      {/* Hauptinhalt */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Linke Spalte - Kategorien */}
        <div className="lg:col-span-1">
          <Card>
            <CardContent className="p-4">
              <MenuCategories selectedCategory={selectedCategory} onCategorySelect={handleCategorySelect} />
            </CardContent>
          </Card>
        </div>

        {/* Rechte Spalte - Menüelemente */}
        <div className="lg:col-span-3 space-y-4">
          {/* Filter und Suche */}
          <Card>
            <CardContent className="p-4">
              <div className="flex flex-col sm:flex-row gap-3">
                <div className="relative flex-1">
                  <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    type="search"
                    placeholder="Gericht suchen..."
                    className="pl-8"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>

                <div className="flex gap-2">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="outline" size="sm" className="h-10">
                        <Filter className="h-4 w-4 mr-2" />
                        Filter
                        {activeFilterCount > 0 && (
                          <Badge variant="secondary" className="ml-2">
                            {activeFilterCount}
                          </Badge>
                        )}
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-56">
                      <DropdownMenuItem className="font-semibold" disabled>
                        Diät-Optionen
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
                        <div className="flex items-center w-full">
                          <input
                            type="checkbox"
                            id="filter-vegetarian"
                            checked={filters.dietary.vegetarian}
                            onChange={() => toggleFilter("dietary", "vegetarian")}
                            className="mr-2"
                          />
                          <label htmlFor="filter-vegetarian" className="flex-1 cursor-pointer">
                            Vegetarisch
                          </label>
                        </div>
                      </DropdownMenuItem>
                      <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
                        <div className="flex items-center w-full">
                          <input
                            type="checkbox"
                            id="filter-vegan"
                            checked={filters.dietary.vegan}
                            onChange={() => toggleFilter("dietary", "vegan")}
                            className="mr-2"
                          />
                          <label htmlFor="filter-vegan" className="flex-1 cursor-pointer">
                            Vegan
                          </label>
                        </div>
                      </DropdownMenuItem>
                      <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
                        <div className="flex items-center w-full">
                          <input
                            type="checkbox"
                            id="filter-glutenFree"
                            checked={filters.dietary.glutenFree}
                            onChange={() => toggleFilter("dietary", "glutenFree")}
                            className="mr-2"
                          />
                          <label htmlFor="filter-glutenFree" className="flex-1 cursor-pointer">
                            Glutenfrei
                          </label>
                        </div>
                      </DropdownMenuItem>

                      <DropdownMenuSeparator />
                      <DropdownMenuItem className="font-semibold" disabled>
                        Verfügbarkeit
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
                        <div className="flex items-center w-full">
                          <input
                            type="checkbox"
                            id="filter-available"
                            checked={filters.availability.available}
                            onChange={() => toggleFilter("availability", "available")}
                            className="mr-2"
                          />
                          <label htmlFor="filter-available" className="flex-1 cursor-pointer">
                            Verfügbar
                          </label>
                        </div>
                      </DropdownMenuItem>
                      <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
                        <div className="flex items-center w-full">
                          <input
                            type="checkbox"
                            id="filter-unavailable"
                            checked={filters.availability.unavailable}
                            onChange={() => toggleFilter("availability", "unavailable")}
                            className="mr-2"
                          />
                          <label htmlFor="filter-unavailable" className="flex-1 cursor-pointer">
                            Nicht verfügbar
                          </label>
                        </div>
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>

                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="outline" size="sm" className="h-10">
                        <ArrowUpDown className="h-4 w-4 mr-2" />
                        Sortieren
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => handleSort("name")}>
                        Name {sortConfig?.key === "name" && (sortConfig.direction === "asc" ? "↑" : "↓")}
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => handleSort("price")}>
                        Preis {sortConfig?.key === "price" && (sortConfig.direction === "asc" ? "↑" : "↓")}
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => handleSort("category")}>
                        Kategorie {sortConfig?.key === "category" && (sortConfig.direction === "asc" ? "↑" : "↓")}
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>

                  <div className="flex border rounded-md overflow-hidden">
                    <Button
                      variant={view === "grid" ? "default" : "ghost"}
                      size="sm"
                      className="h-10 rounded-none px-3"
                      onClick={() => setView("grid")}
                    >
                      <Grid className="h-4 w-4" />
                    </Button>
                    <Separator orientation="vertical" />
                    <Button
                      variant={view === "table" ? "default" : "ghost"}
                      size="sm"
                      className="h-10 rounded-none px-3"
                      onClick={() => setView("table")}
                    >
                      <List className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Tabs und Menüelemente */}
          <Card>
            <CardContent className="p-4">
              <Tabs
                defaultValue="all"
                value={activeTab}
                onValueChange={(value) => setActiveTab(value as "all" | "featured" | "unavailable")}
                className="w-full"
              >
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <h3 className="text-lg font-medium">Menüelemente</h3>
                    <Badge variant="outline" className="ml-2">
                      {filteredCount} von {totalCount}
                    </Badge>
                  </div>
                  <TabsList>
                    <TabsTrigger value="all">Alle</TabsTrigger>
                    <TabsTrigger value="featured">Empfohlen</TabsTrigger>
                    <TabsTrigger value="unavailable">Nicht verfügbar</TabsTrigger>
                  </TabsList>
                </div>

                <TabsContent value="all" className="mt-0">
                  {view === "grid" ? (
                    <MenuItemsGrid items={filteredItems} />
                  ) : (
                    <MenuItemsTable items={filteredItems} onSort={handleSort} sortConfig={sortConfig} />
                  )}
                </TabsContent>

                <TabsContent value="featured" className="mt-0">
                  {view === "grid" ? (
                    <MenuItemsGrid items={filteredItems} />
                  ) : (
                    <MenuItemsTable items={filteredItems} onSort={handleSort} sortConfig={sortConfig} />
                  )}
                </TabsContent>

                <TabsContent value="unavailable" className="mt-0">
                  {view === "grid" ? (
                    <MenuItemsGrid items={filteredItems} />
                  ) : (
                    <MenuItemsTable items={filteredItems} onSort={handleSort} sortConfig={sortConfig} />
                  )}
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Dialog zum Hinzufügen eines Menüelements */}
      <AddMenuItemDialog open={showAddDialog} onOpenChange={setShowAddDialog} />
    </div>
  )
}
