"use client"

import { useState } from "react"
import { CheckCircle, Clock, Users } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Checkbox } from "@/components/ui/checkbox"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"
import { format } from "date-fns"
import { de } from "date-fns/locale"

interface OtherOrder {
  id: string
  guestLabel: string
  items: Array<{
    id: string
    name: string
    quantity: number
    price: number
    imageUrl?: string
  }>
  total: number
  timestamp: number
  sessionId: string
}

export type CartItem = {
  id: string
  name: string
  price: number
  quantity: number
  imageUrl?: string
  guestId?: string
  guestName?: string
  selected?: boolean
  status?: string
  timestamp?: number
}

interface OtherOrdersDialogProps {
  isOpen: boolean
  onClose: () => void
  tableId: string | null
  onTakeOverOrders: (items: CartItem[]) => void
}

// Mock data für andere Bestellungen am gleichen Tisch
const getMockOtherOrders = (tableId: string | null): OtherOrder[] => {
  if (!tableId) return []

  return [
    {
      id: "order-1",
      guestLabel: "Gast A",
      items: [
        {
          id: "pizza-margherita",
          name: "Pizza Margherita",
          quantity: 1,
          price: 12.9,
          imageUrl: "/pizza-margherita.png",
        },
        {
          id: "cola",
          name: "Cola",
          quantity: 1,
          price: 2.5,
          imageUrl: "/placeholder.svg?height=100&width=100&query=cola",
        },
      ],
      total: 15.4,
      timestamp: Date.now() - 1200000,
      sessionId: "session-abc123",
    },
    {
      id: "order-2",
      guestLabel: "Gast B",
      items: [
        {
          id: "pasta-carbonara",
          name: "Pasta Carbonara",
          quantity: 1,
          price: 14.5,
          imageUrl: "/pasta-carbonara.png",
        },
        {
          id: "wine-red",
          name: "Rotwein",
          quantity: 1,
          price: 6.8,
          imageUrl: "/placeholder.svg?height=100&width=100&query=red-wine",
        },
      ],
      total: 21.3,
      timestamp: Date.now() - 900000,
      sessionId: "session-def456",
    },
    {
      id: "order-3",
      guestLabel: "Gast C",
      items: [
        {
          id: "caesar-salad",
          name: "Caesar Salad",
          quantity: 2,
          price: 8.9,
          imageUrl: "/caesar-salad.png",
        },
        {
          id: "water",
          name: "Mineralwasser",
          quantity: 2,
          price: 2.2,
          imageUrl: "/placeholder.svg?height=100&width=100&query=mineral-water",
        },
      ],
      total: 22.2,
      timestamp: Date.now() - 600000,
      sessionId: "session-ghi789",
    },
  ]
}

