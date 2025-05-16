"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import { ArrowLeft, Printer, Download, Mail, Share2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { ReceiptTemplate } from "@/components/dashboard/orders/receipt-template"
import { orders } from "@/data/orders"
import { Spinner } from "@/components/ui/spinner"

export default function ReceiptPage() {
  const params = useParams()
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(true)
  const [order, setOrder] = useState<any>(null)
  const [isEmailDialogOpen, setIsEmailDialogOpen] = useState(false)
  const [emailAddress, setEmailAddress] = useState("")

  useEffect(() => {
    if (params.id) {
      fetchOrder(params.id as string)
    }
  }, [params.id])

  async function fetchOrder(id: string) {
    setIsLoading(true)
    // In a real app, you would fetch from an API
    const foundOrder = orders.find((o) => o.id === id)

    if (foundOrder) {
      // Add a small delay to simulate loading
      setTimeout(() => {
        setOrder(foundOrder)
        setIsLoading(false)
      }, 500)
    } else {
      router.push("/dashboard/orders")
    }
  }

  function handlePrint() {
    window.print()
  }

  function handleExport(format: string) {
    if (!order) return

    // In a real app, this would trigger an actual export
    alert(`Bestellung ${order.id} wird als ${format.toUpperCase()} exportiert.`)
  }

  function handleSendEmail() {
    if (!order || !emailAddress) return

    // In a real app, this would send an actual email
    alert(`Beleg für Bestellung ${order.id} wurde an ${emailAddress} gesendet.`)
    setIsEmailDialogOpen(false)
    setEmailAddress("")
  }

  function handleShare() {
    if (!order) return

    // In a real app, this would generate a shareable link
    const shareableLink = `${window.location.origin}/dashboard/orders/${order.id}/receipt`

    // Copy to clipboard
    navigator.clipboard.writeText(shareableLink).then(() => {
      alert("Der Link zum Beleg wurde in die Zwischenablage kopiert.")
    })
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-[calc(100vh-200px)]">
        <Spinner className="h-8 w-8" />
      </div>
    )
  }

  if (!order) {
    return (
      <div className="p-6">
        <div className="flex items-center justify-between mb-6">
          <Button variant="outline" onClick={() => router.push("/dashboard/orders")}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Zurück
          </Button>
        </div>
        <div className="text-center py-12">
          <h2 className="text-2xl font-bold mb-2">Bestellung nicht gefunden</h2>
          <p className="text-gray-500">Die angeforderte Bestellung existiert nicht.</p>
        </div>
      </div>
    )
  }

  // Calculate subtotal, tax, and total
  const subtotal = order.items.reduce((sum: number, item: any) => sum + item.price * item.quantity, 0)
  const taxRate = 0.19 // 19% VAT
  const taxAmount = subtotal * taxRate
  const total = order.amount

  // Prepare receipt data
  const receiptData = {
    companyName: "Bella Italia Restaurant",
    companyAddress: "Hauptstraße 123, 10115 Berlin",
    uid: "DE123456789",
    phone: "+49 30 1234567",
    email: "info@bella-italia.de",

    cashier: "Admin",
    receiptNumber: order.id,
    date: order.date,
    time: order.time,
    registerNumber: "1",

    items: order.items.map((item: any) => ({
      quantity: item.quantity,
      description: item.name,
      unitPrice: item.price,
      totalPrice: item.price * item.quantity,
      vatRate: 19,
      vatAmount: item.price * item.quantity * taxRate,
      netAmount: (item.price * item.quantity) / (1 + taxRate),
    })),

    subtotal: subtotal,
    total: total,

    tax: [
      {
        rate: 19,
        netAmount: subtotal / (1 + taxRate),
        taxAmount: taxAmount,
        grossAmount: subtotal,
      },
    ],

    paymentMethod: order.paymentMethod || "Kreditkarte",
    paidAmount: total,

    rksv: "AT0" + Math.floor(Math.random() * 10000000),
    kassenId: "KASSE-" + Math.floor(Math.random() * 1000),
  }

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <Button variant="outline" onClick={() => router.push("/dashboard/orders")}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Zurück
        </Button>
        <div className="flex space-x-2">
          <Button variant="outline" onClick={handlePrint} className="print:hidden">
            <Printer className="mr-2 h-4 w-4" />
            Drucken
          </Button>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="print:hidden">
                <Download className="mr-2 h-4 w-4" />
                Export
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Export Optionen</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => handleExport("pdf")}>Als PDF exportieren</DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleExport("csv")}>Als CSV exportieren</DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleExport("excel")}>Als Excel exportieren</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          <Button variant="outline" onClick={() => setIsEmailDialogOpen(true)} className="print:hidden">
            <Mail className="mr-2 h-4 w-4" />
            E-Mail
          </Button>

          <Button variant="outline" onClick={handleShare} className="print:hidden">
            <Share2 className="mr-2 h-4 w-4" />
            Teilen
          </Button>
        </div>
      </div>

      <div className="max-w-2xl mx-auto">
        <Card className="print:shadow-none">
          <CardContent className="p-6">
            <ReceiptTemplate receipt={receiptData} />
          </CardContent>
        </Card>
      </div>

      {/* E-Mail Dialog */}
      <Dialog open={isEmailDialogOpen} onOpenChange={setIsEmailDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Beleg per E-Mail senden</DialogTitle>
            <DialogDescription>
              Geben Sie die E-Mail-Adresse ein, an die der Beleg gesendet werden soll.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="email" className="text-right">
                E-Mail
              </Label>
              <Input
                id="email"
                type="email"
                value={emailAddress}
                onChange={(e) => setEmailAddress(e.target.value)}
                placeholder="kunde@example.com"
                className="col-span-3"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEmailDialogOpen(false)}>
              Abbrechen
            </Button>
            <Button onClick={handleSendEmail} disabled={!emailAddress}>
              Senden
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
