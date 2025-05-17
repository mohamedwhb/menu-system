"use client"

import type React from "react"

import { useSearchParams } from "next/navigation"
import { useEffect, useState, useRef, useMemo } from "react"
import { motion, AnimatePresence } from "framer-motion"
import {
  Search,
  Shield,
  ShieldAlert,
  Filter,
  X,
  Leaf,
  Coffee,
  Pizza,
  IceCream,
  Utensils,
  Info,
  ArrowUpCircle,
} from "lucide-react"
import { CategoryCard } from "@/components/menu/category-card"
import { MenuItem } from "@/components/menu/menu-item"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuCheckboxItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useCart } from "@/contexts/cart-context"
import { useMenu } from "@/contexts/menu-context"
import { toast } from "@/hooks/use-toast"
import { TableVerificationDialog } from "@/components/verification/table-verification-dialog"
import { cn } from "@/lib/utils"
import { CartButton } from "@/components/cart/cart-button"

// Kategorie-Icons-Mapping
const categoryIcons: Record<string, React.ReactNode> = {
  starters: <Utensils className="h-4 w-4" />,
  mains: <Pizza className="h-4 w-4" />,
  desserts: <IceCream className="h-4 w-4" />,
  drinks: <Coffee className="h-4 w-4" />,
}

