"use client"

import { useState } from "react"
import Image from "next/image"
import { ShoppingCart, Info } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { useCart } from "@/contexts/cart-context"
import { useMenu } from "@/contexts/menu-context"
import { toast } from "@/hooks/use-toast"
import { cn } from "@/lib/utils"
import { TableVerificationDialog } from "@/components/verification/table-verification-dialog"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"

interface MenuItemProps {
  id: string
  name: string
  description: string
  price: number
  imageUrl?: string
  tags?: string[]
  isVegetarian?: boolean
  isNew?: boolean
  allergens?: string[]
  ingredients?: string[]
}

export function MenuItem({
  id,
  name,
  description,
  price,
  imageUrl,
  tags,
  isVegetarian,
  isNew,
  allergens,
  ingredients,
}: MenuItemProps) {
  const { addItem, tableId, tableVerified, setTableVerified } = useCart()
  const { allergens: allAllergens } = useMenu()
  const [showVerificationDialog, setShowVerificationDialog] = useState(false)
  const [showDetailsDialog, setShowDetailsDialog] = useState(false)

  const handleAddToCart = () => {
    // If table is selected but not verified, show verification dialog
    if (tableId && !tableVerified) {
      setShowVerificationDialog(true)
      return
    }

    addItem({
      id,
      name,
      price,
      imageUrl,
    })

    toast({
      title: `${name} hinzugefügt`,
      description: tableId
        ? `Artikel wurde zum Tisch ${tableId} hinzugefügt`
        : "Artikel wurde zum Warenkorb hinzugefügt",
      duration: 3000,
    })
  }

  // Filtere die Allergene für dieses Menüelement
  const itemAllergens =
    allergens && allergens.length > 0 ? allAllergens.filter((allergen) => allergens.includes(allergen.id)) : []

  return (
    <div className="flex flex-col sm:flex-row gap-4 p-4 border rounded-lg hover:shadow-sm transition-shadow">
      {/* Image */}
      {imageUrl && (
        <div className="sm:w-24 sm:h-24 h-32 relative rounded-md overflow-hidden flex-shrink-0">
          <Image
            src={imageUrl || "/placeholder.svg"}
            alt={name}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, 96px"
          />
        </div>
      )}

      {/* Content */}
      <div className="flex-1 flex flex-col">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-2">
            <h3 className="font-medium">{name}</h3>
            {itemAllergens.length > 0 && (
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-6 w-6 rounded-full p-0 hover:bg-muted"
                      onClick={() => setShowDetailsDialog(true)}
                    >
                      <Info className="h-4 w-4" />
                      <span className="sr-only">Allergen-Informationen</span>
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Enthält Allergene</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            )}
          </div>
          <div className="font-medium">{price.toFixed(2)} €</div>
        </div>
        <p className="text-sm text-muted-foreground line-clamp-2 mt-1">{description}</p>

        {/* Tags */}
        {(tags?.length || isVegetarian || isNew) && (
          <div className="flex flex-wrap gap-1 mt-2">
            {isVegetarian && (
              <Badge variant="outline" className="text-green-700 bg-green-50 border-green-200">
                Vegetarisch
              </Badge>
            )}
            {isNew && (
              <Badge variant="outline" className="text-blue-700 bg-blue-50 border-blue-200">
                Neu
              </Badge>
            )}
            {tags?.map((tag) => (
              <Badge key={tag} variant="secondary" className="bg-muted">
                {tag}
              </Badge>
            ))}
          </div>
        )}

        {/* Add to cart button */}
        <div className="mt-auto pt-3 flex justify-end">
          <Button
            onClick={handleAddToCart}
            size="sm"
            className={cn(
              tableId && tableVerified && "bg-green-600 hover:bg-green-700",
              tableId && !tableVerified && "bg-amber-600 hover:bg-amber-700",
            )}
          >
            <ShoppingCart className="h-4 w-4 mr-2" />
            {tableId ? (tableVerified ? `Zu Tisch ${tableId} hinzufügen` : "Tisch verifizieren") : "Zum Warenkorb"}
          </Button>
        </div>
      </div>

      {/* Verification Dialog */}
      <TableVerificationDialog
        tableId={tableId}
        isOpen={showVerificationDialog}
        onClose={() => setShowVerificationDialog(false)}
        onVerify={(verified) => {
          setTableVerified(verified)
          if (verified) {
            toast({
              title: "Tisch erfolgreich verifiziert",
              description: `Sie können jetzt an Tisch ${tableId} bestellen.`,
              duration: 3000,
            })
            // Add the item to cart after successful verification
            addItem({
              id,
              name,
              price,
              imageUrl,
            })
            toast({
              title: `${name} hinzugefügt`,
              description: `Artikel wurde zum Tisch ${tableId} hinzugefügt`,
              duration: 3000,
            })
          }
        }}
      />

      {/* Details Dialog */}
      <Dialog open={showDetailsDialog} onOpenChange={setShowDetailsDialog}>
        <DialogContent className="sm:max-w-[500px] bg-white">
          <DialogHeader>
            <DialogTitle>{name}</DialogTitle>
            <DialogDescription>{description}</DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            {/* Allergene */}
            {itemAllergens.length > 0 && (
              <div>
                <h4 className="font-medium mb-2">Allergene</h4>
                <div className="flex flex-wrap gap-2">
                  {itemAllergens.map((allergen) => (
                    <Badge
                      key={allergen.id}
                      variant="outline"
                      className={cn(
                        "border",
                        allergen.severity === "high" && "bg-red-50 text-red-700 border-red-200",
                        allergen.severity === "medium" && "bg-amber-50 text-amber-700 border-amber-200",
                        allergen.severity === "low" && "bg-blue-50 text-blue-700 border-blue-200",
                      )}
                    >
                      {allergen.name}
                    </Badge>
                  ))}
                </div>
              </div>
            )}

            {/* Inhaltsstoffe */}
            {ingredients && ingredients.length > 0 && (
              <div>
                <h4 className="font-medium mb-2">Inhaltsstoffe</h4>
                <div className="flex flex-wrap gap-2">
                  {ingredients.map((ingredient) => (
                    <Badge key={ingredient} variant="secondary">
                      {ingredient}
                    </Badge>
                  ))}
                </div>
              </div>
            )}

            {/* Diät-Informationen */}
            <div>
              <h4 className="font-medium mb-2">Diät-Informationen</h4>
              <div className="space-y-1">
                <p className="text-sm">
                  Vegetarisch: <span className="font-medium">{isVegetarian ? "Ja" : "Nein"}</span>
                </p>
                <p className="text-sm">
                  Vegan: <span className="font-medium">{isVegetarian ? "Ja" : "Nein"}</span>
                </p>
                <p className="text-sm">
                  Glutenfrei: <span className="font-medium">{isVegetarian ? "Ja" : "Nein"}</span>
                </p>
              </div>
            </div>
          </div>

          <div className="flex justify-end">
            <Button onClick={() => setShowDetailsDialog(false)}>Schließen</Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
