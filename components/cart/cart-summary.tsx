"use client"

import { useState, useEffect } from "react"
import { AlertCircle, Loader2, Percent, Tag, Clock, CreditCard } from "lucide-react"
import { useCart } from "@/contexts/cart-context"
import { Button } from "@/components/ui/button"
import { PaymentMethodSelector } from "@/components/cart/payment-method-selector"
import { SpecialInstructions } from "@/components/cart/special-instructions"
import { TipSelector } from "@/components/cart/tip-selector"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { TableIdSelector } from "./table-id-selector"
import { Input } from "@/components/ui/input"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"

export function CartSummary() {
  const {
    totalPrice,
    selectedTotalPrice,
    clearCart,
    closeCart,
    paymentMethod,
    tableId,
    splitMethod,
    guestSplits,
    itemCount,
    setPaymentMethod,
    tipAmount,
    getTotalWithTip,
  } = useCart()

  const [isProcessing, setIsProcessing] = useState(false)
  const [showDetails, setShowDetails] = useState(false)
  const [promoCode, setPromoCode] = useState("")
  const [promoApplied, setPromoApplied] = useState(false)
  const [isApplyingPromo, setIsApplyingPromo] = useState(false)
  const [estimatedTime, setEstimatedTime] = useState<number | null>(null)
  const [expandedSection, setExpandedSection] = useState<string | null>(null)

  // Calculate estimated delivery time based on current time
  useEffect(() => {
    const now = new Date()
    const minutes = Math.floor(Math.random() * 15) + 15 // Random between 15-30 minutes
    setEstimatedTime(minutes)
  }, [])

  // Determine which total to use based on the split method
  let subtotal = totalPrice
  if (tableId) {
    if (splitMethod === "items") {
      subtotal = selectedTotalPrice
    } else if (splitMethod === "percentage" || splitMethod === "equal") {
      // For percentage-based splitting, we use the full total
      subtotal = totalPrice
    }
  }

  // Calculate discount (example)
  const discount = promoApplied ? subtotal * 0.1 : 0 // 10% discount

  // Service fee
  const serviceFee = tableId ? 1.5 : 0

  // Calculate total with tip
  const total = subtotal - discount + serviceFee + tipAmount

  // Check if percentage split is valid (sums to 100%)
  const isSplitValid =
    splitMethod !== "percentage" || Math.abs(guestSplits.reduce((sum, split) => sum + split.percentage, 0) - 100) < 0.1

  const handleApplyPromo = () => {
    if (!promoCode) return

    setIsApplyingPromo(true)

    // Simulate API call to validate promo code
    setTimeout(() => {
      setPromoApplied(true)
      setIsApplyingPromo(false)
    }, 800)
  }

  const handleRemovePromo = () => {
    setPromoApplied(false)
    setPromoCode("")
  }

  const handleCheckout = async () => {
    if (!paymentMethod) {
      setShowDetails(true)
      return
    }

    // Check if split is valid for percentage-based splitting
    if (splitMethod === "percentage" && !isSplitValid) {
      alert("Bitte verteilen Sie 100% des Betrags, bevor Sie fortfahren.")
      return
    }

    setIsProcessing(true)

    // Simulate API call for checkout process
    try {
      await new Promise((resolve) => setTimeout(resolve, 1500))
      clearCart()
      closeCart()
      // In a real app, you would redirect to a success page or show a success message
      alert("Bestellung erfolgreich aufgegeben!")
    } catch (error) {
      console.error("Checkout failed:", error)
      alert("Ein Fehler ist aufgetreten. Bitte versuchen Sie es erneut.")
    } finally {
      setIsProcessing(false)
    }
  }

  return (
    <div className="border-t bg-muted/30">
      {/* Order summary */}
      <div className="p-4">
        <h3 className="font-medium mb-3">Zusammenfassung</h3>

        {/* Estimated delivery time for table orders */}
        {tableId && estimatedTime && (
          <div className="bg-blue-50 rounded-lg p-3 mb-4 flex items-center text-blue-800">
            <Clock className="h-4 w-4 mr-2 flex-shrink-0" />
            <div className="text-sm">
              <p className="font-medium">Geschätzte Zubereitungszeit: {estimatedTime} Minuten</p>
              <p className="text-xs text-blue-700 mt-0.5">Ihre Bestellung wird direkt an Tisch {tableId} gebracht</p>
            </div>
          </div>
        )}

        {/* Promo code input */}
        {!promoApplied ? (
          <div className="flex gap-2 mb-4">
            <Input
              placeholder="Gutscheincode eingeben"
              value={promoCode}
              onChange={(e) => setPromoCode(e.target.value)}
              className="h-9"
            />
            <Button
              variant="outline"
              size="sm"
              className="whitespace-nowrap h-9"
              onClick={handleApplyPromo}
              disabled={!promoCode || isApplyingPromo}
            >
              {isApplyingPromo ? (
                <Loader2 className="h-3.5 w-3.5 animate-spin" />
              ) : (
                <>
                  <Tag className="h-3.5 w-3.5 mr-1" />
                  Einlösen
                </>
              )}
            </Button>
          </div>
        ) : (
          <div className="bg-primary/10 rounded-lg p-2 mb-4 flex items-center justify-between">
            <div className="flex items-center">
              <Percent className="h-4 w-4 mr-2 text-primary" />
              <span className="text-sm font-medium">10% Rabatt angewendet</span>
            </div>
            <Button variant="ghost" size="sm" className="h-7 text-xs" onClick={handleRemovePromo}>
              Entfernen
            </Button>
          </div>
        )}

        {/* Tip selector */}
        <div className="mb-4">
          <TipSelector />
        </div>

        <div className="space-y-1.5 mb-4">
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Bestellsumme</span>
            <span>{subtotal.toFixed(2)} €</span>
          </div>

          {promoApplied && (
            <div className="flex items-center justify-between text-sm text-primary">
              <span>Rabatt (10%)</span>
              <span>-{discount.toFixed(2)} €</span>
            </div>
          )}

          {tableId && serviceFee > 0 && (
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Servicegebühr</span>
              <span>{serviceFee.toFixed(2)} €</span>
            </div>
          )}

          {tipAmount > 0 && (
            <div className="flex items-center justify-between text-sm text-primary">
              <span>Trinkgeld</span>
              <span>+{tipAmount.toFixed(2)} €</span>
            </div>
          )}

          <div className="flex items-center justify-between font-medium pt-2 border-t mt-2">
            <span>Gesamtbetrag</span>
            <span className="text-lg">{total.toFixed(2)} €</span>
          </div>
        </div>

        {/* Payment methods quick select */}
        {!showDetails && (
          <div className="mb-4">
            <p className="text-sm text-muted-foreground mb-2">Schnelle Zahlungsauswahl:</p>
            <div className="flex gap-2 flex-wrap">
              {["card", "paypal", "applepay"].map((method) => (
                <Button
                  key={method}
                  variant={paymentMethod === method ? "default" : "outline"}
                  size="sm"
                  className="h-9 flex-1"
                  onClick={() => setPaymentMethod(method as any)}
                >
                  <CreditCard className="h-3.5 w-3.5 mr-1.5" />
                  {method === "card"
                    ? "Karte"
                    : method === "paypal"
                      ? "PayPal"
                      : method === "applepay"
                        ? "Apple Pay"
                        : method}
                </Button>
              ))}
            </div>
          </div>
        )}

        {/* Accordion for order details */}
        <Accordion type="single" collapsible className="mb-4">
          <AccordionItem value="details" className="border-b-0">
            <AccordionTrigger className="py-2 text-sm">
              Bestelldetails {expandedSection === "details" ? "ausblenden" : "anzeigen"}
            </AccordionTrigger>
            <AccordionContent>
              <div className="space-y-4 py-2">
                <TableIdSelector />
                <PaymentMethodSelector />
                <SpecialInstructions />
              </div>
            </AccordionContent>
          </AccordionItem>
        </Accordion>

        {/* Payment method warning */}
        {!paymentMethod && showDetails && (
          <Alert variant="destructive" className="mt-4">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>Bitte wählen Sie eine Zahlungsmethode aus.</AlertDescription>
          </Alert>
        )}

        {/* Split warning */}
        {splitMethod === "percentage" && !isSplitValid && (
          <Alert variant="destructive" className="mt-4">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>Bitte verteilen Sie 100% des Betrags auf alle Gäste.</AlertDescription>
          </Alert>
        )}
      </div>
    </div>
  )
}
