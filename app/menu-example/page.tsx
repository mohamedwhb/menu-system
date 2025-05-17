"use client"

import { useSearchParams } from "next/navigation"
import { useEffect, useState } from "react"
import { CategoryCard } from "@/components/menu/category-card"
import { MenuItem } from "@/components/menu/menu-item"
import { Badge } from "@/components/ui/badge"
import { useCart } from "@/contexts/cart-context"
import { useMenu } from "@/contexts/menu-context"
import { toast } from "@/hooks/use-toast"
import { TableVerificationDialog } from "@/components/verification/table-verification-dialog"
import { Button } from "@/components/ui/button"
import { Shield, ShieldAlert } from "lucide-react"
import { cn } from "@/lib/utils"

export default function MenuExample() {
  const searchParams = useSearchParams()
  const [tableId, setTableId] = useState<string | null>(null)
  const { setTableId: setCartTableId, tableVerified, setTableVerified } = useCart()
  const [showVerificationDialog, setShowVerificationDialog] = useState(false)
  const [initialVerificationShown, setInitialVerificationShown] = useState(false)

  // Verwenden Sie den MenuContext, um die Menüdaten zu erhalten
  const { menuItems, categories, getCategoryById } = useMenu()

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
  const availableItems = menuItems.filter((item) => item.available !== false)

  // Hole die empfohlenen Elemente
  const featuredItems = availableItems.filter((item) => item.featured)

  // Hole die aktiven Kategorien
  const activeCategories = categories.filter((cat) => cat.active && cat.id !== "all").sort((a, b) => a.order - b.order)

  return (
    <div className="container max-w-3xl mx-auto py-8 px-4">
      <div className="flex flex-col sm:flex-row items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Unser Menü</h1>

        {tableId && (
          <div className="flex items-center mt-2 sm:mt-0">
            <Badge
              variant="outline"
              className={cn(
                "flex items-center gap-1 px-3 py-1",
                tableVerified
                  ? "bg-green-50 text-green-700 border-green-200"
                  : "bg-amber-50 text-amber-700 border-amber-200",
              )}
            >
              {tableVerified ? <Shield className="h-3.5 w-3.5 mr-1" /> : <ShieldAlert className="h-3.5 w-3.5 mr-1" />}
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

      <div className="space-y-4">
        {/* Empfohlene Gerichte anzeigen, wenn vorhanden */}
        {featuredItems.length > 0 && (
          <CategoryCard
            title="Empfehlungen"
            description="Unsere besonderen Empfehlungen für Sie"
            itemCount={featuredItems.length}
            featured={true}
          >
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
          </CategoryCard>
        )}

        {/* Kategorien anzeigen */}
        {activeCategories.map((category) => {
          // Filtere Menüelemente nach Kategorie
          const categoryItems = availableItems.filter((item) => item.category === category.id)

          if (categoryItems.length === 0) return null

          return (
            <CategoryCard
              key={category.id}
              title={category.name}
              description={category.description || ""}
              itemCount={categoryItems.length}
            >
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
            </CategoryCard>
          )
        })}
      </div>

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