export default function MenuExample() {
  const searchParams = useSearchParams()
  const [tableId, setTableId] = useState<string | null>(null)
  const { setTableId: setCartTableId, tableVerified, setTableVerified } = useCart()
  const [showVerificationDialog, setShowVerificationDialog] = useState(false)
  const [initialVerificationShown, setInitialVerificationShown] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const [activeCategory, setActiveCategory] = useState<string>("all")
  const [filters, setFilters] = useState({
    vegetarian: false,
    vegan: false,
    glutenFree: false,
  })
  const [showScrollTop, setShowScrollTop] = useState(false)
  const menuRef = useRef<HTMLDivElement>(null)
  const headerRef = useRef<HTMLDivElement>(null)

  // Verwenden Sie den MenuContext, um die Menüdaten zu erhalten
  const { menuItems, categories, allergens, getCategoryById } = useMenu()

  // Scroll-Handler für "Zurück nach oben"-Button
  useEffect(() => {
    const handleScroll = () => {
      if (menuRef.current) {
        setShowScrollTop(menuRef.current.scrollTop > 300)
      }
    }

    const menuElement = menuRef.current
    if (menuElement) {
      menuElement.addEventListener("scroll", handleScroll)
      return () => menuElement.removeEventListener("scroll", handleScroll)
    }
  }, [])

  // Scroll zu Kategorie
  const scrollToCategory = (categoryId: string) => {
    const element = document.getElementById(`category-${categoryId}`)
    if (element) {
      element.scrollIntoView({ behavior: "smooth", block: "start" })
    }
  }

  // Scroll nach oben
  const scrollToTop = () => {
    if (menuRef.current) {
      menuRef.current.scrollTo({ top: 0, behavior: "smooth" })
    }
  }

  useEffect(() => {
    // Read the URL parameter "tisch"
    const tischParam = searchParams.get("tisch")

    // Only process if there's a table ID and we haven't shown initial verification
    if (tischParam && !initialVerificationShown) {
      // Store in state for rendering
      setTableId(tischParam)

      // Store the value in localStorage with key "tischID"
      localStorage.setItem("tischID", tischParam)

      // Set the table ID in the cart context
      setCartTableId(tischParam)

      // Show a toast notification
      toast({
        title: `Tisch ${tischParam} ausgewählt`,
        description: "Bitte verifizieren Sie, dass Sie an diesem Tisch sitzen.",
        duration: 5000,
      })

      // Show verification dialog after a short delay
      setTimeout(() => {
        setShowVerificationDialog(true)
        setInitialVerificationShown(true)
      }, 1000)
    }
  }, [searchParams, setCartTableId, setTableVerified, initialVerificationShown])

  // Handle successful verification
  const handleVerificationSuccess = (verified: boolean) => {
    setTableVerified(verified)
    setShowVerificationDialog(false)

    if (verified) {
      toast({
        title: "Tisch erfolgreich verifiziert",
        description: `Sie können jetzt an Tisch ${tableId} bestellen.`,
        duration: 3000,
      })
    }
  }

  // Filtere verfügbare Menüelemente
  const filteredItems = useMemo(() => {
    return menuItems.filter((item) => {
      // Grundfilter: Nur verfügbare Elemente
      if (item.available === false) return false

      // Kategoriefilter
      if (activeCategory !== "all" && item.category !== activeCategory) return false

      // Suchfilter
      if (searchQuery) {
        const query = searchQuery.toLowerCase()
        const nameMatch = item.name.toLowerCase().includes(query)
        const descMatch = item.description.toLowerCase().includes(query)
        if (!nameMatch && !descMatch) return false
      }

      // Diätfilter
      if (filters.vegetarian && !item.vegetarian) return false
      if (filters.vegan && !item.vegan) return false
      if (filters.glutenFree && !item.glutenFree) return false

      return true
    })
  }, [menuItems, activeCategory, searchQuery, filters])

  // Hole die empfohlenen Elemente
  const featuredItems = useMemo(() => {
    return filteredItems.filter((item) => item.featured)
  }, [filteredItems])

  // Gruppiere Elemente nach Kategorie
  const itemsByCategory = useMemo(() => {
    const grouped: Record<string, typeof menuItems> = {}

    // Wenn eine aktive Kategorie ausgewählt ist, zeige nur diese
    if (activeCategory !== "all") {
      grouped[activeCategory] = filteredItems.filter((item) => item.category === activeCategory)
      return grouped
    }

    // Sonst gruppiere nach allen Kategorien
    filteredItems.forEach((item) => {
      if (!grouped[item.category]) {
        grouped[item.category] = []
      }
      grouped[item.category].push(item)
    })

    return grouped
  }, [filteredItems, activeCategory])

  // Hole die aktiven Kategorien
  const activeCategories = useMemo(() => {
    return categories
      .filter((cat) => cat.active && Object.keys(itemsByCategory).includes(cat.id))
      .sort((a, b) => a.order - b.order)
  }, [categories, itemsByCategory])

  // Prüfe, ob Ergebnisse vorhanden sind
  const hasResults = Object.values(itemsByCategory).some((items) => items.length > 0) || featuredItems.length > 0

  return (
    <div className="flex flex-col h-screen">
      {/* Header - Sticky */}
      <div ref={headerRef} className="sticky top-0 z-10 bg-background border-b shadow-sm">
        <div className="container max-w-3xl mx-auto py-3 px-4">
          <div className="flex flex-col gap-3">
            {/* Obere Zeile: Titel und Tisch-Info */}
            <div className="flex items-center justify-between">
              <h1 className="text-xl font-bold">Speisekarte</h1>

              {tableId && (
                <div className="flex items-center">
                  <Badge
                    variant="outline"
                    className={cn(
                      "flex items-center gap-1 px-3 py-1",
                      tableVerified
                        ? "bg-green-50 text-green-700 border-green-200"
                        : "bg-amber-50 text-amber-700 border-amber-200",
                    )}
                  >
                    {tableVerified ? (
                      <Shield className="h-3.5 w-3.5 mr-1" />
                    ) : (
                      <ShieldAlert className="h-3.5 w-3.5 mr-1" />
                    )}
                    Tisch {tableId}
                    {!tableVerified && (
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-5 text-[10px] ml-1 px-1 hover:bg-amber-100"
                        onClick={() => setShowVerificationDialog(true)}
                      >
                        Verifizieren
                      </Button>
                    )}
                  </Badge>
                </div>
              )}
            </div>

            {/* Suchleiste und Filter */}
            <div className="flex gap-2">
              <div className="relative flex-1">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  type="search"
                  placeholder="Gerichte suchen..."
                  className="pl-9 h-10"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
                {searchQuery && (
                  <Button
                    variant="ghost"
                    size="icon"
                    className="absolute right-0 top-0 h-10 w-10"
                    onClick={() => setSearchQuery("")}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                )}
              </div>

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="icon" className="h-10 w-10">
                    <Filter className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <DropdownMenuCheckboxItem
                    checked={filters.vegetarian}
                    onCheckedChange={(checked) => setFilters((prev) => ({ ...prev, vegetarian: checked }))}
                  >
                    <Leaf className="mr-2 h-4 w-4 text-green-600" />
                    Vegetarisch
                  </DropdownMenuCheckboxItem>
                  <DropdownMenuCheckboxItem
                    checked={filters.vegan}
                    onCheckedChange={(checked) => setFilters((prev) => ({ ...prev, vegan: checked }))}
                  >
                    <Leaf className="mr-2 h-4 w-4 text-green-700" />
                    Vegan
                  </DropdownMenuCheckboxItem>
                  <DropdownMenuCheckboxItem
                    checked={filters.glutenFree}
                    onCheckedChange={(checked) => setFilters((prev) => ({ ...prev, glutenFree: checked }))}
                  >
                    <Info className="mr-2 h-4 w-4 text-blue-600" />
                    Glutenfrei
                  </DropdownMenuCheckboxItem>
                </DropdownMenuContent>
              </DropdownMenu>

              <CartButton />
            </div>

            {/* Kategorie-Tabs */}
            <Tabs value={activeCategory} onValueChange={setActiveCategory} className="w-full">
              <TabsList className="w-full overflow-x-auto flex-nowrap justify-start h-10 px-1 py-1">
                <TabsTrigger value="all" className="flex-shrink-0 px-3" onClick={() => scrollToTop()}>
                  Alle
                </TabsTrigger>
                {categories
                  .filter((cat) => cat.active)
                  .sort((a, b) => a.order - b.order)
                  .map((category) => (
                    <TabsTrigger
                      key={category.id}
                      value={category.id}
                      className="flex-shrink-0 px-3"
                      onClick={() => scrollToCategory(category.id)}
                    >
                      <span className="flex items-center gap-1.5">
                        {categoryIcons[category.id] || <Utensils className="h-4 w-4" />}
                        {category.name}
                      </span>
                    </TabsTrigger>
                  ))}
              </TabsList>
            </Tabs>
          </div>
        </div>
      </div>

      {/* Hauptinhalt - Scrollbar */}
      <div ref={menuRef} className="flex-1 overflow-y-auto pb-20">
        <div className="container max-w-3xl mx-auto py-6 px-4 space-y-6">
          {/* Keine Ergebnisse */}
          {!hasResults && (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mb-4">
                <Search className="h-8 w-8 text-muted-foreground" />
              </div>
              <h3 className="text-lg font-medium mb-1">Keine Ergebnisse gefunden</h3>
              <p className="text-muted-foreground mb-4 max-w-md">
                Wir konnten keine Gerichte finden, die Ihren Filterkriterien entsprechen. Bitte versuchen Sie es mit
                anderen Suchbegriffen oder Filtern.
              </p>
              <Button
                onClick={() => {
                  setSearchQuery("")
                  setFilters({ vegetarian: false, vegan: false, glutenFree: false })
                  setActiveCategory("all")
                }}
              >
                Filter zurücksetzen
              </Button>
            </div>
          )}

          {/* Empfohlene Gerichte anzeigen, wenn vorhanden */}
          {featuredItems.length > 0 && (
            <CategoryCard
              title="Empfehlungen"
              description="Unsere besonderen Empfehlungen für Sie"
              itemCount={featuredItems.length}
              featured={true}
            >
              <div className="grid gap-3">
                {featuredItems.map((item) => {
                  // Hole die Kategorie für dieses Menüelement
                  const category = getCategoryById(item.category)

                  return (
                    <MenuItem
                      key={item.id}
                      id={item.id}
                      name={item.name}
                      description={item.description}
                      price={item.price}
                      imageUrl={item.image}
                      tags={category ? [category.name] : []}
                      isVegetarian={item.vegetarian}
                      isNew={false}
                      allergens={item.allergens}
                      ingredients={item.ingredients}
                    />
                  )
                })}
              </div>
            </CategoryCard>
          )}

          {/* Kategorien anzeigen */}
          {activeCategories.map((category) => {
            // Filtere Menüelemente nach Kategorie
            const categoryItems = itemsByCategory[category.id] || []

            if (categoryItems.length === 0) return null

            return (
              <div key={category.id} id={`category-${category.id}`} className="scroll-mt-[180px]">
                <CategoryCard
                  title={category.name}
                  description={category.description || ""}
                  itemCount={categoryItems.length}
                >
                  <div className="grid gap-3">
                    {categoryItems.map((item) => (
                      <MenuItem
                        key={item.id}
                        id={item.id}
                        name={item.name}
                        description={item.description}
                        price={item.price}
                        imageUrl={item.image}
                        tags={[]}
                        isVegetarian={item.vegetarian}
                        isNew={false}
                        allergens={item.allergens}
                        ingredients={item.ingredients}
                      />
                    ))}
                  </div>
                </CategoryCard>
              </div>
            )
          })}
        </div>
      </div>

      {/* Zurück nach oben Button */}
      <AnimatePresence>
        {showScrollTop && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            transition={{ duration: 0.2 }}
            className="fixed bottom-6 right-6 z-20"
          >
            <Button size="icon" className="h-12 w-12 rounded-full shadow-lg" onClick={scrollToTop}>
              <ArrowUpCircle className="h-6 w-6" />
            </Button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Verification Dialog */}
      <TableVerificationDialog
        tableId={tableId}
        isOpen={showVerificationDialog}
        onClose={() => setShowVerificationDialog(false)}
        onVerify={handleVerificationSuccess}
      />
    </div>
  )
}
