"use client"

import { useRef } from "react"
import { Button } from "@/components/ui/button"
import { Printer } from "lucide-react"
import QRCode from "react-qr-code"

interface ReceiptItem {
  quantity: number
  description: string
  unitPrice: number
  totalPrice: number
  discount?: {
    type: "none" | "percentage" | "fixed"
    value: number
    amount: number
  }
  vatRate: number
  vatAmount: number
  netAmount: number
  vatExempt?: boolean
}

interface TaxBreakdown {
  rate: number
  netAmount: number
  taxAmount: number
  grossAmount: number
}

interface ReceiptData {
  companyName: string
  companyAddress: string
  uid: string
  phone: string
  email: string

  cashier: string
  receiptNumber: string
  date: string
  time: string
  registerNumber: string

  items: ReceiptItem[]

  subtotal: number
  total: number

  discount?: {
    type: "none" | "percentage" | "fixed"
    value: number
    amount: number
  }

  tax: TaxBreakdown[]

  paymentMethod: string
  paidAmount: number

  rksv: string
  kassenId: string
}

interface ReceiptTemplateProps {
  receipt: ReceiptData
}

export function ReceiptTemplate({ receipt }: ReceiptTemplateProps) {
  const receiptRef = useRef<HTMLDivElement>(null)

  const handlePrint = () => {
    if (receiptRef.current) {
      const printWindow = window.open("", "_blank")
      if (printWindow) {
        printWindow.document.write(`
          <html>
            <head>
              <title>Beleg ${receipt.receiptNumber}</title>
              <style>
                body {
                  font-family: monospace;
                  font-size: 12px;
                  line-height: 1.5;
                  margin: 0;
                  padding: 20px;
                }
                .receipt {
                  width: 300px;
                  margin: 0 auto;
                }
                .text-center {
                  text-align: center;
                }
                .text-right {
                  text-align: right;
                }
                .mb-1 {
                  margin-bottom: 4px;
                }
                .mb-2 {
                  margin-bottom: 8px;
                }
                .mb-4 {
                  margin-bottom: 16px;
                }
                .border-t {
                  border-top: 1px dashed #ccc;
                  padding-top: 8px;
                  margin-top: 8px;
                }
                .border-b {
                  border-bottom: 1px dashed #ccc;
                  padding-bottom: 8px;
                  margin-bottom: 8px;
                }
                .flex {
                  display: flex;
                }
                .justify-between {
                  justify-content: space-between;
                }
                .font-bold {
                  font-weight: bold;
                }
                .text-sm {
                  font-size: 10px;
                }
                .qr-code {
                  text-align: center;
                  margin-top: 16px;
                }
              </style>
            </head>
            <body>
              ${receiptRef.current.innerHTML}
            </body>
          </html>
        `)
        printWindow.document.close()
        printWindow.focus()
        printWindow.print()
      }
    }
  }

  // QR-Code Daten generieren
  const qrCodeData = `RKSV:${receipt.rksv}:${receipt.kassenId}:${receipt.receiptNumber}:${receipt.date}:${receipt.total}`

  // Formatierungsfunktionen
  const formatCurrency = (amount: number) => {
    return amount.toFixed(2).replace(".", ",") + " €"
  }

  const formatDiscount = (discount: { type: string; value: number; amount: number }) => {
    if (discount.type === "percentage") {
      return `-${discount.value}% (${formatCurrency(discount.amount)})`
    } else if (discount.type === "fixed") {
      return formatCurrency(discount.amount)
    }
    return ""
  }

  return (
    <div className="receipt-container">
      <div className="flex justify-end mb-4 print:hidden">
        <Button onClick={handlePrint} className="flex items-center gap-2">
          <Printer className="h-4 w-4" />
          Beleg drucken
        </Button>
      </div>

      <div ref={receiptRef} className="receipt font-mono text-sm max-w-[300px] mx-auto">
        {/* Header */}
        <div className="text-center mb-4">
          <div className="font-bold text-base mb-1">{receipt.companyName}</div>
          <div className="mb-1">{receipt.companyAddress}</div>
          <div className="mb-1">UID: {receipt.uid}</div>
          <div className="mb-1">Tel: {receipt.phone}</div>
          <div>{receipt.email}</div>
        </div>

        {/* Receipt Info */}
        <div className="mb-4 border-t border-b border-dashed py-2">
          <div className="flex justify-between">
            <span>Beleg Nr.:</span>
            <span>{receipt.receiptNumber}</span>
          </div>
          <div className="flex justify-between">
            <span>Datum:</span>
            <span>{receipt.date}</span>
          </div>
          <div className="flex justify-between">
            <span>Zeit:</span>
            <span>{receipt.time}</span>
          </div>
          <div className="flex justify-between">
            <span>Kassier:</span>
            <span>{receipt.cashier}</span>
          </div>
          <div className="flex justify-between">
            <span>Kassen-ID:</span>
            <span>{receipt.registerNumber}</span>
          </div>
        </div>

        {/* Items */}
        <div className="mb-4">
          <div className="font-bold mb-2">Artikel</div>
          {receipt.items.map((item, index) => (
            <div key={index} className="mb-2">
              <div className="flex justify-between">
                <span>
                  {item.quantity}x {item.description}
                </span>
                <span>{formatCurrency(item.totalPrice)}</span>
              </div>
              <div className="text-xs text-gray-500 flex justify-between">
                <span>{formatCurrency(item.unitPrice)} / Stk.</span>
                <span>{item.vatExempt ? "MwSt. befreit" : `${item.vatRate}% MwSt.`}</span>
              </div>
              {item.discount && item.discount.type !== "none" && (
                <div className="text-xs text-gray-500 flex justify-between">
                  <span>Rabatt:</span>
                  <span>{formatDiscount(item.discount)}</span>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Totals */}
        <div className="border-t border-dashed pt-2 mb-4">
          <div className="flex justify-between mb-1">
            <span>Zwischensumme:</span>
            <span>{formatCurrency(receipt.subtotal)}</span>
          </div>

          {receipt.discount && receipt.discount.type !== "none" && (
            <div className="flex justify-between mb-1 text-green-600">
              <span>Rabatt:</span>
              <span>-{formatDiscount(receipt.discount)}</span>
            </div>
          )}

          {/* Tax Breakdown */}
          {receipt.tax.map((tax, index) => (
            <div key={index} className="text-xs text-gray-500 mb-1">
              <div className="flex justify-between">
                <span>Netto {tax.rate}%:</span>
                <span>{formatCurrency(tax.netAmount)}</span>
              </div>
              <div className="flex justify-between">
                <span>MwSt. {tax.rate}%:</span>
                <span>{formatCurrency(tax.taxAmount)}</span>
              </div>
            </div>
          ))}

          <div className="flex justify-between font-bold border-t border-dashed pt-2 mt-2">
            <span>Gesamtsumme:</span>
            <span>{formatCurrency(receipt.total)}</span>
          </div>
        </div>

        {/* Payment */}
        <div className="mb-4">
          <div className="flex justify-between">
            <span>Zahlungsart:</span>
            <span>{receipt.paymentMethod}</span>
          </div>
          <div className="flex justify-between">
            <span>Bezahlt:</span>
            <span>{formatCurrency(receipt.paidAmount)}</span>
          </div>
          {receipt.paidAmount > receipt.total && (
            <div className="flex justify-between">
              <span>Rückgeld:</span>
              <span>{formatCurrency(receipt.paidAmount - receipt.total)}</span>
            </div>
          )}
        </div>

        {/* RKSV Info */}
        <div className="text-xs text-gray-500 mb-4">
          <div className="mb-1">RKSV: {receipt.rksv}</div>
          <div>Kassen-ID: {receipt.kassenId}</div>
        </div>

        {/* QR Code */}
        <div className="qr-code mb-4 flex justify-center">
          <QRCode value={qrCodeData} size={128} />
        </div>

        {/* Footer */}
        <div className="text-center text-xs text-gray-500 mb-4">
          <div className="mb-1">Vielen Dank für Ihren Besuch!</div>
          <div>Wir freuen uns auf Ihren nächsten Besuch.</div>
        </div>
      </div>
    </div>
  )
}
