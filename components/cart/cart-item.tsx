"use client"

import { useState } from "react"
import Image from "next/image"
import { Heart, Minus, MoreHorizontal, Plus, Trash2 } from "lucide-react"
import { useCart, type CartItem as CartItemType } from "@/contexts/cart-context"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Textarea } from "@/components/ui/textarea"
import { motion, AnimatePresence } from "framer-motion"
import { Badge } from "@/components/ui/badge"

interface CartItemProps {
  item: CartItemType
  compact?: boolean
  className?: string
  onRemove?: () => void
  onSaveForLater?: () => void
}

export function CartItem({ item, compact = false, className, onRemove, onSaveForLater }: CartItemProps) {
  const { updateQuantity, removeItem, updateItemNotes } = useCart()
  const [showNotes, setShowNotes] = useState(false)
  const [itemNotes, setItemNotes] = useState(item.notes || "")
  const [isUpdatingNotes, setIsUpdatingNotes] = useState(false)
  const [isHovered, setIsHovered] = useState(false)

  const handleIncrement = () => {
    updateQuantity(item.id, item.quantity + 1, item.guestId)
  }

  const handleDecrement = () => {
    if (item.quantity > 1) {
      updateQuantity(item.id, item.quantity - 1, item.guestId)
    } else {
      handleRemove()
    }
  }

  const handleRemove = () => {
    if (onRemove) {
      onRemove()
    } else {
      removeItem(item.id, item.guestId)
    }
  }

  const saveNotes = () => {
    setIsUpdatingNotes(true)
    updateItemNotes(item.id, itemNotes, item.guestId)
    setTimeout(() => {
      setIsUpdatingNotes(false)
      setShowNotes(false)
    }, 500)
  }

  return (
    <motion.div
      className={cn(
        "flex items-start gap-3 p-3 rounded-lg border bg-card transition-all",
        "hover:border-primary/20 hover:bg-card/80",
        className,
      )}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      layout
    >
      {item.imageUrl && !compact && (
        <div className="relative h-16 w-16 flex-shrink-0 overflow-hidden rounded-md">
          <Image
            src={item.imageUrl || "/placeholder.svg"}
            alt={item.name}
            fill
            className="object-cover transition-transform hover:scale-110"
          />
          {item.guestId && (
            <Badge variant="secondary" className="absolute bottom-0 right-0 text-[10px] px-1 py-0 h-4 min-w-0">
              {item.guestName?.split(" ")[0] || item.guestId}
            </Badge>
          )}
        </div>
      )}

      <div className="flex-1 min-w-0">
        <div className="flex justify-between">
          <h4 className="font-medium text-sm">{item.name}</h4>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="h-6 w-6 -mr-1">
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48">
              <DropdownMenuItem onClick={() => setShowNotes(!showNotes)}>
                {showNotes ? "Anmerkungen ausblenden" : "Anmerkungen hinzufügen"}
              </DropdownMenuItem>
              {onSaveForLater && (
                <DropdownMenuItem onClick={onSaveForLater}>
                  <Heart className="h-3.5 w-3.5 mr-1.5" />
                  Für später speichern
                </DropdownMenuItem>
              )}
              <DropdownMenuSeparator />
              <DropdownMenuItem className="text-destructive" onClick={handleRemove}>
                Aus Warenkorb entfernen
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        {item.customizations && <p className="text-xs text-muted-foreground mt-0.5 mb-1.5">{item.customizations}</p>}

        {item.notes && !showNotes && (
          <p className="text-xs text-muted-foreground mt-0.5 mb-1.5 italic">"{item.notes}"</p>
        )}

        <AnimatePresence>
          {showNotes && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="mt-2 mb-3"
            >
              <Textarea
                placeholder="Anmerkungen zum Artikel (z.B. ohne Zwiebeln)"
                className="text-xs min-h-[60px]"
                value={itemNotes}
                onChange={(e) => setItemNotes(e.target.value)}
              />
              <div className="flex justify-end gap-2 mt-2">
                <Button variant="outline" size="sm" className="h-7 text-xs" onClick={() => setShowNotes(false)}>
                  Abbrechen
                </Button>
                <Button size="sm" className="h-7 text-xs" onClick={saveNotes} disabled={isUpdatingNotes}>
                  Speichern
                </Button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="flex items-center justify-between mt-2">
          <div className="flex items-center gap-1">
            <Button
              variant="outline"
              size="icon"
              className={cn("h-7 w-7 rounded-full transition-all", isHovered && "border-primary/30")}
              onClick={handleDecrement}
              aria-label={item.quantity === 1 ? "Entfernen" : "Menge verringern"}
            >
              {item.quantity === 1 ? <Trash2 className="h-3 w-3" /> : <Minus className="h-3 w-3" />}
            </Button>

            <span className="w-8 text-center text-sm font-medium">{item.quantity}</span>

            <Button
              variant="outline"
              size="icon"
              className={cn("h-7 w-7 rounded-full transition-all", isHovered && "border-primary/30")}
              onClick={handleIncrement}
              aria-label="Menge erhöhen"
            >
              <Plus className="h-3 w-3" />
            </Button>
          </div>

          <div className="text-sm font-medium">{(item.price * item.quantity).toFixed(2)} €</div>
        </div>
      </div>
    </motion.div>
  )
}
