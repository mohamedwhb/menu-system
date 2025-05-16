"use client"

import { ShoppingBag, ChefHat, CheckIcon as CreditCardCheck } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useCart } from "@/contexts/cart-context"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"
import { motion, AnimatePresence } from "framer-motion"

interface CartButtonProps {
  variant?: "default" | "outline" | "ghost"
  size?: "default" | "sm" | "lg" | "icon"
  className?: string
}

export function CartButton({ variant = "outline", size = "default", className }: CartButtonProps) {
  const { toggleCart, itemCount, kitchenItemCount, paidItemCount, tableId, tableVerified } = useCart()

  const totalCount = itemCount + kitchenItemCount + paidItemCount

  return (
    <Button
      variant={variant}
      size={size}
      onClick={toggleCart}
      className={cn(
        "relative",
        tableId && tableVerified
          ? "bg-green-50 border-green-200 text-green-700 hover:bg-green-100 hover:text-green-800"
          : "",
        tableId && !tableVerified
          ? "bg-amber-50 border-amber-200 text-amber-700 hover:bg-amber-100 hover:text-amber-800"
          : "",
        className,
      )}
      aria-label="Warenkorb öffnen"
    >
      <div className="relative">
        <ShoppingBag className="h-5 w-5" />

        {/* Kitchen indicator */}
        {kitchenItemCount > 0 && (
          <div className="absolute -top-1 -right-3">
            <ChefHat className="h-3 w-3 text-amber-500" />
          </div>
        )}

        {/* Paid indicator */}
        {paidItemCount > 0 && (
          <div className="absolute -bottom-1 -right-3">
            <CreditCardCheck className="h-3 w-3 text-green-500" />
          </div>
        )}
      </div>

      <AnimatePresence>
        {totalCount > 0 && (
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            exit={{ scale: 0 }}
            className="absolute -top-2 -right-2"
          >
            <Badge
              variant="destructive"
              className="h-5 min-w-[1.25rem] flex items-center justify-center rounded-full px-1 text-xs font-semibold"
            >
              {totalCount}
            </Badge>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Add text label for non-icon buttons */}
      {size !== "icon" && (
        <span className="ml-2">
          {tableId ? `Tisch ${tableId}` : "Warenkorb"}
          {totalCount > 0 && size !== "sm" && ` (${totalCount})`}
        </span>
      )}
    </Button>
  )
}
