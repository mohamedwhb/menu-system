"use client"

import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Plus, Minus, Trash2, AlertTriangle, Clock } from "lucide-react"
import { useOrders, type Order, type OrderItem } from "@/contexts/orders-context"
import { useToast } from "@/hooks/use-toast"
import { menuItems } from "@/data/menu-items"

interface EditOrderDialogProps {
  order: Order
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function EditOrderDialog({ order, open, onOpenChange }: EditOrderDialogProps) {
  const { updateOrder } = useOrders()
  const { toast } = useToast()

  const [editedOrder, setEditedOrder] = useState<Order>(order)
  const [activeTab, setActiveTab] = useState("items")
  const [newItems, setNewItems] = useState<OrderItem[]>([])

  useEffect(() => {
    setEditedOrder(order)
    setNewItems([])
  }, [order, open])

  const canEdit = order.status === "new" || order.status === "in-progress"

  const addNewItem = (menuItemId: string) => {
    const menuItem = menuItems.find((item) => item.id === menuItemId)
    if (!menuItem) return

    const newItem: OrderItem = {
      id: `new-${Date.now()}`,
      name: menuItem.name,
      price: menuItem.price,
      quantity: 1,
    }

    setNewItems((prev) => [...prev, newItem])
  }

  const updateItemQuantity = (itemId: string, quantity: number, isNew = false) => {
    if (quantity <= 0) {
      removeItem(itemId, isNew)
      return
    }

    if (isNew) {
      setNewItems((prev) => prev.map((item) => (item.id === itemId ? { ...item, quantity } : item)))
    } else {
      setEditedOrder((prev) => ({
        ...prev,
        items: prev.items.map((item) => (item.id === itemId ? { ...item, quantity } : item)),
      }))
    }
  }

  const removeItem = (itemId: string, isNew = false) => {
    if (isNew) {
      setNewItems((prev) => prev.filter((item) => item.id !== itemId))
    } else {
      setEditedOrder((prev) => ({
        ...prev,
        items: prev.items.filter((item) => item.id !== itemId),
      }))
    }
  }

  const applyDiscount = (type: "percent" | "fixed", value: number) => {
    const subtotal = calculateSubtotal()
    let discount = 0

    if (type === "percent") {
      discount = (subtotal * value) / 100
    } else {
      discount = value
    }

    setEditedOrder((prev) => ({ ...prev, discount }))
  }

  const calculateSubtotal = () => {
    const originalTotal = editedOrder.items.reduce((sum, item) => sum + item.price * item.quantity, 0)
    const newItemsTotal = newItems.reduce((sum, item) => sum + item.price * item.quantity, 0)
    return originalTotal + newItemsTotal
  }

  const calculateTotal = () => {
    const subtotal = calculateSubtotal()
    const tax = subtotal * 0.19
    return subtotal + tax - editedOrder.discount
  }

  const saveChanges = () => {
    const allItems = [...editedOrder.items, ...newItems]
    const updatedOrder = {
      ...editedOrder,
      items: allItems,
      amount: calculateTotal(),
    }

    updateOrder(order.id, updatedOrder)

    toast({
      title: "Bestellung aktualisiert",
      description: "Alle Änderungen wurden erfolgreich gespeichert.",
    })

    onOpenChange(false)
  }

  if (!canEdit) {
    return (
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="sm:max-w-[400px]">
          <DialogHeader>
            <DialogTitle>Bestellung kann nicht bearbeitet werden</DialogTitle>
          </DialogHeader>
          <div className="flex flex-col items-center gap-4 py-6">
            <AlertTriangle className="h-12 w-12 text-amber-500" />
            <p className="text-center text-sm text-gray-600">
              Bestellungen mit Status "{order.status === "completed" ? "Abgeschlossen" : "Storniert"}" können nicht mehr
              bearbeitet werden.
            </p>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => onOpenChange(false)}>
              Schließen
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    )
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[800px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Bestellung {order.id} bearbeiten</DialogTitle>
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <Clock className="h-4 w-4" />
            {order.date} um {order.time} • {order.table}
          </div>
        </DialogHeader>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="items">Artikel</TabsTrigger>
            <TabsTrigger value="add">Hinzufügen</TabsTrigger>
            <TabsTrigger value="details">Details</TabsTrigger>
            <TabsTrigger value="audit">Protokoll</TabsTrigger>
          </TabsList>

          <TabsContent value="items" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Bestellte Artikel</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {editedOrder.items.map((item) => (
                  <div key={item.id} className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex-1">
                      <div className="font-medium">{item.name}</div>
                      <div className="text-sm text-gray-600">{item.price.toFixed(2)} € pro Stück</div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => updateItemQuantity(item.id, item.quantity - 1)}
                      >
                        <Minus className="h-4 w-4" />
                      </Button>
                      <span className="w-8 text-center">{item.quantity}</span>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => updateItemQuantity(item.id, item.quantity + 1)}
                      >
                        <Plus className="h-4 w-4" />
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        className="text-red-600 hover:bg-red-50"
                        onClick={() => removeItem(item.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}

                {newItems.length > 0 && (
                  <>
                    <Separator />
                    <div className="text-sm font-medium text-green-600">Neue Artikel:</div>
                    {newItems.map((item) => (
                      <div
                        key={item.id}
                        className="flex items-center justify-between p-3 border rounded-lg bg-green-50"
                      >
                        <div className="flex-1">
                          <div className="font-medium flex items-center gap-2">
                            {item.name}
                            <Badge variant="secondary" className="bg-green-100 text-green-800">
                              Neu
                            </Badge>
                          </div>
                          <div className="text-sm text-gray-600">{item.price.toFixed(2)} € pro Stück</div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => updateItemQuantity(item.id, item.quantity - 1, true)}
                          >
                            <Minus className="h-4 w-4" />
                          </Button>
                          <span className="w-8 text-center">{item.quantity}</span>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => updateItemQuantity(item.id, item.quantity + 1, true)}
                          >
                            <Plus className="h-4 w-4" />
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            className="text-red-600 hover:bg-red-50"
                            onClick={() => removeItem(item.id, true)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Preisübersicht</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <div className="flex justify-between">
                  <span>Zwischensumme:</span>
                  <span>{calculateSubtotal().toFixed(2)} €</span>
                </div>
                <div className="flex justify-between">
                  <span>MwSt. (19%):</span>
                  <span>{(calculateSubtotal() * 0.19).toFixed(2)} €</span>
                </div>
                {editedOrder.discount > 0 && (
                  <div className="flex justify-between text-green-600">
                    <span>Rabatt:</span>
                    <span>-{editedOrder.discount.toFixed(2)} €</span>
                  </div>
                )}
                <Separator />
                <div className="flex justify-between font-bold">
                  <span>Gesamtsumme:</span>
                  <span>{calculateTotal().toFixed(2)} €</span>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="add" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Artikel hinzufügen</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {menuItems.slice(0, 10).map((item) => (
                    <div key={item.id} className="flex items-center justify-between p-3 border rounded-lg">
                      <div>
                        <div className="font-medium">{item.name}</div>
                        <div className="text-sm text-gray-600">{item.price.toFixed(2)} €</div>
                      </div>
                      <Button size="sm" onClick={() => addNewItem(item.id)}>
                        <Plus className="h-4 w-4 mr-1" />
                        Hinzufügen
                      </Button>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="details" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Rabatt anwenden</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label>Prozentrabatt</Label>
                    <div className="flex gap-2">
                      <Input type="number" placeholder="10" className="flex-1" id="percent-discount" />
                      <Button
                        variant="outline"
                        onClick={() => {
                          const input = document.getElementById("percent-discount") as HTMLInputElement
                          const value = Number.parseFloat(input.value) || 0
                          applyDiscount("percent", value)
                        }}
                      >
                        Anwenden
                      </Button>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label>Fester Rabatt (€)</Label>
                    <div className="flex gap-2">
                      <Input type="number" placeholder="5.00" step="0.01" className="flex-1" id="fixed-discount" />
                      <Button
                        variant="outline"
                        onClick={() => {
                          const input = document.getElementById("fixed-discount") as HTMLInputElement
                          const value = Number.parseFloat(input.value) || 0
                          applyDiscount("fixed", value)
                        }}
                      >
                        Anwenden
                      </Button>
                    </div>
                  </div>
                  {editedOrder.discount > 0 && (
                    <div className="p-3 bg-green-50 rounded-lg">
                      <div className="text-sm font-medium text-green-800">
                        Aktueller Rabatt: {editedOrder.discount.toFixed(2)} €
                      </div>
                      <Button
                        size="sm"
                        variant="outline"
                        className="mt-2"
                        onClick={() => setEditedOrder((prev) => ({ ...prev, discount: 0 }))}
                      >
                        Rabatt entfernen
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Weitere Details</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="payment-method">Zahlungsmethode</Label>
                    <Select
                      value={editedOrder.paymentMethod}
                      onValueChange={(value) => setEditedOrder((prev) => ({ ...prev, paymentMethod: value }))}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Bargeld">Bargeld</SelectItem>
                        <SelectItem value="Karte">Karte</SelectItem>
                        <SelectItem value="PayPal">PayPal</SelectItem>
                        <SelectItem value="Apple Pay">Apple Pay</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="notes">Anmerkungen</Label>
                    <Textarea
                      id="notes"
                      value={editedOrder.notes || ""}
                      onChange={(e) => setEditedOrder((prev) => ({ ...prev, notes: e.target.value }))}
                      placeholder="Zusätzliche Anmerkungen zur Bestellung..."
                    />
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="audit" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Änderungsprotokoll</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {order.auditLog?.map((entry, index) => (
                    <div key={index} className="flex items-start gap-3 p-3 border rounded-lg">
                      <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
                      <div className="flex-1">
                        <div className="font-medium">{entry.action}</div>
                        <div className="text-sm text-gray-600">{entry.details}</div>
                        <div className="text-xs text-gray-500 mt-1">
                          {new Date(entry.timestamp).toLocaleString("de-DE")} • {entry.user}
                        </div>
                      </div>
                    </div>
                  )) || <div className="text-center text-gray-500 py-6">Keine Änderungen protokolliert</div>}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        <DialogFooter className="gap-2">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Abbrechen
          </Button>
          <Button onClick={saveChanges}>Änderungen speichern</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
