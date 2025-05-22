"use client"

import { useEffect, useState } from "react"
import { jsPDF } from "jspdf"
import { Button } from "@/components/ui/button"
import { FileDown, Download, Eye } from "lucide-react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { format } from "date-fns"
import { de } from "date-fns/locale"
import { toDataURL } from "qrcode"
import { toast } from "@/hooks/use-toast"

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

interface ReceiptPdfGeneratorProps {
  items: ReceiptItem[]
  orderNumber: string
  tableId?: string
  paymentMethod: string
  subtotal: number
  tipAmount: number
  total: number
  timestamp: number
  showIconsOnly?: boolean
}

export function ReceiptPdfGenerator({
  items,
  orderNumber,
  tableId,
  paymentMethod,
  subtotal,
  tipAmount,
  total,
  timestamp,
  showIconsOnly = false,
}: ReceiptPdfGeneratorProps) {
  const [isGenerating, setIsGenerating] = useState(false)
  const [pdfUrl, setPdfUrl] = useState<string | null>(null)
  const [showPreview, setShowPreview] = useState(false)
  const [qrCodeDataUrl, setQrCodeDataUrl] = useState<string | null>(null)

  // QR-Code generieren
  useEffect(() => {
    const generateQrCode = async () => {
      try {
        // QR-Code Daten generieren
        const qrCodeData = `RKSV:AT0:${orderNumber}:${format(new Date(timestamp), "yyyyMMdd")}:${total.toFixed(2)}`

        // QR-Code als Daten-URL generieren
        const dataUrl = await toDataURL(qrCodeData, {
          width: 128,
          margin: 1,
          color: {
            dark: "#000",
            light: "#fff",
          },
        })

        setQrCodeDataUrl(dataUrl)
      } catch (error) {
        console.error("Fehler beim Generieren des QR-Codes:", error)
      }
    }

    generateQrCode()
  }, [orderNumber, timestamp, total])

  // Formatierungsfunktionen
  const formatCurrency = (amount: number) => {
    return amount.toFixed(2).replace(".", ",") + " €"
  }

  const formatDate = (date: Date) => {
    return format(date, "dd.MM.yyyy", { locale: de })
  }

  const formatTime = (date: Date) => {
    return format(date, "HH:mm 'Uhr'", { locale: de })
  }

  // PDF generieren
  const generatePdf = async () => {
    setIsGenerating(true)

    try {
      // Firmendaten
      const companyData = {
        companyName: "Restaurant Name",
        companyAddress: "Musterstraße 123, 12345 Musterstadt",
        uid: "ATU12345678",
        phone: "+49 123 456789",
        email: "info@restaurant.com",
        cashier: "Servicekraft",
        registerNumber: "REG-001",
        kassenId: "KASSE-001",
        rksv: "RKSV-AT0-" + orderNumber,
      }

      // Steuerberechnung
      const taxRate = 0.19 // 19% MwSt
      const netAmount = subtotal / (1 + taxRate)
      const taxAmount = subtotal - netAmount
      const taxBreakdown = [
        {
          rate: 19,
          netAmount: netAmount,
          taxAmount: taxAmount,
          grossAmount: subtotal,
        },
      ]

      // PDF erstellen
      const doc = new jsPDF({
        orientation: "portrait",
        unit: "mm",
        format: [80, 200], // Typische Breite für Kassenbelege
      })

      // Schriftart und Größe
      doc.setFont("helvetica")
      doc.setFontSize(8)

      // Konstanten für Layout
      const pageWidth = doc.internal.pageSize.getWidth()
      const margin = 5
      const contentWidth = pageWidth - margin * 2
      let y = margin

      // Restaurant-Informationen
      doc.setFontSize(10)
      doc.setFont("helvetica", "bold")
      doc.text(companyData.companyName, pageWidth / 2, y, { align: "center" })
      y += 4

      doc.setFontSize(8)
      doc.setFont("helvetica", "normal")
      doc.text(companyData.companyAddress, pageWidth / 2, y, { align: "center" })
      y += 3
      doc.text("UID: " + companyData.uid, pageWidth / 2, y, { align: "center" })
      y += 3
      doc.text("Tel: " + companyData.phone, pageWidth / 2, y, { align: "center" })
      y += 3
      doc.text(companyData.email, pageWidth / 2, y, { align: "center" })
      y += 5

      // Trennlinie
      doc.setDrawColor(200, 200, 200)
      doc.line(margin, y, pageWidth - margin, y)
      y += 5

      // Bestellinformationen
      doc.setFont("helvetica", "bold")
      doc.text("Beleg Nr.:", margin, y)
      doc.setFont("helvetica", "normal")
      doc.text(orderNumber, margin + 20, y)
      y += 4

      doc.setFont("helvetica", "bold")
      doc.text("Datum:", margin, y)
      doc.setFont("helvetica", "normal")
      doc.text(formatDate(new Date(timestamp)), margin + 20, y)
      y += 4

      doc.setFont("helvetica", "bold")
      doc.text("Zeit:", margin, y)
      doc.setFont("helvetica", "normal")
      doc.text(formatTime(new Date(timestamp)), margin + 20, y)
      y += 4

      doc.setFont("helvetica", "bold")
      doc.text("Kassier:", margin, y)
      doc.setFont("helvetica", "normal")
      doc.text(companyData.cashier, margin + 20, y)
      y += 4

      if (tableId) {
        doc.setFont("helvetica", "bold")
        doc.text("Tisch:", margin, y)
        doc.setFont("helvetica", "normal")
        doc.text(tableId, margin + 20, y)
        y += 4
      }

      doc.setFont("helvetica", "bold")
      doc.text("Kassen-ID:", margin, y)
      doc.setFont("helvetica", "normal")
      doc.text(companyData.registerNumber, margin + 20, y)
      y += 5

      // Trennlinie
      doc.setDrawColor(200, 200, 200)
      doc.line(margin, y, pageWidth - margin, y)
      y += 5

      // Artikelüberschrift
      doc.setFont("helvetica", "bold")
      doc.text("Artikel", margin, y)
      y += 4

      // Artikel
      doc.setFont("helvetica", "normal")
      items.forEach((item) => {
        // Prüfen, ob wir eine neue Seite benötigen
        if (y > doc.internal.pageSize.getHeight() - 40) {
          doc.addPage([80, 200])
          y = margin
        }

        doc.text(`${item.quantity}x ${item.name}`, margin, y)
        y += 3
        doc.text(`${formatCurrency(item.price)} / Stk.`, margin + 2, y)
        doc.text(formatCurrency(item.price * item.quantity), pageWidth - margin, y, { align: "right" })
        y += 3

        // Notizen, falls vorhanden
        if (item.notes) {
          doc.setFontSize(7)
          doc.text(`Notiz: ${item.notes}`, margin + 2, y)
          doc.setFontSize(8)
          y += 3
        }
      })

      y += 2

      // Trennlinie
      doc.setDrawColor(200, 200, 200)
      doc.line(margin, y, pageWidth - margin, y)
      y += 5

      // Summen
      doc.text("Zwischensumme:", margin, y)
      doc.text(formatCurrency(subtotal), pageWidth - margin, y, { align: "right" })
      y += 4

      if (tipAmount > 0) {
        doc.text("Trinkgeld:", margin, y)
        doc.text(formatCurrency(tipAmount), pageWidth - margin, y, { align: "right" })
        y += 4
      }

      // Steueraufschlüsselung
      doc.setFontSize(7)
      doc.text(`Netto ${taxBreakdown[0].rate}%:`, margin, y)
      doc.text(formatCurrency(netAmount), pageWidth - margin, y, { align: "right" })
      y += 3
      doc.text(`MwSt. ${taxBreakdown[0].rate}%:`, margin, y)
      doc.text(formatCurrency(taxAmount), pageWidth - margin, y, { align: "right" })
      y += 3
      doc.setFontSize(8)

      // Gesamtsumme (inkl. Trinkgeld)
      doc.setFont("helvetica", "bold")
      doc.text("Gesamtbetrag:", margin, y)
      doc.text(formatCurrency(total), pageWidth - margin, y, { align: "right" })
      y += 5

      // Trennlinie
      doc.setDrawColor(200, 200, 200)
      doc.line(margin, y, pageWidth - margin, y)
      y += 5

      // Zahlungsinformationen
      doc.setFont("helvetica", "normal")
      doc.text("Zahlungsart:", margin, y)
      const paymentMethodText =
        paymentMethod === "card"
          ? "Karte"
          : paymentMethod === "cash"
            ? "Bargeld"
            : paymentMethod === "paypal"
              ? "PayPal"
              : paymentMethod === "applepay"
                ? "Apple Pay"
                : paymentMethod === "googlepay"
                  ? "Google Pay"
                  : paymentMethod === "banktransfer"
                    ? "Überweisung"
                    : paymentMethod
      doc.text(paymentMethodText, pageWidth - margin, y, { align: "right" })
      y += 4
      doc.text("Bezahlt:", margin, y)
      doc.text(formatCurrency(total), pageWidth - margin, y, { align: "right" })
      y += 5

      // RKSV Info
      doc.setFontSize(7)
      doc.text("RKSV: " + companyData.rksv, margin, y)
      y += 3
      doc.text("Kassen-ID: " + companyData.kassenId, margin, y)
      y += 5

      // QR-Code
      if (qrCodeDataUrl) {
        const qrCodeWidth = 30
        const qrCodeX = (pageWidth - qrCodeWidth) / 2
        doc.addImage(qrCodeDataUrl, "PNG", qrCodeX, y, qrCodeWidth, qrCodeWidth)
        y += qrCodeWidth + 5
      }

      // Fußzeile
      doc.setFontSize(7)
      doc.text("Vielen Dank für Ihren Besuch!", pageWidth / 2, y, { align: "center" })
      y += 3
      doc.text("Wir freuen uns auf Ihren nächsten Besuch.", pageWidth / 2, y, { align: "center" })

      // PDF als Blob speichern und URL erstellen
      const pdfBlob = doc.output("blob")
      const url = URL.createObjectURL(pdfBlob)
      setPdfUrl(url)

      return url
    } catch (error) {
      console.error("Fehler beim Generieren der PDF:", error)
      return null
    } finally {
      setIsGenerating(false)
    }
  }

  // PDF herunterladen
  const downloadPdf = async () => {
    let url = pdfUrl

    if (!url) {
      url = await generatePdf()
    }

    if (url) {
      const link = document.createElement("a")
      link.href = url
      link.download = `Quittung-${orderNumber}.pdf`
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)

      toast({
        title: "PDF heruntergeladen",
        description: `Die Quittung für Bestellung ${orderNumber} wurde heruntergeladen.`,
      })
    }
  }

  // PDF anzeigen
  const previewPdf = async () => {
    let url = pdfUrl

    if (!url) {
      url = await generatePdf()
    }

    if (url) {
      setShowPreview(true)
    }
  }

  // PDF-URL freigeben, wenn die Komponente unmounted wird
  useEffect(() => {
    return () => {
      if (pdfUrl) {
        URL.revokeObjectURL(pdfUrl)
      }
    }
  }, [pdfUrl])

  const handleDownload = async () => {
    await downloadPdf()
  }

  const handlePrint = () => {
    window.print()
  }

  return (
    <div className="space-y-3">
      <Dialog open={showPreview} onOpenChange={setShowPreview}>
        <DialogContent className="max-w-3xl h-[80vh]">
          <DialogHeader>
            <DialogTitle>Quittung Vorschau</DialogTitle>
          </DialogHeader>
          {pdfUrl && (
            <div className="h-full overflow-auto">
              <iframe src={pdfUrl} className="w-full h-full border rounded-md" title="PDF Vorschau" />
            </div>
          )}
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => setShowPreview(false)}>
              Schließen
            </Button>
            <Button onClick={downloadPdf}>
              <FileDown className="mr-2 h-4 w-4" />
              Herunterladen
            </Button>
          </div>
        </DialogContent>
      </Dialog>
      <div className="flex justify-end space-x-2 mt-4">
        <Button onClick={previewPdf} size="sm" variant="outline" className="flex items-center">
          <Eye className="h-4 w-4 mr-2" />
          {!showIconsOnly && "Quittung anzeigen"}
          {showIconsOnly && "Anzeigen"}
        </Button>
        <Button onClick={downloadPdf} size="sm" variant="outline" className="flex items-center">
          <Download className="h-4 w-4 mr-2" />
          {!showIconsOnly && "PDF herunterladen"}
          {showIconsOnly && "PDF"}
        </Button>
      </div>
    </div>
  )
}
