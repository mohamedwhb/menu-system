"use client"

import React from "react"

import { useState, useMemo, useCallback, useTransition } from "react"
import { PlusCircle, Search, Filter, ArrowUpDown, Grid, List, Download, Upload, Loader2 } from "lucide-react"
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
  DropdownMenuCheckboxItem,
} from "@/components/ui/dropdown-menu"
import { MenuItemsGrid } from "@/components/dashboard/menu/menu-items-grid"
import { MenuItemsTable } from "@/components/dashboard/menu/menu-items-table"
import { MenuCategories } from "@/components/dashboard/menu/menu-categories"
import { AddMenuItemDialog } from "@/components/dashboard/menu/add-menu-item-dialog"
import { useMenu } from "@/contexts/menu-context"
import { useToast } from "@/hooks/use-toast"
import { debounce } from "lodash"

// Typen für bessere TypeScript-Unterstützung
type ViewType = "grid" | "table"
type TabType = "all" | "featured" | "unavailable"
type SortKey = "name" | "price" | "category"
type SortDirection = "asc" | "desc"

interface SortConfig {
  key: SortKey
  direction: SortDirection
}

interface Filters {
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

export default function MenuPage() {
  const { menuItems, categories } = useMenu()
  const { toast } = useToast()

  // State Management
  const [view, setView] = useState<ViewType>("grid")
  const [selectedCategory, setSelectedCategory] = useState("all")
  const [searchQuery, setSearchQuery] = useState("")
  const [showAddDialog, setShowAddDialog] = useState(false)
  const [activeTab, setActiveTab] = useState<TabType>("all")
  const [sortConfig, setSortConfig] = useState<SortConfig | null>(null)
  const [isPending, startTransition] = useTransition()

  const [filters, setFilters] = useState<Filters>({
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

  // Debounced Search für bessere Performance
  const debouncedSearch = useMemo(
    () =>
      debounce((query: string) => {
        startTransition(() => {
          setSearchQuery(query)
        })
      }, 300),
    [],
  )

  // Optimierte Filterlogik mit useMemo
  const filteredItems = useMemo(() => {
    let items = menuItems

    // Kategorie-Filter
    if (selectedCategory !== "all") {
      items = items.filter((item) => item.category === selectedCategory)
    }

    // Suche
    if (searchQuery) {
      const query = searchQuery.toLowerCase()
      items = items.filter(
        (item) => item.name.toLowerCase().includes(query) || item.description?.toLowerCase().includes(query),
      )
    }

    // Diät-Filter
    if (filters.dietary.vegetarian) {
      items = items.filter((item) => item.vegetarian)
    }
    if (filters.dietary.vegan) {
      items = items.filter((item) => item.vegan)
    }
    if (filters.dietary.glutenFree) {
      items = items.filter((item) => item.glutenFree)
    }

    // Verfügbarkeits-Filter
    items = items.filter((item) => {
      if (item.available && !filters.availability.available) return false
      if (!item.available && !filters.availability.unavailable) return false
      return true
    })

    // Tab-Filter
    if (activeTab === "featured") {
      items = items.filter((item) => item.featured)
    } else if (activeTab === "unavailable") {
      items = items.filter((item) => !item.available)
    }

    // Sortierung
    if (sortConfig) {
      items = [...items].sort((a, b) => {
        let aValue: any = a[sortConfig.key]
        let bValue: any = b[sortConfig.key]

        // Spezialfall für Kategorie
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
    }

    return items
  }, [menuItems, selectedCategory, searchQuery, filters, activeTab, sortConfig, categories])

  // Optimierte Handler mit useCallback
  const handleCategorySelect = useCallback((categoryId: string) => {
    startTransition(() => {
      setSelectedCategory(categoryId)
    })
  }, [])

  const handleSort = useCallback((key: SortKey) => {
    startTransition(() => {
      setSortConfig((prevConfig) => {
        if (prevConfig?.key === key) {
          return {
            key,
            direction: prevConfig.direction === "asc" ? "desc" : "asc",
          }
        }
        return { key, direction: "asc" }
      })
    })
  }, [])

  const handleSearchChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const value = e.target.value
      debouncedSearch(value)
    },
    [debouncedSearch],
  )

  const toggleDietaryFilter = useCallback((key: keyof Filters["dietary"]) => {
    startTransition(() => {
      setFilters((prev) => ({
        ...prev,
        dietary: {
          ...prev.dietary,
          [key]: !prev.dietary[key],
        },
      }))
    })
  }, [])

  const toggleAvailabilityFilter = useCallback((key: keyof Filters["availability"]) => {
    startTransition(() => {
      setFilters((prev) => ({
        ...prev,
        availability: {
          ...prev.availability,
          [key]: !prev.availability[key],
        },
      }))
    })
  }, [])

  // Optimierte Export/Import Funktionen
  const handleExport = useCallback(async () => {
    try {
      const dataStr = JSON.stringify({ menuItems, categories }, null, 2)
      const blob = new Blob([dataStr], { type: "application/json" })
      const url = URL.createObjectURL(blob)

      const exportFileDefaultName = `menu-export-${new Date().toISOString().slice(0, 10)}.json`

      const linkElement = document.createElement("a")
      linkElement.href = url
      linkElement.download = exportFileDefaultName
      linkElement.click()

      URL.revokeObjectURL(url)

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

  const handleImport = useCallback(() => {
    const input = document.createElement("input")
    input.type = "file"
    input.accept = ".json"

    input.onchange = async (e) => {
      const file = (e.target as HTMLInputElement).files?.[0]
      if (!file) return

      try {
        const text = await file.text()
        const data = JSON.parse(text)

        if (!data.menuItems || !Array.isArray(data.menuItems)) {
          throw new Error("Ungültiges Datenformat")
        }

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

    input.click()
  }, [toast])

  // Berechnete Werte
  const activeFilterCount = useMemo(() => Object.values(filters.dietary).filter(Boolean).length, [filters.dietary])

  const filteredCount = filteredItems.length
  const totalCount = menuItems.length

  // Keyboard Shortcuts
  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (e.ctrlKey || e.metaKey) {
        switch (e.key) {
          case "n":
            e.preventDefault()
            setShowAddDialog(true)
            break
          case "e":
            e.preventDefault()
            handleExport()
            break
          case "i":
            e.preventDefault()
            handleImport()
            break
        }
      }
    },
    [handleExport, handleImport],
  )

  // Event Listener für Keyboard Shortcuts
  React.useEffect(() => {
    document.addEventListener("keydown", handleKeyDown)
    return () => document.removeEventListener("keydown", handleKeyDown)
  }, [handleKeyDown])

  return (
    <div className="space-y-6">
      {/* Optimierter Header */}
      <div className="flex flex-col sm:flex-row justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Menü-Verwaltung</h1>
          <p className="text-muted-foreground mt-1">
            Verwalten Sie Ihre Menüelemente und Kategorien
            {isPending && <Loader2 className="inline ml-2 h-4 w-4 animate-spin" />}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm">
                <Download className="h-4 w-4 mr-2" />
                Export/Import
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={handleExport}>
                <Download className="h-4 w-4 mr-2" />
                Menü exportieren (Ctrl+E)
              </DropdownMenuItem>
              <DropdownMenuItem onClick={handleImport}>
                <Upload className="h-4 w-4 mr-2" />
                Menü importieren (Ctrl+I)
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
        {/* Kategorien Sidebar */}
        <div className="lg:col-span-1">
          <Card>
            <CardContent className="p-4">
              <MenuCategories selectedCategory={selectedCategory} onCategorySelect={handleCategorySelect} />
            </CardContent>
          </Card>
        </div>

        {/* Hauptbereich */}
        <div className="lg:col-span-3 space-y-4">
          {/* Optimierte Filter-Leiste */}
          <Card>
            <CardContent className="p-4">
              <div className="flex flex-col sm:flex-row gap-3">
                <div className="relative flex-1">
                  <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    type="search"
                    placeholder="Gericht suchen... (Ctrl+K)"
                    className="pl-8"
                    onChange={handleSearchChange}
                  />
                </div>

                <div className="flex gap-2">
                  {/* Verbessertes Filter-Dropdown */}
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
                      <div className="px-2 py-1.5 text-sm font-semibold">Diät-Optionen</div>
                      <DropdownMenuSeparator />
                      <DropdownMenuCheckboxItem
                        checked={filters.dietary.vegetarian}
                        onCheckedChange={() => toggleDietaryFilter("vegetarian")}
                      >
                        Vegetarisch
                      </DropdownMenuCheckboxItem>
                      <DropdownMenuCheckboxItem
                        checked={filters.dietary.vegan}
                        onCheckedChange={() => toggleDietaryFilter("vegan")}
                      >
                        Vegan
                      </DropdownMenuCheckboxItem>
                      <DropdownMenuCheckboxItem
                        checked={filters.dietary.glutenFree}
                        onCheckedChange={() => toggleDietaryFilter("glutenFree")}
                      >
                        Glutenfrei
                      </DropdownMenuCheckboxItem>

                      <DropdownMenuSeparator />
                      <div className="px-2 py-1.5 text-sm font-semibold">Verfügbarkeit</div>
                      <DropdownMenuSeparator />
                      <DropdownMenuCheckboxItem
                        checked={filters.availability.available}
                        onCheckedChange={() => toggleAvailabilityFilter("available")}
                      >
                        Verfügbar
                      </DropdownMenuCheckboxItem>
                      <DropdownMenuCheckboxItem
                        checked={filters.availability.unavailable}
                        onCheckedChange={() => toggleAvailabilityFilter("unavailable")}
                      >
                        Nicht verfügbar
                      </DropdownMenuCheckboxItem>
                    </DropdownMenuContent>
                  </DropdownMenu>

                  {/* Sortier-Dropdown */}
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="outline" size="sm" className="h-10">
                        <ArrowUpDown className="h-4 w-4 mr-2" />
                        Sortieren
                        {sortConfig && (
                          <span className="ml-1 text-xs">{sortConfig.direction === "asc" ? "↑" : "↓"}</span>
                        )}
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

                  {/* View Toggle */}
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

          {/* Menüelemente mit Tabs */}
          <Card>
            <CardContent className="p-4">
              <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as TabType)} className="w-full">
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

      {/* Dialog */}
      <AddMenuItemDialog open={showAddDialog} onOpenChange={setShowAddDialog} />
    </div>
  )
}
