"use client"

import { useState } from "react"
import { format } from "date-fns"
import { de } from "date-fns/locale"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Button } from "@/components/ui/button"
import { ReceiptPdfGenerator } from "./receipt-pdf-generator"

interface ReceiptItem {
  id: string
  name: string
  price: number
  quantity: number
  notes?: string
  timestamp?: number
  guestId?: string
  guestName?: string
  status: "cart" | "kitchen" | "paid"
}

interface ReceiptDisplayProps {
  items: ReceiptItem[]
  orderNumber: string
  tableId?: string
  paymentMethod: string
  subtotal: number
  tipAmount: number
  total: number
  timestamp: number
}

export function ReceiptDisplay({
  items,
  orderNumber,
  tableId,
  paymentMethod,
  subtotal,
  tipAmount,
  total,
  timestamp,
}: ReceiptDisplayProps) {
  const [showDetails, setShowDetails] = useState(false)

  // Formatierungsfunktionen
  const formatCurrency = (amount: number) => {
    return amount.toFixed(2).replace(".", ",") + " €"
  }

  const formatDate = (date: Date) => {
    return format(date, "dd. MMMM yyyy", { locale: de })
  }

  const formatTime = (date: Date) => {
    return format(date, "HH:mm 'Uhr'", { locale: de })
  }

  // Zahlungsmethode formatieren
  const getPaymentMethodName = (method: string) => {
    switch (method) {
      case "card":
        return "Kreditkarte"
      case "cash":
        return "Bargeld"
      case "paypal":
        return "PayPal"
      case "applepay":
        return "Apple Pay"
      case "googlepay":
        return "Google Pay"
      case "banktransfer":
        return "Überweisung"
      default:
        return method
    }
  }

  return (
    <Card className="border-2 border-muted">
      <CardHeader className="bg-muted/20 pb-2">
        <CardTitle className="text-lg flex justify-between items-center">
          <span>Quittung</span>
          <Button variant="ghost" size="sm" onClick={() => setShowDetails(!showDetails)}>
            {showDetails ? "Details ausblenden" : "Details anzeigen"}
          </Button>
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-4">
        {showDetails ? (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-2 text-sm">
              <div>
                <p className="text-muted-foreground">Bestellnummer</p>
                <p className="font-medium">{orderNumber}</p>
              </div>
              <div>
                <p className="text-muted-foreground">Datum</p>
                <p className="font-medium">{formatDate(new Date(timestamp))}</p>
              </div>
              <div>
                <p className="text-muted-foreground">Uhrzeit</p>
                <p className="font-medium">{formatTime(new Date(timestamp))}</p>
              </div>
              <div>
                <p className="text-muted-foreground">Tisch</p>
                <p className="font-medium">{tableId || "Nicht angegeben"}</p>
              </div>
              <div>
                <p className="text-muted-foreground">Zahlungsmethode</p>
                <p className="font-medium">{getPaymentMethodName(paymentMethod)}</p>
              </div>
            </div>

            <Separator />

            <div className="space-y-2">
              <p className="font-medium">Artikel</p>
              {items.map((item) => (
                <div key={`${item.id}-${item.guestId || "self"}`} className="flex justify-between text-sm">
                  <div>
                    <span>
                      {item.quantity}x {item.name}
                    </span>
                    {item.guestId && item.guestName && (
                      <span className="text-xs text-muted-foreground ml-2">({item.guestName})</span>
                    )}
                  </div>
                  <span className="font-medium">{formatCurrency(item.price * item.quantity)}</span>
                </div>
              ))}
            </div>

            <Separator />

            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Zwischensumme</span>
                <span>{formatCurrency(subtotal)}</span>
              </div>
              {tipAmount > 0 && (
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Trinkgeld</span>
                  <span>{formatCurrency(tipAmount)}</span>
                </div>
              )}
              <div className="flex justify-between font-medium">
                <span>Gesamtbetrag</span>
                <span>{formatCurrency(total)}</span>
              </div>
            </div>
          </div>
        ) : (
          <div className="text-center py-2">
            <p className="font-medium">Bestellnummer: {orderNumber}</p>
            <p className="text-sm text-muted-foreground">
              {formatDate(new Date(timestamp))}, {formatTime(new Date(timestamp))}
            </p>
            <p className="font-medium mt-2">Gesamtbetrag: {formatCurrency(total)}</p>
          </div>
        )}

        <ReceiptPdfGenerator
          items={items}
          orderNumber={orderNumber}
          tableId={tableId}
          paymentMethod={paymentMethod}
          subtotal={subtotal}
          tipAmount={tipAmount}
          total={total}
          timestamp={timestamp}
          showIconsOnly={!showDetails}
        />
      </CardContent>
    </Card>
  )
}
