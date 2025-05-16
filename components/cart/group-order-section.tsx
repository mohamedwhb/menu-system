"use client"

import { useState } from "react"
import { ChevronDown, ChevronUp } from "lucide-react"
import { useCart } from "@/contexts/cart-context"
import { Button } from "@/components/ui/button"
import { CartItem } from "@/components/cart/cart-item"
import { Checkbox } from "@/components/ui/checkbox"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { BillSplitter } from "@/components/cart/bill-splitter"
import { cn } from "@/lib/utils"

export function GroupOrderSection() {
  const {
    tableId,
    getGuestIds,
    getGuestName,
    getItemsByGuest,
    items,
    toggleItemSelection,
    selectAllItems,
    splitMethod,
    setSplitMethod,
  } = useCart()

  const [isExpanded, setIsExpanded] = useState(true)
  const guestIds = getGuestIds()
  const hasNoGuestItems = items.some((item) => !item.guestId)

  // Check if all items are selected
  const allSelected = items.every((item) => item.selected !== false)

  // Toggle all items selection
  const handleToggleAll = () => {
    selectAllItems(!allSelected)
  }

  return (
    <div className="space-y-4">
      {/* Table ID section */}
      <div
        className="flex items-center justify-between p-3 bg-muted/30 rounded-lg cursor-pointer"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <div className="font-medium">Bestellungen für Tisch {tableId}</div>
        <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
          {isExpanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
        </Button>
      </div>

      {/* Expanded content */}
      {isExpanded && (
        <div className="space-y-4 animate-in fade-in-50 duration-200">
          {/* Info text */}
          <p className="text-xs text-muted-foreground italic">Nur Bestellungen von Tisch {tableId} sichtbar.</p>

          {/* Tabs for different splitting methods */}
          <Tabs
            defaultValue="items"
            value={splitMethod}
            onValueChange={(value) => setSplitMethod(value as "items" | "percentage" | "equal")}
            className="w-full"
          >
            <TabsList className="grid grid-cols-3 mb-4">
              <TabsTrigger value="items">Artikel auswählen</TabsTrigger>
              <TabsTrigger value="percentage">Prozentual teilen</TabsTrigger>
              <TabsTrigger value="equal">Gleichmäßig teilen</TabsTrigger>
            </TabsList>

            <TabsContent value="items" className="space-y-4">
              {/* Select all checkbox */}
              <div className="flex items-center space-x-2 p-2 border rounded-md bg-muted/20">
                <Checkbox id="select-all" checked={allSelected} onCheckedChange={handleToggleAll} />
                <label
                  htmlFor="select-all"
                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
                >
                  Alle Artikel auswählen
                </label>
              </div>

              {/* Items with no guest assigned (individual orders) */}
              {hasNoGuestItems && (
                <GuestOrderCard
                  title="Ihre Bestellung"
                  items={items.filter((item) => !item.guestId)}
                  toggleItemSelection={toggleItemSelection}
                  guestId="self"
                />
              )}

              {/* Guest orders */}
              {guestIds.map((guestId) => (
                <GuestOrderCard
                  key={guestId}
                  title={getGuestName(guestId)}
                  items={getItemsByGuest(guestId)}
                  toggleItemSelection={toggleItemSelection}
                  guestId={guestId}
                />
              ))}

              {/* Group action buttons */}
              <div className="flex gap-2 pt-2">{/* Buttons wurden entfernt */}</div>
            </TabsContent>

            <TabsContent value="percentage" className="space-y-4">
              <BillSplitter splitType="percentage" />
            </TabsContent>

            <TabsContent value="equal" className="space-y-4">
              <BillSplitter splitType="equal" />
            </TabsContent>
          </Tabs>
        </div>
      )}
    </div>
  )
}

interface GuestOrderCardProps {
  title: string
  items: Array<any>
  toggleItemSelection: (id: string, guestId?: string, selected?: boolean) => void
  guestId?: string
}

function GuestOrderCard({ title, items, toggleItemSelection, guestId }: GuestOrderCardProps) {
  const [isOpen, setIsOpen] = useState(true)

  // Calculate total for this guest
  const guestTotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0)

  // Check if all items for this guest are selected
  const allGuestItemsSelected = items.every((item) => item.selected !== false)

  // Toggle all items for this guest
  const toggleAllGuestItems = () => {
    items.forEach((item) => {
      toggleItemSelection(item.id, item.guestId, !allGuestItemsSelected)
    })
  }

  return (
    <div className="border rounded-lg overflow-hidden">
      {/* Guest header */}
      <div
        className="flex items-center justify-between p-3 bg-muted/20 cursor-pointer"
        onClick={() => setIsOpen(!isOpen)}
      >
        <div className="flex items-center gap-3">
          <Checkbox
            id={`select-guest-${guestId || "self"}`}
            checked={allGuestItemsSelected}
            onCheckedChange={(checked) => {
              // Stop propagation to prevent the accordion from toggling
              toggleAllGuestItems()
            }}
            onClick={(e) => e.stopPropagation()}
            className="data-[state=checked]:bg-primary data-[state=checked]:text-primary-foreground"
          />
          <div>
            <div className="font-medium">{title}</div>
            <div className="text-xs text-muted-foreground">
              {items.length} Artikel · {guestTotal.toFixed(2)} €
            </div>
          </div>
        </div>
        <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
          {isOpen ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
        </Button>
      </div>

      {/* Guest items */}
      {isOpen && (
        <div className="p-3 space-y-3 animate-in fade-in-50 duration-200">
          {items.map((item) => (
            <div key={item.id} className="flex items-start gap-3">
              <Checkbox
                id={`item-${item.id}-${guestId || "self"}`}
                checked={item.selected !== false}
                onCheckedChange={(checked) => {
                  toggleItemSelection(item.id, item.guestId, !!checked)
                }}
                className="mt-1"
              />
              <CartItem item={item} compact className={cn("flex-1", item.selected === false && "opacity-60")} />
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
