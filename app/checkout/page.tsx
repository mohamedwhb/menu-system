"use client"

import { useEffect, useState, useCallback } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { useCart } from "@/contexts/cart-context"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { toast } from "@/hooks/use-toast"
import { ArrowLeft, CheckCircle, CreditCard, Mail, Receipt, Loader2, ShoppingBag, Clock } from "lucide-react"
import { PaymentMethodSelector } from "@/components/cart/payment-method-selector"
import { TipSelector } from "@/components/cart/tip-selector"
import { ReceiptDisplay } from "@/components/receipt/receipt-display"
import { format } from "date-fns"
import { de } from "date-fns/locale"
import Image from "next/image"

export default function CheckoutPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const source = searchParams.get("source") || "cart"

  const {
    items,
    tableId,
    tableVerified,
    tipAmount,
    paymentMethod,
    markItemsAsPaid,
    sendItemsToKitchen,
    tipOption,
    totalPrice,
    customTipAmount,
  } = useCart()

  const [isProcessingPayment, setIsProcessingPayment] = useState(false)
  const [paymentComplete, setPaymentComplete] = useState(false)
  const [orderNumber, setOrderNumber] = useState("")
  const [paymentTimestamp, setPaymentTimestamp] = useState<number>(0)
  const [customerEmail, setCustomerEmail] = useState("")
  const [isEmailValid, setIsEmailValid] = useState(false)
  const [isSendingEmail, setIsSendingEmail] = useState(false)
  const [emailSent, setEmailSent] = useState(false)
  const [showReceiptDetails, setShowReceiptDetails] = useState(false)

  const [paymentSubtotal, setPaymentSubtotal] = useState(0)
  const [paymentTipAmount, setPaymentTipAmount] = useState(0)
  const [paymentTotal, setPaymentTotal] = useState(0)
  const [paidItems, setPaidItems] = useState<any[]>([])

  // Get items to pay for based on source
  const itemsToPay =
    source === "kitchen"
      ? items.filter((item) => item.status === "kitchen")
      : items.filter((item) => item.status === "cart")

  // Calculate total amount from items directly
  const calculateTotalAmount = useCallback(() => {
    return itemsToPay.reduce((sum, item) => sum + item.price * item.quantity, 0)
  }, [itemsToPay])

  const [totalAmount, setTotalAmount] = useState(0)
  const [finalAmount, setFinalAmount] = useState(0)

  // Update totals when items or tipAmount changes
  useEffect(() => {
    const calculatedTotal = calculateTotalAmount()
    setTotalAmount(calculatedTotal)

    // Calculate tip amount based on the checkout total, not cart total
    let currentTipAmount = 0
    if (tipOption === "custom") {
      currentTipAmount = customTipAmount
    } else if (typeof tipOption === "number" && tipOption > 0) {
      currentTipAmount = (calculatedTotal * tipOption) / 100
    }

    setFinalAmount(calculatedTotal + currentTipAmount)

    console.log("Checkout totals updated:", {
      calculatedTotal,
      tipOption,
      currentTipAmount,
      finalAmount: calculatedTotal + currentTipAmount,
      itemCount: itemsToPay.length,
    })
  }, [itemsToPay, tipOption, customTipAmount, calculateTotalAmount])

  // Generate order number
  const generateOrderNumber = useCallback(() => {
    const randomNum = Math.floor(Math.random() * 10000)
      .toString()
      .padStart(4, "0")
    const date = new Date()
    const year = date.getFullYear().toString().slice(2)
    const month = (date.getMonth() + 1).toString().padStart(2, "0")
    const day = date.getDate().toString().padStart(2, "0")
    return `${year}${month}${day}-${randomNum}`
  }, [])

  // Initialize order number
  useEffect(() => {
    if (!orderNumber) {
      setOrderNumber(generateOrderNumber())
    }
  }, [generateOrderNumber, orderNumber])

  // Validate email
  useEffect(() => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    setIsEmailValid(emailRegex.test(customerEmail))
  }, [customerEmail])

  // Handle payment processing
  const handlePayment = useCallback(async () => {
    if (!paymentMethod) {
      toast({
        title: "Zahlungsmethode erforderlich",
        description: "Bitte wählen Sie eine Zahlungsmethode aus.",
        variant: "destructive",
      })
      return
    }

    if (itemsToPay.length === 0) {
      toast({
        title: "Keine Artikel zu bezahlen",
        description: "Es gibt keine Artikel, die bezahlt werden können.",
        variant: "destructive",
      })
      return
    }

    // Store payment amounts before processing
    const currentSubtotal = totalAmount
    const currentTipAmount =
      tipOption === "custom"
        ? customTipAmount
        : typeof tipOption === "number" && tipOption > 0
          ? (totalAmount * tipOption) / 100
          : 0
    const currentTotal = currentSubtotal + currentTipAmount

    setPaymentSubtotal(currentSubtotal)
    setPaymentTipAmount(currentTipAmount)
    setPaymentTotal(currentTotal)
    setPaidItems([...itemsToPay])

    setIsProcessingPayment(true)

    try {
      // Simulate payment processing
      await new Promise((resolve) => setTimeout(resolve, 2000))

      // Generate order details
      const timestamp = Date.now()
      setPaymentTimestamp(timestamp)

      // If items are from cart, send them to kitchen first
      if (source === "cart") {
        sendItemsToKitchen()
      }

      // Mark items as paid
      markItemsAsPaid(itemsToPay)

      setPaymentComplete(true)
      setShowReceiptDetails(true)

      toast({
        title: "Zahlung erfolgreich",
        description: `Ihre Bestellung ${orderNumber} wurde erfolgreich bezahlt.`,
        duration: 5000,
      })
    } catch (error) {
      toast({
        title: "Zahlung fehlgeschlagen",
        description: "Es gab ein Problem bei der Verarbeitung Ihrer Zahlung. Bitte versuchen Sie es erneut.",
        variant: "destructive",
      })
    } finally {
      setIsProcessingPayment(false)
    }
  }, [
    paymentMethod,
    itemsToPay,
    orderNumber,
    sendItemsToKitchen,
    markItemsAsPaid,
    source,
    totalAmount,
    tipOption,
    customTipAmount,
  ])

  // Handle email sending
  const handleSendEmail = useCallback(async () => {
    if (!isEmailValid) {
      toast({
        title: "Ungültige E-Mail-Adresse",
        description: "Bitte geben Sie eine gültige E-Mail-Adresse ein.",
        variant: "destructive",
      })
      return
    }

    setIsSendingEmail(true)

    try {
      // Simulate email sending
      await new Promise((resolve) => setTimeout(resolve, 1500))

      setEmailSent(true)
      toast({
        title: "E-Mail gesendet",
        description: `Die Quittung wurde an ${customerEmail} gesendet.`,
        duration: 5000,
      })
    } catch (error) {
      toast({
        title: "E-Mail-Versand fehlgeschlagen",
        description: "Die E-Mail konnte nicht gesendet werden. Bitte versuchen Sie es erneut.",
        variant: "destructive",
      })
    } finally {
      setIsSendingEmail(false)
    }
  }, [isEmailValid, customerEmail])

  // Handle continue shopping
  const handleContinueShopping = useCallback(() => {
    router.push(`/menu-example${tableId ? `?table=${tableId}` : ""}`)
  }, [router, tableId])

  // Handle back to menu
  const handleBackToMenu = useCallback(() => {
    router.push(`/menu-example${tableId ? `?table=${tableId}` : ""}`)
  }, [router, tableId])

  // Format timestamp
  const formatTimestamp = (timestamp: number) => {
    return format(new Date(timestamp), "dd.MM.yyyy, HH:mm 'Uhr'", { locale: de })
  }

  // Redirect if no items to pay
  useEffect(() => {
    if (itemsToPay.length === 0 && !paymentComplete) {
      const timer = setTimeout(() => {
        toast({
          title: "Keine Artikel zum Bezahlen",
          description: "Sie werden zum Menü weitergeleitet.",
          duration: 3000,
        })
        router.push(`/menu-example${tableId ? `?table=${tableId}` : ""}`)
      }, 2000)

      return () => clearTimeout(timer)
    }
  }, [itemsToPay.length, paymentComplete, router, tableId])

  if (itemsToPay.length === 0 && !paymentComplete) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardContent className="flex flex-col items-center justify-center py-16 text-center">
            <div className="w-16 h-16 rounded-full bg-amber-100 flex items-center justify-center mb-4">
              <ShoppingBag className="h-8 w-8 text-amber-600" />
            </div>
            <h3 className="text-lg font-semibold mb-2">Keine Artikel zum Bezahlen</h3>
            <p className="text-muted-foreground mb-4">Sie werden zum Menü weitergeleitet...</p>
            <Loader2 className="h-6 w-6 animate-spin text-primary" />
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-4">
      <div className="max-w-2xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Button variant="ghost" size="icon" onClick={() => router.back()} className="rounded-full">
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <div>
              <h1 className="text-2xl font-bold">{paymentComplete ? "Zahlung abgeschlossen" : "Kasse"}</h1>
              {tableId && <p className="text-muted-foreground">Tisch {tableId}</p>}
            </div>
          </div>
          {paymentComplete && (
            <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
              <CheckCircle className="h-4 w-4 mr-1" />
              Bezahlt
            </Badge>
          )}
        </div>

        {!paymentComplete ? (
          <>
            {/* Order Summary */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Receipt className="h-5 w-5 mr-2" />
                  Bestellübersicht
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Items */}
                <div className="space-y-3">
                  {itemsToPay.map((item) => (
                    <div key={`${item.id}-${item.guestId || "self"}`} className="flex items-center space-x-3">
                      {item.imageUrl && (
                        <div className="relative h-12 w-12 rounded-lg overflow-hidden flex-shrink-0">
                          <Image
                            src={item.imageUrl || "/placeholder.svg"}
                            alt={item.name}
                            fill
                            className="object-cover"
                            sizes="48px"
                          />
                        </div>
                      )}
                      <div className="flex-1 min-w-0">
                        <h4 className="font-medium truncate">{item.name}</h4>
                        <p className="text-sm text-muted-foreground">
                          {item.quantity} × {item.price.toFixed(2)} €
                        </p>
                        {item.notes && <p className="text-xs text-muted-foreground italic">"{item.notes}"</p>}
                      </div>
                      <div className="font-medium">{(item.price * item.quantity).toFixed(2)} €</div>
                    </div>
                  ))}
                </div>

                <Separator />

                {/* Totals */}
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Zwischensumme</span>
                    <span>{totalAmount.toFixed(2)} €</span>
                  </div>
                  {tipAmount > 0 && (
                    <div className="flex justify-between text-sm text-primary">
                      <span>Trinkgeld</span>
                      <span>+{tipAmount.toFixed(2)} €</span>
                    </div>
                  )}
                  <Separator />
                  <div className="flex justify-between font-medium text-lg">
                    <span>Gesamtbetrag</span>
                    <span>{finalAmount.toFixed(2)} €</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Payment Options */}
            <Card>
              <CardHeader>
                <CardTitle>Zahlungsoptionen</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Tip Selector */}
                <TipSelector checkoutTotal={totalAmount} />

                {/* Payment Method */}
                <PaymentMethodSelector />

                {/* Pay Button */}
                <Button
                  onClick={handlePayment}
                  disabled={isProcessingPayment || !paymentMethod}
                  className="w-full h-12 bg-gradient-to-r from-primary to-primary/90 hover:from-primary/90 hover:to-primary shadow-lg"
                  size="lg"
                >
                  {isProcessingPayment ? (
                    <>
                      <Loader2 className="h-5 w-5 mr-2 animate-spin" />
                      Zahlung wird verarbeitet...
                    </>
                  ) : (
                    <>
                      <CreditCard className="h-5 w-5 mr-2" />
                      {finalAmount.toFixed(2)} € bezahlen
                    </>
                  )}
                </Button>
              </CardContent>
            </Card>
          </>
        ) : (
          <>
            {/* Payment Success */}
            <Card className="border-green-200 bg-green-50/50">
              <CardContent className="pt-6">
                <div className="text-center space-y-4">
                  <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center mx-auto">
                    <CheckCircle className="h-8 w-8 text-green-600" />
                  </div>
                  <div>
                    <h2 className="text-xl font-semibold text-green-800">Zahlung erfolgreich!</h2>
                    <p className="text-green-700">Bestellung #{orderNumber} wurde bezahlt</p>
                    <p className="text-sm text-green-600 mt-1">
                      <Clock className="h-4 w-4 inline mr-1" />
                      {formatTimestamp(paymentTimestamp)}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Receipt */}
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center">
                    <Receipt className="h-5 w-5 mr-2" />
                    Quittung
                  </CardTitle>
                  <Button variant="ghost" size="sm" onClick={() => setShowReceiptDetails(!showReceiptDetails)}>
                    {showReceiptDetails ? "Ausblenden" : "Details anzeigen"}
                  </Button>
                </div>
              </CardHeader>
              {showReceiptDetails && (
                <CardContent>
                  <ReceiptDisplay
                    orderNumber={orderNumber}
                    items={paidItems}
                    tableId={tableId || ""}
                    timestamp={paymentTimestamp}
                    tipAmount={paymentTipAmount}
                    paymentMethod={paymentMethod || ""}
                    subtotal={paymentSubtotal}
                    total={paymentTotal}
                  />
                </CardContent>
              )}
            </Card>

            {/* Email Receipt */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Mail className="h-5 w-5 mr-2" />
                  Quittung per E-Mail
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email">E-Mail-Adresse</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="ihre.email@beispiel.de"
                    value={customerEmail}
                    onChange={(e) => setCustomerEmail(e.target.value)}
                    disabled={emailSent}
                  />
                </div>

                {emailSent ? (
                  <div className="flex items-center text-green-600 text-sm">
                    <CheckCircle className="h-4 w-4 mr-2" />
                    E-Mail erfolgreich gesendet
                  </div>
                ) : (
                  <Button
                    onClick={handleSendEmail}
                    disabled={!isEmailValid || isSendingEmail}
                    variant="outline"
                    className="w-full"
                  >
                    {isSendingEmail ? (
                      <>
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                        Wird gesendet...
                      </>
                    ) : (
                      <>
                        <Mail className="h-4 w-4 mr-2" />
                        Quittung per E-Mail senden
                      </>
                    )}
                  </Button>
                )}
              </CardContent>
            </Card>

            {/* Action Buttons */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Button variant="outline" onClick={handleContinueShopping} className="h-12">
                <ShoppingBag className="h-5 w-5 mr-2" />
                Weiter bestellen
              </Button>
              <Button onClick={handleBackToMenu} className="h-12">
                <ArrowLeft className="h-5 w-5 mr-2" />
                Zurück zum Menü
              </Button>
            </div>
          </>
        )}
      </div>
    </div>
  )
}
