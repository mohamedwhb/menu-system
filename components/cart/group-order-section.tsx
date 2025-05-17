"use client"

import { useState, useEffect, useRef } from "react"
import { ChevronDown, ChevronUp, Users, DivideSquare } from "lucide-react"
import { useCart } from "@/contexts/cart-context"
import { Button } from "@/components/ui/button"
import { CartItem } from "@/components/cart/cart-item"
import { Checkbox } from "@/components/ui/checkbox"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { BillSplitter } from "@/components/cart/bill-splitter"
import { cn } from "@/lib/utils"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { Badge } from "@/components/ui/badge"

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
  const hasNoGuestItems = items && items.some((item) => !item.guestId)

  // Check if all items are selected
  const allSelected = items && items.every((item) => item.selected !== false)

  // Toggle all items selection
  const handleToggleAll = () => {
    selectAllItems(!allSelected)
  }

  // Calculate total for selected items
  const selectedTotal = items
    ? items.filter((item) => item.selected !== false).reduce((sum, item) => sum + item.price * item.quantity, 0)
    : 0

  // Calculate total for all items
  const totalAmount = items ? items.reduce((sum, item) => sum + item.price * item.quantity, 0) : 0

  // Calculate percentage of selected items
  const selectedPercentage = totalAmount > 0 ? (selectedTotal / totalAmount) * 100 : 0

  // Create refs for checkboxes with indeterminate state
  const checkboxRefs = useRef<Record<string, HTMLInputElement | null>>({})

  // Update indeterminate state for checkboxes
  useEffect(() => {
    if (!guestIds) return

    guestIds.forEach((guestId) => {
      const guestItems = getItemsByGuest(guestId)
      if (!guestItems || guestItems.length === 0) return

      const checkbox = checkboxRefs.current[`guest-${guestId}`]
      if (!checkbox) return

      const selectedCount = guestItems.filter((item) => item.selected !== false).length
      checkbox.indeterminate = selectedCount > 0 && selectedCount < guestItems.length
    })
  }, [items, guestIds, getItemsByGuest])

  if (!items) {
    return <div>Keine Artikel vorhanden</div>
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
          <div className="flex items-center justify-between">
            <p className="text-xs text-muted-foreground italic">Nur Bestellungen von Tisch {tableId} sichtbar.</p>
            <p className="text-xs font-medium">
              Gesamt: <span className="text-primary">{totalAmount.toFixed(2)} €</span>
            </p>
          </div>

          {/* Tabs for different splitting methods */}
          <Tabs
            defaultValue="items"
            value={splitMethod}
            onValueChange={(value) => setSplitMethod(value as "items" | "equal")}
            className="w-full"
          >
            <TabsList className="grid grid-cols-2 mb-4">
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <TabsTrigger value="items" className="flex items-center gap-1.5">
                      <Users className="h-3.5 w-3.5" />
                      <span className="hidden sm:inline">Artikel auswählen</span>
                      <span className="sm:hidden">Artikel</span>
                    </TabsTrigger>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Wählen Sie einzelne Artikel für jeden Gast aus</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>

              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <TabsTrigger value="equal" className="flex items-center gap-1.5">
                      <DivideSquare className="h-3.5 w-3.5" />
                      <span className="hidden sm:inline">Gleichmäßig teilen</span>
                      <span className="sm:hidden">Gleich</span>
                    </TabsTrigger>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Teilen Sie die Rechnung gleichmäßig auf</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </TabsList>

            <TabsContent value="items" className="space-y-4">
              {/* Selected items summary */}
              <div className="flex items-center justify-between p-2 border rounded-md bg-muted/20">
                <div className="flex items-center space-x-2">
                  <Checkbox id="select-all" checked={allSelected} onCheckedChange={handleToggleAll} />
                  <label
                    htmlFor="select-all"
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
                  >
                    Alle Artikel auswählen
                  </label>
                </div>
                <div className="flex items-center gap-2">
                  <div className="text-xs">
                    <span className="font-medium">{selectedTotal.toFixed(2)} €</span>
                    <span className="text-muted-foreground"> ({selectedPercentage.toFixed(0)}%)</span>
                  </div>
                  <Badge variant={selectedTotal > 0 ? "default" : "outline"} className="text-xs">
                    {selectedTotal > 0 ? "Ausgewählt" : "Nichts ausgewählt"}
                  </Badge>
                </div>
              </div>

              {/* Items with no guest assigned (individual orders) */}
              {hasNoGuestItems && (
                <GuestOrderCard
                  title="Ihre Bestellung"
                  items={items.filter((item) => !item.guestId)}
                  toggleItemSelection={toggleItemSelection}
                  guestId="self"
                  checkboxRef={(el) => {
                    checkboxRefs.current[`guest-self`] = el
                  }}
                />
              )}

              {/* Guest orders */}
              {guestIds &&
                guestIds.map((guestId) => (
                  <GuestOrderCard
                    key={guestId}
                    title={getGuestName(guestId)}
                    items={getItemsByGuest(guestId)}
                    toggleItemSelection={toggleItemSelection}
                    guestId={guestId}
                    checkboxRef={(el) => {
                      checkboxRefs.current[`guest-${guestId}`] = el
                    }}
                  />
                ))}

              {/* Group action buttons */}
              <div className="flex gap-2 pt-2">{/* Buttons wurden entfernt */}</div>
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
  checkboxRef: (el: HTMLInputElement | null) => void
}

