"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import {
  Clock,
  CheckCircle2,
  XCircle,
  Printer,
  Receipt,
  AlertTriangle,
  User,
  Phone,
  CreditCard,
  MapPin,
} from "lucide-react"
import { orders } from "@/data/orders"
import { EditOrderDialog } from "./edit-order-dialog"
import { useToast } from "@/hooks/use-toast"
import { useOrders } from "@/contexts/orders-context"

interface ViewOrderDialogProps {
  orderId: string
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function ViewOrderDialog({ orderId, open, onOpenChange }: ViewOrderDialogProps) {
  const router = useRouter()
  const { toast } = useToast()
  const { updateOrder } = useOrders()
  const [activeTab, setActiveTab] = useState("details")
  const [showEditDialog, setShowEditDialog] = useState(false)

  const order = orders.find((o) => o.id === orderId)

  if (!order) return null

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "new":
        return (
          <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200 flex items-center gap-1">
            <Clock className="h-3 w-3" />
            Neu
          </Badge>
        )
      case "in-progress":
        return (
          <Badge variant="outline" className="bg-amber-50 text-amber-700 border-amber-200 flex items-center gap-1">
            <Clock className="h-3 w-3" />
            In Bearbeitung
          </Badge>
        )
      case "completed":
        return (
          <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200 flex items-center gap-1">
            <CheckCircle2 className="h-3 w-3" />
            Abgeschlossen
          </Badge>
        )
      case "cancelled":
        return (
          <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200 flex items-center gap-1">
            <XCircle className="h-3 w-3" />
            Storniert
          </Badge>
        )
      default:
        return null
    }
  }

  // Calculate subtotal, tax, and total
  const subtotal = order.items.reduce((sum, item) => sum + item.price * item.quantity, 0)
  const tax = subtotal * 0.19 // 19% VAT
  const total = order.amount

  const viewReceipt = () => {
    onOpenChange(false)
    router.push(`/dashboard/orders/${orderId}/receipt`)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] bg-white p-0 gap-0">
        <DialogHeader className="p-6 pb-2">
          <div className="flex items-center justify-between">
            <DialogTitle className="text-xl">Bestellung {order.id}</DialogTitle>
            {getStatusBadge(order.status)}
          </div>
          <div className="text-sm text-[#6B7280] mt-1">
            {order.date} um {order.time} • {order.table}
          </div>
        </DialogHeader>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <div className="px-6">
            <TabsList className="grid w-full grid-cols-3 bg-[#F9FAFB]">
              <TabsTrigger value="details">Details</TabsTrigger>
              <TabsTrigger value="customer">Kunde</TabsTrigger>
              <TabsTrigger value="actions">Aktionen</TabsTrigger>
            </TabsList>
          </div>

          <TabsContent value="details" className="p-6 pt-4">
            <div className="space-y-4">
              <div>
                <h3 className="text-sm font-medium mb-2">Bestellte Artikel</h3>
                <div className="space-y-2">
                  {order.items.map((item, index) => (
                    <div key={index} className="flex justify-between text-sm">
                      <div className="flex items-start">
                        <span className="text-[#6B7280] mr-2">{item.quantity}x</span>
                        <div>
                          <div>{item.name}</div>
                          {item.options && <div className="text-xs text-[#6B7280]">{item.options}</div>}
                        </div>
                      </div>
                      <div className="font-medium">{(item.price * item.quantity).toFixed(2)} €</div>
                    </div>
                  ))}
                </div>
              </div>

              <Separator className="my-4" />

              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-[#6B7280]">Zwischensumme</span>
                  <span>{subtotal.toFixed(2)} €</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-[#6B7280]">MwSt. (19%)</span>
                  <span>{tax.toFixed(2)} €</span>
                </div>
                {order.discount > 0 && (
                  <div className="flex justify-between text-sm text-green-600">
                    <span>Rabatt</span>
                    <span>-{order.discount.toFixed(2)} €</span>
                  </div>
                )}
                <div className="flex justify-between font-medium">
                  <span>Gesamtsumme</span>
                  <span>{total.toFixed(2)} €</span>
                </div>
              </div>

              <Separator className="my-4" />

              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm">
                  <CreditCard className="h-4 w-4 text-[#6B7280]" />
                  <span className="text-[#6B7280]">Zahlungsmethode:</span>
                  <span>{order.paymentMethod}</span>
                </div>

                {order.notes && (
                  <div className="mt-4">
                    <h3 className="text-sm font-medium mb-1">Anmerkungen</h3>
                    <div className="text-sm p-3 bg-[#F9FAFB] rounded-md">{order.notes}</div>
                  </div>
                )}
              </div>

              <div className="mt-4">
                <Button variant="outline" className="w-full" onClick={viewReceipt}>
                  <Receipt className="mr-2 h-4 w-4" />
                  Beleg anzeigen
                </Button>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="customer" className="p-6 pt-4">
            <div className="space-y-4">
              {order.customer ? (
                <>
                  <div className="flex items-center gap-2">
                    <User className="h-5 w-5 text-[#6B7280]" />
                    <div>
                      <div className="font-medium">{order.customer.name}</div>
                      <div className="text-sm text-[#6B7280]">Stammkunde seit {order.customer.since}</div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <div className="text-sm text-[#6B7280]">Kontakt</div>
                      <div className="flex items-center gap-2 text-sm">
                        <Phone className="h-4 w-4 text-[#6B7280]" />
                        {order.customer.phone}
                      </div>
                      <div className="flex items-center gap-2 text-sm">
                        <svg
                          className="h-4 w-4 text-[#6B7280]"
                          fill="none"
                          height="24"
                          stroke="currentColor"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          viewBox="0 0 24 24"
                          width="24"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path d="M19 5H5a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2Z" />
                          <path d="m3 7 9 6 9-6" />
                        </svg>
                        {order.customer.email}
                      </div>
                    </div>

                    {order.customer.address && (
                      <div className="space-y-1">
                        <div className="text-sm text-[#6B7280]">Adresse</div>
                        <div className="flex items-start gap-2 text-sm">
                          <MapPin className="h-4 w-4 text-[#6B7280] mt-0.5" />
                          <div>
                            {order.customer.address.street}
                            <br />
                            {order.customer.address.zip} {order.customer.address.city}
                          </div>
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="mt-4">
                    <div className="text-sm text-[#6B7280] mb-2">Bestellhistorie</div>
                    <div className="text-sm bg-[#F9FAFB] p-3 rounded-md">
                      <div className="font-medium">{order.customer.orderCount} Bestellungen insgesamt</div>
                      <div className="text-[#6B7280] mt-1">
                        Durchschnittlicher Bestellwert: {order.customer.averageOrderValue.toFixed(2)} €
                      </div>
                    </div>
                  </div>
                </>
              ) : (
                <div className="flex flex-col items-center justify-center py-6 text-center">
                  <User className="h-10 w-10 text-[#9CA3AF] mb-2" />
                  <h3 className="text-lg font-medium">Kein Kundenprofil</h3>
                  <p className="text-sm text-[#6B7280] max-w-xs mt-1">
                    Diese Bestellung wurde ohne Kundenkonto aufgegeben oder der Kunde konnte nicht zugeordnet werden.
                  </p>
                </div>
              )}
            </div>
          </TabsContent>

          <TabsContent value="actions" className="p-6 pt-4">
            <div className="space-y-4">
              <h3 className="text-sm font-medium">Status ändern</h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {order.status === "new" && (
                  <Button
                    variant="outline"
                    className="justify-start"
                    onClick={() => {
                      updateOrder(orderId, { status: "in-progress" })
                      toast({
                        title: "Status aktualisiert",
                        description: "Bestellung wurde auf 'In Bearbeitung' gesetzt.",
                      })
                    }}
                  >
                    <Clock className="mr-2 h-4 w-4 text-amber-500" />
                    In Bearbeitung setzen
                  </Button>
                )}

                {(order.status === "new" || order.status === "in-progress") && (
                  <Button
                    variant="outline"
                    className="justify-start"
                    onClick={() => {
                      updateOrder(orderId, { status: "completed" })
                      toast({
                        title: "Status aktualisiert",
                        description: "Bestellung wurde als abgeschlossen markiert.",
                      })
                    }}
                  >
                    <CheckCircle2 className="mr-2 h-4 w-4 text-green-500" />
                    Als abgeschlossen markieren
                  </Button>
                )}

                {order.status !== "cancelled" && (
                  <Button
                    variant="outline"
                    className="justify-start text-red-500 border-red-200 hover:bg-red-50"
                    onClick={() => {
                      updateOrder(orderId, { status: "cancelled" })
                      toast({
                        title: "Bestellung storniert",
                        description: "Bestellung wurde erfolgreich storniert.",
                      })
                    }}
                  >
                    <XCircle className="mr-2 h-4 w-4" />
                    Bestellung stornieren
                  </Button>
                )}
              </div>

              <Separator className="my-4" />

              <h3 className="text-sm font-medium">Dokumente</h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                <Button variant="outline" className="justify-start" onClick={viewReceipt}>
                  <Receipt className="mr-2 h-4 w-4" />
                  Beleg anzeigen
                </Button>

                <Button variant="outline" className="justify-start">
                  <Printer className="mr-2 h-4 w-4" />
                  Bestellung drucken
                </Button>
              </div>

              {order.status !== "cancelled" && (
                <>
                  <Separator className="my-4" />

                  <div className="bg-amber-50 border border-amber-200 rounded-md p-3 flex items-start gap-2">
                    <AlertTriangle className="h-5 w-5 text-amber-500 mt-0.5" />
                    <div>
                      <h4 className="text-sm font-medium text-amber-800">Bestellung bearbeiten</h4>
                      <p className="text-xs text-amber-700 mt-1">
                        Das Bearbeiten einer Bestellung kann Auswirkungen auf die Küche und Abrechnung haben. Bitte nur
                        bei Bedarf durchführen.
                      </p>
                      <Button
                        size="sm"
                        variant="outline"
                        className="mt-2 h-8 text-xs bg-white"
                        onClick={() => setShowEditDialog(true)}
                        disabled={order.status === "completed" || order.status === "cancelled"}
                      >
                        Bestellung bearbeiten
                      </Button>
                    </div>
                  </div>
                </>
              )}
            </div>
          </TabsContent>
        </Tabs>

        <DialogFooter className="p-6 pt-2">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Schließen
          </Button>
        </DialogFooter>
      </DialogContent>
      <EditOrderDialog order={order} open={showEditDialog} onOpenChange={setShowEditDialog} />
    </Dialog>
  )
}
