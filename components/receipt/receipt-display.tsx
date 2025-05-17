"use client"

import { format } from "date-fns"
import { de } from "date-fns/locale"
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
  // Formatierungsfunktionen
  const formatCurrency = (amount: number) => {
    return amount.toFixed(2).replace(".", ",") + " €"
  }

  const formatDate = (date: Date) => {
    return format(date, "dd. MMMM yyyy, HH:mm 'Uhr'", { locale: de })
  }

  return (
    <div className="space-y-4">
      <div className="bg-muted p-4 rounded-lg">
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm text-muted-foreground">Bestellnummer:</span>
          <span className="font-medium">{orderNumber}</span>
        </div>
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm text-muted-foreground">Datum:</span>
          <span>{formatDate(new Date(timestamp))}</span>
        </div>
        {tableId && (
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm text-muted-foreground">Tisch:</span>
            <span>{tableId}</span>
          </div>
        )}
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm text-muted-foreground">Zahlungsmethode:</span>
          <span className="capitalize">{paymentMethod === "card" ? "Karte" : paymentMethod}</span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-sm text-muted-foreground">Gesamtbetrag:</span>
          <span className="font-bold">{formatCurrency(total)}</span>
        </div>
      </div>

      <div className="border rounded-lg p-4">
        <h3 className="font-medium mb-3">Quittung</h3>
        <ReceiptPdfGenerator
          items={items}
          orderNumber={orderNumber}
          tableId={tableId}
          paymentMethod={paymentMethod}
          subtotal={subtotal}
          tipAmount={tipAmount}
          total={total}
          timestamp={timestamp}
        />
      </div>
    </div>
  )
}
