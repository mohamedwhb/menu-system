"use client"

import { useEffect, useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import {
  ArrowLeft,
  CheckCircle,
  CreditCard,
  Loader2,
  ShieldAlert,
  ShoppingBag,
  Clock,
  AlertCircle,
  ChevronDown,
  ChevronUp,
} from "lucide-react"
import { useCart } from "@/contexts/cart-context"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Badge } from "@/components/ui/badge"
import { toast } from "@/hooks/use-toast"
import { cn } from "@/lib/utils"
import { PaymentMethodSelector } from "@/components/cart/payment-method-selector"
import { TipSelector } from "@/components/cart/tip-selector"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { format } from "date-fns"
import { de } from "date-fns/locale"
import { ReceiptDisplay } from "@/components/receipt/receipt-display"

export default function CheckoutPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const source = searchParams.get("source") || "cart"

  const {
    items,
    tableId,
    tableVerified,
    paymentMethod,
    setPaymentMethod,
    tipAmount,
    tipOption,
    setTipOption,
    isProcessingPayment,
    paymentError,
    paymentSuccess,
    initiatePayment,
    completePayment,
    getItemsForPayment,
    markItemsAsPaid,
    sendItemsToKitchen,
  } = useCart()

  const [isSubmitting, setIsSubmitting] = useState(false)
  const [paymentComplete, setPaymentComplete] = useState(false)
  const [orderNumber, setOrderNumber] = useState("")
  const [showOrderSummary, setShowOrderSummary] = useState(true)
  const [estimatedTime, setEstimatedTime] = useState<number | null>(null)
  const [paymentTimestamp, setPaymentTimestamp] = useState<number>(0)

  // Artikel, die bezahlt werden sollen (aus der Küche oder dem Warenkorb)
  const itemsToPay =
    source === "kitchen"
      ? items.filter((item) => item.status === "kitchen")
      : items.filter((item) => item.status === "cart")

  // Gesamtbetrag berechnen
  const subtotal = itemsToPay.reduce((sum, item) => sum + item.price * item.quantity, 0)
  const total = subtotal + tipAmount

  // Prüfen, ob Artikel zum Bezahlen vorhanden sind
  useEffect(() => {
    if (itemsToPay.length === 0) {
      // Verzögerung hinzufügen, um sicherzustellen, dass der Cart-Kontext geladen ist
      const timer = setTimeout(() => {
        // Erneut prüfen, ob Artikel vorhanden sind
        const updatedItemsToPay =
          source === "kitchen"
            ? items.filter((item) => item.status === "kitchen")
            : items.filter((item) => item.status === "cart")

        if (updatedItemsToPay.length === 0) {
          toast({
            title: "Keine Artikel zum Bezahlen",
            description: "Es gibt keine Artikel, die bezahlt werden können.",
            variant: "destructive",
          })
          router.push("/menu-example")
        }
      }, 500)

      return () => clearTimeout(timer)
    }
  }, [items, source, router])

  // Generiere eine zufällige Bestellnummer
  useEffect(() => {
    const generateOrderNumber = () => {
      const randomNum = Math.floor(Math.random() * 10000)
        .toString()
        .padStart(4, "0")
      const date = new Date()
      const year = date.getFullYear().toString().slice(2)
      const month = (date.getMonth() + 1).toString().padStart(2, "0")
      const day = date.getDate().toString().padStart(2, "0")
      return `${year}${month}${day}-${randomNum}`
    }

    setOrderNumber(generateOrderNumber())
  }, [])

  // Bezahlvorgang abschließen
  const handlePayment = async () => {
    if (!paymentMethod) {
      toast({
        title: "Zahlungsmethode fehlt",
        description: "Bitte wählen Sie eine Zahlungsmethode aus.",
        variant: "destructive",
      })
      return
    }

    setIsSubmitting(true)

    try {
      // Bezahlvorgang initiieren
      const success = await initiatePayment(itemsToPay)

      if (success) {
        // Wenn die Artikel aus dem Warenkorb kommen und noch nicht in der Küche sind,
        // senden wir sie zuerst an die Küche
        if (source === "cart") {
          sendItemsToKitchen()
        }

        const timestamp = Date.now()
        setPaymentTimestamp(timestamp)

        // Bezahlvorgang abschließen
        completePayment({
          method: paymentMethod,
          amount: total,
          timestamp: timestamp,
          tableId,
          orderNumber,
        })

        // Artikel als bezahlt markieren
        markItemsAsPaid(itemsToPay)

        setPaymentComplete(true)

        // Geschätzte Zubereitungszeit berechnen (5-15 Minuten pro Artikel, max. 30 Minuten)
        const itemCount = itemsToPay.reduce((sum, item) => sum + item.quantity, 0)
        const baseTime = Math.min(itemCount * 5, 30)
        const randomAddition = Math.floor(Math.random() * 10) // 0-10 Minuten zusätzlich
        setEstimatedTime(baseTime + randomAddition)

        toast({
          title: "Zahlung erfolgreich",
          description: `Vielen Dank für Ihre Zahlung über ${total.toFixed(2)} €.`,
        })

        // Nach 30 Sekunden zurück zum Menü (längere Zeit für bessere UX)
        setTimeout(() => {
          router.push("/menu-example")
        }, 30000)
      }
    } catch (error) {
      toast({
        title: "Fehler bei der Zahlung",
        description: "Es ist ein Fehler aufgetreten. Bitte versuchen Sie es erneut.",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  // Formatiere Datum
  const formatDate = (date: Date) => {
    return format(date, "dd. MMMM yyyy, HH:mm 'Uhr'", { locale: de })
  }

  // Wenn keine Artikel vorhanden sind, zeigen wir eine Meldung an
  if (itemsToPay.length === 0) {
    return (
      <div className="container max-w-3xl mx-auto py-8 px-4">
        <Button variant="ghost" className="mb-6" onClick={() => router.back()}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Zurück
        </Button>

        <Card>
          <CardHeader>
            <CardTitle>Keine Artikel zum Bezahlen</CardTitle>
            <CardDescription>Es gibt keine Artikel, die bezahlt werden können.</CardDescription>
          </CardHeader>
          <CardFooter>
            <Button onClick={() => router.push("/menu-example")} className="w-full">
              Zum Menü
            </Button>
          </CardFooter>
        </Card>
      </div>
    )
  }

  return (
    <div className="container max-w-3xl mx-auto py-8 px-4">
      <Button variant="ghost" className="mb-6" onClick={() => router.back()}>
        <ArrowLeft className="mr-2 h-4 w-4" />
        Zurück
      </Button>

      {paymentComplete ? (
        // Erfolgreiche Zahlung - Bestätigungsseite
        <Card className="mb-6">
          <CardHeader className="text-center">
            <div className="mx-auto mb-4 bg-green-100 p-3 rounded-full w-16 h-16 flex items-center justify-center">
              <CheckCircle className="h-8 w-8 text-green-600" />
            </div>
            <CardTitle className="text-2xl">Zahlung erfolgreich</CardTitle>
            <CardDescription>Ihre Bestellung wurde erfolgreich aufgegeben und bezahlt.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {estimatedTime && (
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 text-blue-800">
                <div className="flex items-start">
                  <Clock className="h-5 w-5 mr-2 mt-0.5 flex-shrink-0" />
                  <div>
                    <h4 className="font-medium">Geschätzte Zubereitungszeit</h4>
                    <p className="text-sm mt-1">
                      Ihre Bestellung wird in etwa <strong>{estimatedTime} Minuten</strong> fertig sein.
                    </p>
                  </div>
                </div>
              </div>
            )}

            <Accordion type="single" collapsible defaultValue="items">
              <AccordionItem value="items">
                <AccordionTrigger className="text-base font-medium">Bestellübersicht</AccordionTrigger>
                <AccordionContent>
                  <div className="space-y-2 mt-2">
                    {itemsToPay.map((item) => (
                      <div key={`${item.id}-${item.guestId || "self"}`} className="flex justify-between items-center">
                        <div className="flex items-center">
                          <span className="text-sm font-medium">{item.name}</span>
                          <span className="text-sm text-muted-foreground ml-2">
                            {item.quantity > 1 && `× ${item.quantity}`}
                          </span>
                        </div>
                        <span className="font-medium">{(item.price * item.quantity).toFixed(2)} €</span>
                      </div>
                    ))}
                    <Separator className="my-2" />
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Zwischensumme</span>
                      <span>{subtotal.toFixed(2)} €</span>
                    </div>
                    {tipAmount > 0 && (
                      <div className="flex justify-between text-sm text-primary">
                        <span>Trinkgeld</span>
                        <span>+{tipAmount.toFixed(2)} €</span>
                      </div>
                    )}
                    <div className="flex justify-between font-medium pt-1">
                      <span>Gesamtbetrag</span>
                      <span>{total.toFixed(2)} €</span>
                    </div>
                  </div>
                </AccordionContent>
              </AccordionItem>
            </Accordion>

            {/* Quittungsanzeige */}
            <ReceiptDisplay
              items={itemsToPay}
              orderNumber={orderNumber}
              tableId={tableId}
              paymentMethod={paymentMethod}
              subtotal={subtotal}
              tipAmount={tipAmount}
              total={total}
              timestamp={paymentTimestamp}
            />
          </CardContent>
          <CardFooter className="flex flex-col space-y-3">
            <Button className="w-full" onClick={() => router.push("/menu-example")}>
              <ShoppingBag className="mr-2 h-4 w-4" />
              Zurück zum Menü
            </Button>
          </CardFooter>
        </Card>
      ) : (
        // Checkout-Formular
        <div className="grid gap-6">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Bezahlen</CardTitle>
                  <CardDescription>
                    {source === "kitchen"
                      ? "Bezahlen Sie Ihre Bestellung aus der Küche"
                      : "Schließen Sie Ihre Bestellung ab"}
                  </CardDescription>
                </div>

                {tableId && (
                  <Badge
                    variant="outline"
                    className={cn(
                      tableVerified
                        ? "bg-green-50 text-green-700 border-green-200"
                        : "bg-amber-50 text-amber-700 border-amber-200",
                    )}
                  >
                    Tisch {tableId}
                    {!tableVerified && <ShieldAlert className="h-3 w-3 ml-1" />}
                  </Badge>
                )}
              </div>
            </CardHeader>

            <CardContent className="space-y-4">
              {/* Bestellübersicht - Zusammenklappbar für bessere UX */}
              <div className="border rounded-lg overflow-hidden">
                <div
                  className="flex justify-between items-center p-3 cursor-pointer bg-muted/50"
                  onClick={() => setShowOrderSummary(!showOrderSummary)}
                >
                  <h3 className="font-medium">Bestellübersicht</h3>
                  <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                    {showOrderSummary ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                  </Button>
                </div>

                {showOrderSummary && (
                  <div className="p-3 border-t">
                    <div className="space-y-2">
                      {itemsToPay.map((item) => (
                        <div key={`${item.id}-${item.guestId || "self"}`} className="flex justify-between items-center">
                          <div className="flex items-center">
                            <span className="text-sm font-medium">{item.name}</span>
                            <span className="text-sm text-muted-foreground ml-2">
                              {item.quantity > 1 && `× ${item.quantity}`}
                            </span>
                          </div>
                          <span className="font-medium">{(item.price * item.quantity).toFixed(2)} €</span>
                        </div>
                      ))}
                    </div>

                    <Separator className="my-3" />

                    <div className="space-y-1">
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Zwischensumme</span>
                        <span>{subtotal.toFixed(2)} €</span>
                      </div>

                      {tipAmount > 0 && (
                        <div className="flex justify-between text-sm text-primary">
                          <span>Trinkgeld</span>
                          <span>+{tipAmount.toFixed(2)} €</span>
                        </div>
                      )}

                      <div className="flex justify-between font-medium pt-2">
                        <span>Gesamtbetrag</span>
                        <span className="text-lg">{total.toFixed(2)} €</span>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Bestellinformationen */}
              <div className="border rounded-lg p-3">
                <h3 className="font-medium mb-2">Bestellinformationen</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Bestellnummer:</span>
                    <span className="font-medium">{orderNumber}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Datum:</span>
                    <span>{formatDate(new Date())}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Tisch:</span>
                    <span>{tableId || "Nicht angegeben"}</span>
                  </div>
                </div>
              </div>

              {/* Trinkgeld */}
              <div className="border rounded-lg p-3">
                <h3 className="font-medium mb-2">Trinkgeld</h3>
                <TipSelector />
              </div>

              {/* Zahlungsmethode */}
              <div className="border rounded-lg p-3">
                <h3 className="font-medium mb-2">Zahlungsmethode</h3>
                <PaymentMethodSelector />
              </div>

              {/* Hinweise für bestimmte Zahlungsmethoden */}
              {paymentMethod === "cash" && (
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 text-blue-800 text-sm">
                  <div className="flex">
                    <AlertCircle className="h-4 w-4 mr-2 mt-0.5 flex-shrink-0" />
                    <p>
                      Bitte halten Sie den genauen Betrag bereit oder informieren Sie Ihren Kellner, dass Sie bezahlen
                      möchten.
                    </p>
                  </div>
                </div>
              )}
            </CardContent>

            <CardFooter className="flex flex-col">
              <Button
                className="w-full"
                size="lg"
                disabled={isSubmitting || !paymentMethod || itemsToPay.length === 0}
                onClick={handlePayment}
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Zahlung wird verarbeitet...
                  </>
                ) : (
                  <>
                    <CreditCard className="mr-2 h-4 w-4" />
                    {total.toFixed(2)} € bezahlen
                  </>
                )}
              </Button>

              {!paymentComplete && (
                <p className="text-xs text-muted-foreground text-center mt-4">
                  Mit dem Klick auf "Bezahlen" bestätigen Sie Ihre Bestellung und stimmen den Zahlungsbedingungen zu.
                </p>
              )}
            </CardFooter>
          </Card>
        </div>
      )}
    </div>
  )
}