export function OtherOrdersDialog({ isOpen, onClose, tableId, onTakeOverOrders }: OtherOrdersDialogProps) {
  const [selectedOrders, setSelectedOrders] = useState<string[]>([])
  const otherOrders = getMockOtherOrders(tableId)

  const handleOrderToggle = (orderId: string) => {
    setSelectedOrders((prev) => (prev.includes(orderId) ? prev.filter((id) => id !== orderId) : [...prev, orderId]))
  }

  const handleSelectAll = () => {
    if (selectedOrders.length === otherOrders.length) {
      setSelectedOrders([])
    } else {
      setSelectedOrders(otherOrders.map((order) => order.id))
    }
  }

  const handleTakeOver = () => {
    if (selectedOrders.length > 0) {
      // Convert selected orders to CartItems
      const selectedOrdersData = otherOrders.filter((order) => selectedOrders.includes(order.id))
      const cartItems: CartItem[] = []

      selectedOrdersData.forEach((order) => {
        order.items.forEach((item) => {
          cartItems.push({
            id: `${item.id}-${order.sessionId}`, // Make unique by adding session ID
            name: item.name,
            price: item.price,
            quantity: item.quantity,
            imageUrl: item.imageUrl,
            guestId: order.sessionId,
            guestName: order.guestLabel,
            selected: true,
            status: "kitchen",
            timestamp: order.timestamp,
          })
        })
      })

      onTakeOverOrders(cartItems)
      setSelectedOrders([])
      onClose()
    }
  }

  const selectedTotal = otherOrders
    .filter((order) => selectedOrders.includes(order.id))
    .reduce((sum, order) => sum + order.total, 0)

  const formatTimestamp = (timestamp: number) => {
    return format(new Date(timestamp), "HH:mm", { locale: de })
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md max-h-[80vh] overflow-hidden flex flex-col">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Users className="h-5 w-5" />
            Andere Bestellungen
          </DialogTitle>
          <DialogDescription>Offene Bestellungen von anderen Gästen an Tisch {tableId}</DialogDescription>
        </DialogHeader>

        <div className="flex-1 overflow-y-auto space-y-4">
          {otherOrders.length === 0 ? (
            <div className="text-center py-8">
              <div className="w-16 h-16 rounded-full bg-muted/20 flex items-center justify-center mx-auto mb-4">
                <Users className="h-8 w-8 text-muted-foreground" />
              </div>
              <p className="text-muted-foreground">Keine anderen offenen Bestellungen an diesem Tisch</p>
            </div>
          ) : (
            <>
              {/* Select All Toggle */}
              <div className="flex items-center justify-between p-3 bg-muted/20 rounded-lg">
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="select-all-orders"
                    checked={selectedOrders.length === otherOrders.length}
                    onCheckedChange={handleSelectAll}
                  />
                  <label htmlFor="select-all-orders" className="text-sm font-medium cursor-pointer">
                    Alle auswählen
                  </label>
                </div>
                <Badge variant="outline">
                  {otherOrders.length} Bestellung{otherOrders.length !== 1 ? "en" : ""}
                </Badge>
              </div>

              {/* Order Cards */}
              <div className="space-y-3">
                {otherOrders.map((order) => {
                  const isSelected = selectedOrders.includes(order.id)

                  return (
                    <div
                      key={order.id}
                      className={cn(
                        "border rounded-lg p-3 transition-all cursor-pointer",
                        isSelected ? "border-primary/30 bg-primary/5" : "border-border hover:border-primary/20",
                      )}
                      onClick={() => handleOrderToggle(order.id)}
                    >
                      <div className="flex items-start gap-3">
                        <Checkbox
                          checked={isSelected}
                          onCheckedChange={() => handleOrderToggle(order.id)}
                          className="mt-1"
                        />

                        <div className="flex-1 min-w-0">
                          {/* Guest Header */}
                          <div className="flex items-center justify-between mb-2">
                            <div className="flex items-center gap-2">
                              <Badge variant="secondary" className="text-xs">
                                {order.guestLabel}
                              </Badge>
                              <span className="text-xs text-muted-foreground flex items-center gap-1">
                                <Clock className="h-3 w-3" />
                                {formatTimestamp(order.timestamp)}
                              </span>
                            </div>
                            <div className="font-medium text-sm">{order.total.toFixed(2)} €</div>
                          </div>

                          {/* Items List */}
                          <div className="space-y-1">
                            {order.items.map((item, index) => (
                              <div key={item.id} className="text-xs text-muted-foreground">
                                {item.quantity}× {item.name}
                                {index < order.items.length - 1 && ", "}
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>

              {/* Selected Summary */}
              {selectedOrders.length > 0 && (
                <div className="bg-primary/5 border border-primary/20 rounded-lg p-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium">
                      {selectedOrders.length} Bestellung{selectedOrders.length !== 1 ? "en" : ""} ausgewählt
                    </span>
                    <span className="font-medium">{selectedTotal.toFixed(2)} €</span>
                  </div>
                </div>
              )}
            </>
          )}
        </div>

        <DialogFooter className="flex-shrink-0">
          <Button variant="outline" onClick={onClose}>
            Abbrechen
          </Button>
          <Button
            onClick={handleTakeOver}
            disabled={selectedOrders.length === 0}
            className="bg-primary hover:bg-primary/90"
          >
            <CheckCircle className="h-4 w-4 mr-2" />
            Übernehmen ({selectedOrders.length})
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
