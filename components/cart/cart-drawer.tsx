"use client"

import { useEffect, useState, useCallback } from "react"
import { useRouter } from "next/navigation"
import {
  ArrowLeft,
  ArrowRight,
  CreditCard,
  ChefHat,
  ShieldAlert,
  ShoppingBag,
  ShoppingCart,
  Trash2,
  Undo2,
  X,
  CheckIcon as CreditCardCheck,
  Clock,
  Receipt,
  CheckCircle,
} from "lucide-react"
import { useCart } from "@/contexts/cart-context"
import { Button } from "@/components/ui/button"
import { CartItem } from "@/components/cart/cart-item"
import { CartSummary } from "@/components/cart/cart-summary"
import { GroupOrderSection } from "@/components/cart/group-order-section"
import { cn } from "@/lib/utils"
import { Badge } from "@/components/ui/badge"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { toast } from "@/hooks/use-toast"
import { AnimatePresence, motion } from "framer-motion"
import { TableVerificationDialog } from "@/components/verification/table-verification-dialog"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { format } from "date-fns"
import { de } from "date-fns/locale"
import { PaymentMethodSelector } from "@/components/cart/payment-method-selector"
import { Separator } from "@/components/ui/separator"
import { ReceiptDisplay } from "@/components/receipt/receipt-display"