function GuestOrderCard({ title, items, toggleItemSelection, guestId, checkboxRef }: GuestOrderCardProps) {
  const [isOpen, setIsOpen] = useState(true)

  // Ensure items is an array
  const safeItems = Array.isArray(items) ? items : []

  // Calculate total for this guest
  const guestTotal = safeItems.reduce((sum, item) => sum + item.price * item.quantity, 0)

  // Calculate selected total for this guest
  const selectedTotal = safeItems
    .filter((item) => item.selected !== false)
    .reduce((sum, item) => sum + item.price * item.quantity, 0)

  // Check if all items for this guest are selected
  const allGuestItemsSelected = safeItems.length > 0 && safeItems.every((item) => item.selected !== false)

  // Check if some items for this guest are selected
  const someGuestItemsSelected = safeItems.some((item) => item.selected !== false) && !allGuestItemsSelected

  // Toggle all items for this guest
  const toggleAllGuestItems = () => {
    safeItems.forEach((item) => {
      toggleItemSelection(item.id, item.guestId, !allGuestItemsSelected)
    })
  }

  return (
    <div
      className={cn(
        "border rounded-lg overflow-hidden transition-all",
        allGuestItemsSelected ? "border-primary/30 bg-primary/5" : "border-border",
        someGuestItemsSelected && "border-primary/20",
      )}
    >
      {/* Guest header */}
      <div
        className={cn(
          "flex items-center justify-between p-3 cursor-pointer",
          allGuestItemsSelected ? "bg-primary/10" : "bg-muted/20",
          someGuestItemsSelected && "bg-primary/5",
        )}
        onClick={() => setIsOpen(!isOpen)}
      >
        <div className="flex items-center gap-3">
          <Checkbox
            id={`select-guest-${guestId || "self"}`}
            checked={allGuestItemsSelected}
            ref={checkboxRef}
            onCheckedChange={(checked) => {
              // Stop propagation to prevent the accordion from toggling
              toggleAllGuestItems()
            }}
            onClick={(e) => e.stopPropagation()}
            className={cn("data-[state=checked]:bg-primary data-[state=checked]:text-primary-foreground")}
          />
          <div>
            <div className="font-medium">{title}</div>
            <div className="text-xs text-muted-foreground">
              {safeItems.length} Artikel · {guestTotal.toFixed(2)} €
              {selectedTotal > 0 && selectedTotal < guestTotal && (
                <span className="ml-1 text-primary font-medium">({selectedTotal.toFixed(2)} € ausgewählt)</span>
              )}
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
          {safeItems.map((item) => (
            <div key={item.id} className="flex items-start gap-3">
              <Checkbox
                id={`item-${item.id}-${guestId || "self"}`}
                checked={item.selected !== false}
                onCheckedChange={(checked) => {
                  toggleItemSelection(item.id, item.guestId, !!checked)
                }}
                className="mt-1"
              />
              <CartItem
                item={item}
                compact
                className={cn(
                  "flex-1 transition-all",
                  item.selected !== false ? "border-primary/20 bg-primary/5" : "opacity-80",
                )}
              />
            </div>
          ))}

          {safeItems.length === 0 && (
            <div className="text-sm text-muted-foreground italic">Keine Artikel für diesen Gast</div>
          )}
        </div>
      )}
    </div>
  )
}
