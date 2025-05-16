"use client"

import { useSearchParams } from "next/navigation"
import { useEffect, useState } from "react"
import { CategoryCard } from "@/components/menu/category-card"
import { MenuItem } from "@/components/menu/menu-item"
import { Badge } from "@/components/ui/badge"
import { useCart } from "@/contexts/cart-context"
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
        <CategoryCard title="Vorspeisen" description="Kleine Gerichte zum Teilen" itemCount={3} featured={true}>
          <MenuItem
            id="bruschetta"
            name="Bruschetta"
            description="Geröstetes Brot mit frischen Tomaten, Basilikum und Knoblauch"
            price={6.5}
            imageUrl="/classic-bruschetta.png"
            tags={["Italienisch", "Vegetarisch"]}
            isVegetarian={true}
          />
          <MenuItem
            id="mozzarella-sticks"
            name="Mozzarella Sticks"
            description="Frittierte Mozzarella-Stäbchen mit Marinara-Sauce"
            price={7.9}
            imageUrl="/mozzarella-sticks.png"
            tags={["Frittiert", "Käse"]}
            isVegetarian={true}
          />
          <MenuItem
            id="garnelen-cocktail"
            name="Garnelen Cocktail"
            description="Frische Garnelen mit hausgemachter Cocktailsauce"
            price={9.9}
            imageUrl="/shrimp-cocktail.png"
            tags={["Meeresfrüchte", "Kalt"]}
            isNew={true}
          />
        </CategoryCard>

        <CategoryCard title="Hauptgerichte" description="Unsere Spezialitäten" itemCount={2}>
          <MenuItem
            id="rinderfilet"
            name="Rinderfilet"
            description="Zartes Rinderfilet mit Kartoffelgratin und saisonalem Gemüse"
            price={24.9}
            imageUrl="/perfectly-seared-beef-tenderloin.png"
            tags={["Fleisch", "Premium"]}
          />
          <MenuItem
            id="gemuese-risotto"
            name="Gemüse-Risotto"
            description="Cremiges Risotto mit saisonalem Gemüse und Parmesan"
            price={16.5}
            imageUrl="/vegetable-risotto.png"
            tags={["Italienisch", "Vegetarisch"]}
            isVegetarian={true}
          />
        </CategoryCard>

        <CategoryCard title="Desserts" description="Süße Versuchungen" itemCount={2}>
          <MenuItem
            id="tiramisu"
            name="Tiramisu"
            description="Klassisches italienisches Dessert mit Mascarpone und Kaffee"
            price={6.9}
            imageUrl="/classic-tiramisu.png"
            tags={["Italienisch", "Kaffee"]}
            isVegetarian={true}
          />
          <MenuItem
            id="creme-brulee"
            name="Crème Brûlée"
            description="Französische Vanillecreme mit karamellisierter Zuckerkruste"
            price={7.5}
            imageUrl="/classic-creme-brulee.png"
            tags={["Französisch", "Gebrannt"]}
            isVegetarian={true}
            isNew={true}
          />
        </CategoryCard>
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