export function CartDrawer() {
  const router = useRouter()
  const {
    items,
    isOpen,
    closeCart,
    clearCart,
    clearKitchenItems,
    clearPaidItems,
    itemCount,
    kitchenItemCount,
    paidItemCount,
    tableId,
    tableVerified,
    setTableVerified,
    totalPrice,
    removeItem,
    paymentMethod,
    setPaymentMethod,
    sendItemsToKitchen,
    markItemsAsPaid,
    tipAmount,
    completePayment,
  } = useCart()

  const [removedItem, setRemovedItem] = useState<{
    id: string
    name: string
    guestId?: string
  } | null>(null)

  const [isCheckingOut, setIsCheckingOut] = useState(false)
  const [isSendingToKitchen, setIsSendingToKitchen] = useState(false)
  const [isProcessingPayment, setIsProcessingPayment] = useState(false)
  const [showVerificationDialog, setShowVerificationDialog] = useState(false)
  const [activeTab, setActiveTab] = useState<string>("cart")
  const [isClosing, setIsClosing] = useState(false)
  const [showQuickPay, setShowQuickPay] = useState(false)
  const [paymentComplete, setPaymentComplete] = useState(false)
  const [orderNumber, setOrderNumber] = useState("")
  const [paymentTimestamp, setPaymentTimestamp] = useState<number>(0)
  const [showReceiptOptions, setShowReceiptOptions] = useState(false)

  // Get items for each tab
  const cartItems = items.filter((item) => item.status === "cart")
  const kitchenItems = items.filter((item) => item.status === "kitchen")
  const paidItems = items.filter((item) => item.status === "paid")

  // Berechne Gesamtbetrag für Küchenartikel
  const kitchenTotal = kitchenItems.reduce((sum, item) => sum + item.price * item.quantity, 0)

  // Close cart when pressing Escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") handleClose()
    }

    if (isOpen) {
      document.addEventListener("keydown", handleEscape)
      // Prevent scrolling when cart is open
      document.body.style.overflow = "hidden"
    }

    return () => {
      document.removeEventListener("keydown", handleEscape)
      document.body.style.overflow = ""
    }
  }, [isOpen])

  // Handle smooth closing animation
  const handleClose = useCallback(() => {
    setIsClosing(true)
    setTimeout(() => {
      closeCart()
      setIsClosing(false)
      setShowQuickPay(false)
      setPaymentComplete(false)
    }, 300)
  }, [closeCart])

  // Handle item removal with undo functionality
  const handleRemoveItem = useCallback(
    (id: string, name: string, guestId?: string, status = "cart") => {
      setRemovedItem({ id, name, guestId })
      removeItem(id, guestId, status)

      toast({
        title: "Artikel entfernt",
        description: (
          <div className="flex items-center gap-2">
            <span>{name} wurde aus dem Warenkorb entfernt</span>
            <Button variant="outline" size="sm" className="h-8 px-2 ml-2" onClick={() => handleUndoRemove()}>
              <Undo2 className="h-3.5 w-3.5 mr-1" />
              Rückgängig
            </Button>
          </div>
        ),
        duration: 5000,
      })
    },
    [removeItem],
  )

  // Handle undo of removed item
  const handleUndoRemove = useCallback(() => {
    if (!removedItem) return

    // In a real implementation, you would re-add the item with its original properties
    // For this example, we'll just show a toast
    toast({
      title: "Rückgängig gemacht",
      description: `${removedItem.name} wurde wieder zum Warenkorb hinzugefügt.`,
    })

    setRemovedItem(null)
  }, [removedItem])

  // Handle checkout button click
  const handleCheckout = useCallback(() => {
    // If table is selected but not verified, show verification dialog
    if (tableId && !tableVerified) {
      setShowVerificationDialog(true)
      return
    }

    setIsCheckingOut(true)

    // Simulate a short loading state before redirecting
    setTimeout(() => {
      closeCart()
      router.push("/checkout?source=cart")
    }, 500)
  }, [tableId, tableVerified, closeCart, router])

  // Handle continue shopping
  const handleContinueShopping = useCallback(() => {
    handleClose()
    // Optionally navigate to a specific category or menu page
    // router.push("/menu-example")
  }, [handleClose])

  // Handle send to kitchen
  const handleSendToKitchen = useCallback(() => {
    // Only allow sending to kitchen if table is verified
    if (!tableId || !tableVerified) {
      setShowVerificationDialog(true)
      return
    }

    if (cartItems.length === 0) {
      toast({
        title: "Warenkorb leer",
        description: "Es befinden sich keine Artikel im Warenkorb, die an die Küche gesendet werden können.",
        variant: "destructive",
      })
      return
    }

    setIsSendingToKitchen(true)

    // Simulate API call to send order to kitchen
    setTimeout(() => {
      sendItemsToKitchen()

      toast({
        title: "Bestellung gesendet",
        description: `Ihre Bestellung wurde an die Küche gesendet und wird an Tisch ${tableId} serviert.`,
        duration: 5000,
      })

      setIsSendingToKitchen(false)
      setActiveTab("kitchen")
    }, 1500)
  }, [tableId, tableVerified, cartItems.length, sendItemsToKitchen])

  // Mit dieser neuen Funktion:
  const handleGoToPayment = useCallback(() => {
    if (kitchenItems.length === 0) {
      toast({
        title: "Keine Bestellungen",
        description: "Es gibt keine unbezahlten Bestellungen in der Küche.",
        variant: "destructive",
      })
      return
    }

    // Zeige die Schnellbezahlung an, anstatt zur Checkout-Seite zu navigieren
    setShowQuickPay(true)
    setPaymentComplete(false)
  }, [kitchenItems.length])

  // Generiere eine Bestellnummer
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

  // Schnellbezahlung durchführen
  const handleQuickPayment = useCallback(() => {
    if (!paymentMethod) {
      toast({
        title: "Zahlungsmethode fehlt",
        description: "Bitte wählen Sie eine Zahlungsmethode aus.",
        variant: "destructive",
      })
      return
    }

    setIsProcessingPayment(true)

    // Generiere Bestellnummer
    const newOrderNumber = generateOrderNumber()
    setOrderNumber(newOrderNumber)

    // Simuliere Zahlungsvorgang
    setTimeout(() => {
      const timestamp = Date.now()
      setPaymentTimestamp(timestamp)

      // Bezahlvorgang abschließen
      completePayment({
        method: paymentMethod,
        amount: kitchenTotal + tipAmount,
        timestamp: timestamp,
        tableId,
        orderNumber: newOrderNumber,
      })

      // Artikel als bezahlt markieren
      markItemsAsPaid()

      setIsProcessingPayment(false)
      setPaymentComplete(true)

      toast({
        title: "Zahlung erfolgreich",
        description: `Vielen Dank für Ihre Zahlung über ${(kitchenTotal + tipAmount).toFixed(2)} €.`,
        duration: 5000,
      })
    }, 1500)
  }, [paymentMethod, kitchenTotal, tipAmount, tableId, completePayment, markItemsAsPaid, generateOrderNumber])

  // Format timestamp to readable date
  const formatTimestamp = (timestamp?: number) => {
    if (!timestamp) return ""
    return format(new Date(timestamp), "dd.MM.yyyy, HH:mm 'Uhr'", { locale: de })
  }

  return (
    <>
      {/* Backdrop */}
      <div
        className={cn(
          "fixed inset-0 bg-black/50 z-40 transition-opacity duration-300 backdrop-blur-sm",
          isOpen ? "opacity-100" : "opacity-0 pointer-events-none",
          isClosing && "opacity-0",
        )}
        onClick={handleClose}
        aria-hidden="true"
      />

      {/* Cart drawer - now fully scrollable */}
      <div
        className={cn(
          "fixed top-0 right-0 h-full w-full sm:w-96 max-w-full bg-background z-50",
          "flex flex-col shadow-xl transition-transform duration-300 ease-in-out overflow-hidden",
          isOpen ? "translate-x-0" : "translate-x-full",
          isClosing && "translate-x-full",
        )}
        aria-modal="true"
        role="dialog"
        aria-label="Warenkorb"
      >
        {/* Scrollable container for the entire cart */}
        <div className="flex flex-col h-full overflow-y-auto">
          {/* Header - Sticky */}
          <div className="sticky top-0 z-20 bg-background flex items-center justify-between p-4 border-b">
            <div className="flex items-center">
              <ShoppingBag className="h-5 w-5 mr-2 text-primary" />
              <h2 className="text-lg font-semibold">
                {activeTab === "cart" && "Warenkorb"}
                {activeTab === "kitchen" && "In der Küche"}
                {activeTab === "paid" && "Bezahlt"}

                {activeTab === "cart" && itemCount > 0 && (
                  <Badge variant="secondary" className="ml-2 font-normal">
                    {itemCount}
                  </Badge>
                )}
                {activeTab === "kitchen" && kitchenItemCount > 0 && (
                  <Badge variant="secondary" className="ml-2 font-normal">
                    {kitchenItemCount}
                  </Badge>
                )}
                {activeTab === "paid" && paidItemCount > 0 && (
                  <Badge variant="secondary" className="ml-2 font-normal">
                    {paidItemCount}
                  </Badge>
                )}
              </h2>
              {tableId && (
                <Badge
                  variant="outline"
                  className={cn(
                    "ml-2",
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
            <div className="flex gap-2">
              {activeTab === "cart" && cartItems.length > 0 && (
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button variant="outline" size="sm" onClick={clearCart} className="text-xs h-8">
                        <Trash2 className="h-3.5 w-3.5 mr-1" />
                        Leeren
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Alle Artikel entfernen</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              )}
              {activeTab === "kitchen" && kitchenItems.length > 0 && (
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button variant="outline" size="sm" onClick={clearKitchenItems} className="text-xs h-8">
                        <Trash2 className="h-3.5 w-3.5 mr-1" />
                        Leeren
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Alle Küchenbestellungen entfernen</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              )}
              {activeTab === "paid" && paidItems.length > 0 && (
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button variant="outline" size="sm" onClick={clearPaidItems} className="text-xs h-8">
                        <Trash2 className="h-3.5 w-3.5 mr-1" />
                        Leeren
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Bezahlte Artikel entfernen</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              )}
              <Button
                variant="ghost"
                size="icon"
                onClick={handleClose}
                className="h-8 w-8"
                aria-label="Warenkorb schließen"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Tabs - Sticky */}
          <div className="sticky top-[73px] z-10 bg-background">
            <Tabs defaultValue="cart" value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="grid grid-cols-3 px-4 pt-2 w-full">
                <TabsTrigger value="cart" className="text-xs">
                  Warenkorb
                  {itemCount > 0 && (
                    <Badge variant="secondary" className="ml-1">
                      {itemCount}
                    </Badge>
                  )}
                </TabsTrigger>
                <TabsTrigger value="kitchen" className="text-xs">
                  In der Küche
                  {kitchenItemCount > 0 && (
                    <Badge variant="secondary" className="ml-1">
                      {kitchenItemCount}
                    </Badge>
                  )}
                </TabsTrigger>
                <TabsTrigger value="paid" className="text-xs">
                  Bezahlt
                  {paidItemCount > 0 && (
                    <Badge variant="secondary" className="ml-1">
                      {paidItemCount}
                    </Badge>
                  )}
                </TabsTrigger>
              </TabsList>
            </Tabs>
          </div>

          {/* Tab Content - Scrollable */}
          <div className="flex-1">
            {/* Cart Tab */}
            {activeTab === "cart" && (
              <div className="p-4">
                {cartItems.length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-12 text-center">
                    <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mb-4">
                      <ShoppingBag className="h-8 w-8 text-muted-foreground" />
                    </div>
                    <h3 className="text-lg font-medium mb-1">Ihr Warenkorb ist leer</h3>
                    <p className="text-muted-foreground mb-4">Fügen Sie Artikel hinzu, um eine Bestellung aufzugeben</p>
                    <Button onClick={handleClose}>Menü durchstöbern</Button>
                  </div>
                ) : tableId ? (
                  <>
                    {/* Add table info text with verification status */}
                    <div
                      className={cn(
                        "rounded-lg p-3 mb-4 text-sm",
                        tableVerified
                          ? "bg-green-50 border border-green-200 text-green-800"
                          : "bg-amber-50 border border-amber-200 text-amber-800",
                      )}
                    >
                      {tableVerified ? (
                        <>
                          Du bestellst direkt vom verifizierten Tisch {tableId} – die Bestellung wird an die Küche
                          übermittelt.
                        </>
                      ) : (
                        <>
                          <div className="font-medium mb-1">Tisch nicht verifiziert</div>
                          <p>Bitte verifizieren Sie Tisch {tableId}, um fortzufahren.</p>
                          <Button
                            variant="outline"
                            size="sm"
                            className="mt-2 h-8 border-amber-300 bg-amber-100/50 hover:bg-amber-100 text-amber-900"
                            onClick={() => setShowVerificationDialog(true)}
                          >
                            Jetzt verifizieren
                          </Button>
                        </>
                      )}
                    </div>
                    <GroupOrderSection />
                  </>
                ) : (
                  <AnimatePresence initial={false}>
                    <div className="space-y-3">
                      {cartItems.map((item) => (
                        <motion.div
                          key={item.id + (item.guestId || "")}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, height: 0, marginTop: 0 }}
                          transition={{ duration: 0.2 }}
                        >
                          <CartItem item={item} onRemove={() => handleRemoveItem(item.id, item.name, item.guestId)} />
                        </motion.div>
                      ))}
                    </div>
                  </AnimatePresence>
                )}

                {/* Summary and checkout */}
                {cartItems.length > 0 && (
                  <>
                    <CartSummary />

                    {/* Action buttons container */}
                    <div className="pt-4 space-y-3">
                      {/* Three action buttons */}
                      <div className="grid grid-cols-3 gap-2">
                        {/* Send to Kitchen Button - Only visible when table is selected */}
                        <Button
                          variant={tableId && tableVerified ? "default" : "outline"}
                          size="sm"
                          onClick={handleSendToKitchen}
                          disabled={isSendingToKitchen || !tableId || cartItems.length === 0}
                          className={cn(
                            "h-14 flex flex-col items-center justify-center py-1 px-1",
                            tableId && tableVerified ? "bg-green-600 hover:bg-green-700" : "",
                          )}
                        >
                          <ChefHat className="h-5 w-5 mb-1" />
                          <span className="text-xs font-medium">Zur Küche</span>
                        </Button>

                        {/* Continue Shopping Button */}
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={handleContinueShopping}
                          className="h-14 flex flex-col items-center justify-center py-1 px-1"
                        >
                          <ArrowLeft className="h-5 w-5 mb-1" />
                          <span className="text-xs font-medium">Weiterbestellen</span>
                        </Button>

                        {/* Checkout Button */}
                        <Button
                          variant="default"
                          size="sm"
                          onClick={handleCheckout}
                          disabled={isCheckingOut || cartItems.length === 0}
                          className="h-14 flex flex-col items-center justify-center py-1 px-1"
                        >
                          <ArrowRight className="h-5 w-5 mb-1" />
                          <span className="text-xs font-medium">Zur Kasse</span>
                        </Button>
                      </div>

                      {/* Order total and payment method */}
                      <div className="flex items-center justify-between text-sm text-muted-foreground">
                        <div className="flex items-center">
                          <ShoppingCart className="h-4 w-4 mr-1.5" />
                          <span>
                            {itemCount} {itemCount === 1 ? "Artikel" : "Artikel"}
                          </span>
                        </div>
                        <div className="font-medium text-foreground">
                          Gesamt:{" "}
                          {(totalPrice + tipAmount - totalPrice * 0.1 * (paymentMethod === "promo" ? 1 : 0)).toFixed(2)}{" "}
                          €{tipAmount > 0 && <span className="text-xs text-primary ml-1">(inkl. Trinkgeld)</span>}
                        </div>
                      </div>

                      {paymentMethod && (
                        <div className="flex items-center justify-center text-xs text-muted-foreground">
                          <CreditCard className="h-3 w-3 mr-1" />
                          <span>Zahlung mit {paymentMethod === "card" ? "Karte" : paymentMethod}</span>
                        </div>
                      )}
                    </div>
                  </>
                )}
              </div>
            )}

            {/* Kitchen Tab (In der Küche) */}
            {activeTab === "kitchen" && !showQuickPay && !paymentComplete && (
              <div className="p-4">
                {kitchenItems.length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-12 text-center">
                    <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mb-4">
                      <ChefHat className="h-8 w-8 text-muted-foreground" />
                    </div>
                    <h3 className="text-lg font-medium mb-1">Keine Bestellungen in der Küche</h3>
                    <p className="text-muted-foreground mb-4">
                      Bestellungen, die an die Küche gesendet wurden, erscheinen hier
                    </p>
                    <Button variant="outline" onClick={() => setActiveTab("cart")}>
                      Zurück zum Warenkorb
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div className="bg-amber-50 border border-amber-200 rounded-lg p-3 text-amber-800 text-sm">
                      <p className="font-medium">Unbezahlte Bestellungen in der Küche</p>
                      <p className="mt-1">Diese Bestellungen werden zubereitet, sind aber noch nicht bezahlt.</p>
                    </div>

                    {kitchenItems.map((item) => (
                      <div key={`${item.id}-${item.guestId || "self"}`} className="border rounded-lg p-3 bg-card">
                        <div className="flex justify-between items-start">
                          <div>
                            <h4 className="font-medium">{item.name}</h4>
                            <p className="text-sm text-muted-foreground">
                              {item.quantity} × {item.price.toFixed(2)} €
                            </p>
                            {item.notes && <p className="text-xs mt-1 text-muted-foreground italic">"{item.notes}"</p>}
                            {item.timestamp && (
                              <p className="text-xs mt-1 text-muted-foreground">
                                Bestellt: {formatTimestamp(item.timestamp)}
                              </p>
                            )}
                          </div>
                          <div className="text-right">
                            <p className="font-medium">{(item.price * item.quantity).toFixed(2)} €</p>
                            {item.guestId && (
                              <Badge variant="outline" className="mt-1">
                                {item.guestName || `Gast ${item.guestId}`}
                              </Badge>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}

                    {/* Kitchen actions */}
                    <div className="pt-4">
                      <Button className="w-full bg-blue-600 hover:bg-blue-700" size="lg" onClick={handleGoToPayment}>
                        <CreditCard className="mr-2 h-4 w-4" />
                        Jetzt bezahlen
                      </Button>

                      <div className="flex items-center justify-between mt-3 text-sm text-muted-foreground">
                        <span>Unbezahlte Bestellungen:</span>
                        <span className="font-medium">
                          {kitchenItems.reduce((sum, item) => sum + item.price * item.quantity, 0).toFixed(2)} €
                        </span>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Quick Pay Interface */}
            {activeTab === "kitchen" && showQuickPay && !paymentComplete && (
              <div className="p-4">
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 mb-4 text-blue-800 text-sm">
                  <div className="flex items-start">
                    <Clock className="h-5 w-5 mr-2 mt-0.5 flex-shrink-0" />
                    <div>
                      <h4 className="font-medium">Schnellbezahlung</h4>
                      <p className="mt-1">
                        Bezahlen Sie Ihre Küchenbestellungen schnell und einfach, ohne die Seite zu verlassen.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="border rounded-lg p-3 mb-4">
                  <h3 className="font-medium mb-2">Bestellübersicht</h3>
                  <div className="space-y-2">
                    {kitchenItems.map((item) => (
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
                      <span>{kitchenTotal.toFixed(2)} €</span>
                    </div>

                    {tipAmount > 0 && (
                      <div className="flex justify-between text-sm text-primary">
                        <span>Trinkgeld</span>
                        <span>+{tipAmount.toFixed(2)} €</span>
                      </div>
                    )}

                    <div className="flex justify-between font-medium pt-2">
                      <span>Gesamtbetrag</span>
                      <span className="text-lg">{(kitchenTotal + tipAmount).toFixed(2)} €</span>
                    </div>
                  </div>
                </div>

                <div className="border rounded-lg p-3 mb-4">
                  <h3 className="font-medium mb-2">Zahlungsmethode</h3>
                  <PaymentMethodSelector />
                </div>

                <div className="space-y-3">
                  <Button
                    className="w-full"
                    size="lg"
                    onClick={handleQuickPayment}
                    disabled={isProcessingPayment || !paymentMethod}
                  >
                    {isProcessingPayment ? (
                      <>
                        <div className="animate-spin mr-2 h-4 w-4 border-2 border-current border-t-transparent rounded-full" />
                        Zahlung wird verarbeitet...
                      </>
                    ) : (
                      <>
                        <CreditCard className="mr-2 h-4 w-4" />
                        {(kitchenTotal + tipAmount).toFixed(2)} € bezahlen
                      </>
                    )}
                  </Button>

                  <Button variant="outline" className="w-full" onClick={() => setShowQuickPay(false)}>
                    Zurück zu den Bestellungen
                  </Button>

                  <Button
                    variant="link"
                    className="w-full text-sm text-muted-foreground"
                    onClick={() => {
                      setShowQuickPay(false)
                      closeCart()
                      router.push("/checkout?source=kitchen")
                    }}
                  >
                    <Receipt className="mr-2 h-4 w-4" />
                    Zur vollständigen Checkout-Seite
                  </Button>
                </div>
              </div>
            )}

            {/* Payment Complete Interface */}
            {activeTab === "kitchen" && paymentComplete && (
              <div className="p-4">
                <div className="text-center mb-4">
                  <div className="mx-auto mb-4 bg-green-100 p-3 rounded-full w-16 h-16 flex items-center justify-center">
                    <CheckCircle className="h-8 w-8 text-green-600" />
                  </div>
                  <h3 className="text-xl font-medium">Zahlung erfolgreich</h3>
                  <p className="text-muted-foreground mt-1">Ihre Bestellung wurde erfolgreich bezahlt.</p>
                </div>

                {/* Quittungsanzeige */}
                <ReceiptDisplay
                  items={kitchenItems}
                  orderNumber={orderNumber}
                  tableId={tableId}
                  paymentMethod={paymentMethod}
                  subtotal={kitchenTotal}
                  tipAmount={tipAmount}
                  total={kitchenTotal + tipAmount}
                  timestamp={paymentTimestamp}
                />

                <div className="space-y-3 mt-4">
                  <Button
                    className="w-full"
                    onClick={() => {
                      setActiveTab("paid")
                      setPaymentComplete(false)
                    }}
                  >
                    <CreditCardCheck className="mr-2 h-4 w-4" />
                    Bezahlte Artikel anzeigen
                  </Button>

                  <Button
                    variant="outline"
                    className="w-full"
                    onClick={() => {
                      setActiveTab("cart")
                      setPaymentComplete(false)
                    }}
                  >
                    <ShoppingBag className="mr-2 h-4 w-4" />
                    Zurück zum Warenkorb
                  </Button>
                </div>
              </div>
            )}

            {/* Paid Tab (Bezahlt) */}
            {activeTab === "paid" && (
              <div className="p-4">
                {paidItems.length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-12 text-center">
                    <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mb-4">
                      <CreditCardCheck className="h-8 w-8 text-muted-foreground" />
                    </div>
                    <h3 className="text-lg font-medium mb-1">Keine bezahlten Bestellungen</h3>
                    <p className="text-muted-foreground mb-4">Bestellungen, die bezahlt wurden, erscheinen hier</p>
                    <Button variant="outline" onClick={() => setActiveTab("cart")}>
                      Zurück zum Warenkorb
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div className="bg-green-50 border border-green-200 rounded-lg p-3 text-green-800 text-sm">
                      <p className="font-medium">Bezahlte Bestellungen</p>
                      <p className="mt-1">Diese Bestellungen wurden bereits bezahlt.</p>
                    </div>

                    {paidItems.map((item) => (
                      <div key={`${item.id}-${item.guestId || "self"}`} className="border rounded-lg p-3 bg-card">
                        <div className="flex justify-between items-start">
                          <div>
                            <h4 className="font-medium">{item.name}</h4>
                            <p className="text-sm text-muted-foreground">
                              {item.quantity} × {item.price.toFixed(2)} €
                            </p>
                            {item.notes && <p className="text-xs mt-1 text-muted-foreground italic">"{item.notes}"</p>}
                            {item.timestamp && (
                              <p className="text-xs mt-1 text-muted-foreground">
                                Bezahlt: {formatTimestamp(item.timestamp)}
                              </p>
                            )}
                          </div>
                          <div className="text-right">
                            <p className="font-medium">{(item.price * item.quantity).toFixed(2)} €</p>
                            {item.guestId && (
                              <Badge variant="outline" className="mt-1">
                                {item.guestName || `Gast ${item.guestId}`}
                              </Badge>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}

                    {/* Paid summary */}
                    <div className="pt-4">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-muted-foreground">Bezahlte Bestellungen:</span>
                        <span className="font-medium">
                          {paidItems.reduce((sum, item) => sum + item.price * item.quantity, 0).toFixed(2)} €
                        </span>
                      </div>

                      <Button variant="outline" className="w-full mt-3" onClick={() => setActiveTab("cart")}>
                        <ShoppingBag className="mr-2 h-4 w-4" />
                        Zurück zum Warenkorb
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Verification Dialog */}
      <TableVerificationDialog
        tableId={tableId}
        isOpen={showVerificationDialog}
        onClose={() => setShowVerificationDialog(false)}
        onVerify={(verified) => {
          setTableVerified(verified)
          if (verified) {
            toast({
              title: "Tisch erfolgreich verifiziert",
              description: `Sie können jetzt an Tisch ${tableId} bestellen.`,
              duration: 3000,
            })
          }
        }}
      />
    </>
  )
}
