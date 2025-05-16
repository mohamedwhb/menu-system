"use client"

import { useState } from "react"
import Image from "next/image"
import { ShoppingCart } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { useCart } from "@/contexts/cart-context"
import { toast } from "@/hooks/use-toast"
import { cn } from "@/lib/utils"
import { TableVerificationDialog } from "@/components/verification/table-verification-dialog"

interface MenuItemProps {
  id: string
  name: string
  description: string
  price: number
  imageUrl?: string
  tags?: string[]
  isVegetarian?: boolean
  isNew?: boolean
}

export function MenuItem({ id, name, description, price, imageUrl, tags, isVegetarian, isNew }: MenuItemProps) {
  const { addItem, tableId, tableVerified, setTableVerified } = useCart()
  const [showVerificationDialog, setShowVerificationDialog] = useState(false)

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
          <div>
            <h3 className="font-medium">{name}</h3>
            <p className="text-sm text-muted-foreground line-clamp-2 mt-1">{description}</p>
          </div>
          <div className="font-medium">{price.toFixed(2)} €</div>
        </div>

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
    </div>
  )
}
