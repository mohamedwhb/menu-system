"use client"

import { ShoppingCart } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useCart } from "@/contexts/cart-context"

// interface CartButtonProps {
//   variant?: "default" | "outline" | "ghost"
//   size?: "default" | "sm" | "lg" | "icon"
//   className?: string
// }

export function CartButton() {
  const { toggleCart, itemCount, kitchenItemCount, paidItemCount, tableId, tableVerified } = useCart()

  const totalCount = itemCount + kitchenItemCount + paidItemCount

  return (
    <Button onClick={toggleCart} variant="outline" size="icon" className="relative" aria-label="Warenkorb öffnen">
      <ShoppingCart className="h-5 w-5" />
      {(itemCount > 0 || kitchenItemCount > 0 || paidItemCount > 0) && (
        <span className="absolute -top-2 -right-2 flex h-5 w-5 items-center justify-center rounded-full bg-primary text-xs text-primary-foreground">
          {itemCount + kitchenItemCount + paidItemCount}
        </span>
      )}
    </Button>
  )
}
