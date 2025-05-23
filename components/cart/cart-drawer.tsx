"use client"

import { useEffect, useState, useCallback } from "react"
import { useRouter } from "next/navigation"
import Image from "next/image"
import {
  ArrowLeft,
  ChefHat,
  ShieldAlert,
  ShoppingBag,
  Trash2,
  X,
  CheckCircle,
  Loader2,
  MinusCircle,
  PlusCircle,
  Clock,
  Receipt,
  CreditCardIcon,
} from "lucide-react"
import { useCart } from "@/contexts/cart-context"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { Badge } from "@/components/ui/badge"
import { toast } from "@/hooks/use-toast"
import { AnimatePresence, motion } from "framer-motion"
import { TableVerificationDialog } from "@/components/verification/table-verification-dialog"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { format } from "date-fns"
import { de } from "date-fns/locale"
import { Separator } from "@/components/ui/separator"

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
    updateQuantity,
    sendItemsToKitchen,
    markItemsAsPaid,
    tipAmount,
    tipOption,
    setTipOption,
    paymentMethod,
    setPaymentMethod,
    completePayment,
  } = useCart()

  const [isSendingToKitchen, setIsSendingToKitchen] = useState(false)
  const [isProcessingPayment, setIsProcessingPayment] = useState(false)
  const [showVerificationDialog, setShowVerificationDialog] = useState(false)
  const [activeTab, setActiveTab] = useState<string>("cart")
  const [isClosing, setIsClosing] = useState(false)
  const [orderNumber, setOrderNumber] = useState("")
  const [paymentTimestamp, setPaymentTimestamp] = useState<number>(0)
  const [paymentComplete, setPaymentComplete] = useState(false)

  // Get items for each tab
  const cartItems = items.filter((item) => item.status === "cart")
  const kitchenItems = items.filter((item) => item.status === "kitchen")
  const paidItems = items.filter((item) => item.status === "paid")

  // Calculate totals
  const kitchenTotal = kitchenItems.reduce((sum, item) => sum + item.price * item.quantity, 0)
  const paidTotal = paidItems.reduce((sum, item) => sum + item.price * item.quantity, 0)

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
      setPaymentComplete(false)
      setActiveTab("cart") // Reset to cart tab when closing
    }, 300)
  }, [closeCart])

  // Handle continue shopping
  const handleContinueShopping = useCallback(() => {
    handleClose()
  }, [handleClose])

  // Handle send to kitchen
  const handleSendToKitchen = useCallback(() => {
    // Only allow sending to kitchen if table is verified
    if (!tableId) {
      toast({
        title: "Tisch nicht ausgewählt",
        description: "Bitte wählen Sie einen Tisch aus, um fortzufahren.",
        variant: "destructive",
      })
      setShowVerificationDialog(true)
      return
    }

    if (!tableVerified) {
      toast({
        title: "Tisch nicht verifiziert",
        description: "Bitte verifizieren Sie Ihren Tisch, um fortzufahren.",
        variant: "destructive",
      })
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
  }, [tableId, tableVerified, cartItems.length, sendItemsToKitchen, setShowVerificationDialog, toast])

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

  // Handle payment
  const handlePayment = useCallback(() => {
    if (kitchenItems.length === 0) {
      toast({
        title: "Keine Bestellungen",
        description: "Es gibt keine unbezahlten Bestellungen in der Küche.",
        variant: "destructive",
      })
      return
    }

    // Close cart and redirect to checkout page
    handleClose()
    router.push("/checkout?source=kitchen")
  }, [kitchenItems.length, handleClose, router])

  // Format timestamp to readable date
  const formatTimestamp = (timestamp?: number) => {
    if (!timestamp) return ""
    return format(new Date(timestamp), "dd.MM.yyyy, HH:mm 'Uhr'", { locale: de })
  }

  // Handle item quantity change
  const handleQuantityChange = (id: string, quantity: number, guestId?: string) => {
    updateQuantity(id, quantity, guestId)
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

      {/* Cart drawer */}
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
        <div className="flex flex-col h-full">
          {/* Header - Sticky */}
          <div className="sticky top-0 z-20 bg-background flex items-center justify-between p-3 border-b">
            <div className="flex items-center space-x-2 min-w-0">
              <ShoppingBag className="h-5 w-5 flex-shrink-0 text-primary" />
              <h2 className="text-lg font-semibold truncate">
                {activeTab === "cart" && "Warenkorb"}
                {activeTab === "kitchen" && "In der Küche"}
                {activeTab === "paid" && "Bezahlt"}

                {activeTab === "cart" && itemCount > 0 && (
                  <Badge variant="secondary" className="ml-1 font-normal">
                    {itemCount}
                  </Badge>
                )}
                {activeTab === "kitchen" && kitchenItemCount > 0 && (
                  <Badge variant="secondary" className="ml-1 font-normal">
                    {kitchenItemCount}
                  </Badge>
                )}
                {activeTab === "paid" && paidItemCount > 0 && (
                  <Badge variant="secondary" className="ml-1 font-normal">
                    {paidItemCount}
                  </Badge>
                )}
              </h2>
              {tableId && (
                <Badge
                  variant="outline"
                  className={cn(
                    "flex-shrink-0",
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
            <div className="flex gap-1 flex-shrink-0 ml-2">
              {activeTab === "cart" && cartItems.length > 0 && (
                <Button variant="outline" size="sm" onClick={clearCart} className="text-xs h-7 px-2">
                  <Trash2 className="h-3 w-3 mr-1" />
                  Leeren
                </Button>
              )}
              {activeTab === "kitchen" && kitchenItems.length > 0 && (
                <Button variant="outline" size="sm" onClick={clearKitchenItems} className="text-xs h-7 px-2">
                  <Trash2 className="h-3 w-3 mr-1" />
                  Leeren
                </Button>
              )}
              {activeTab === "paid" && paidItems.length > 0 && (
                <Button variant="outline" size="sm" onClick={clearPaidItems} className="text-xs h-7 px-2">
                  <Trash2 className="h-3 w-3 mr-1" />
                  Leeren
                </Button>
              )}
              <Button
                variant="ghost"
                size="icon"
                onClick={handleClose}
                className="h-7 w-7"
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
                  Küche
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
          <div className="flex-1 overflow-y-auto">
            {/* WARENKORB TAB */}
            {activeTab === "cart" && (
              <div className="p-4 pt-8">
                {cartItems.length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-16 text-center px-6">
                    <div className="relative mb-6">
                      <div className="w-20 h-20 rounded-full bg-gradient-to-br from-primary/10 to-primary/5 flex items-center justify-center">
                        <ShoppingBag className="h-10 w-10 text-primary/60" />
                      </div>
                    </div>
                    <h3 className="text-xl font-semibold mb-2 text-foreground">Ihr Warenkorb ist leer</h3>
                    <p className="text-muted-foreground mb-6 max-w-sm">
                      Entdecken Sie unsere köstlichen Gerichte und fügen Sie Ihre Favoriten hinzu
                    </p>
                    <Button
                      onClick={handleClose}
                      className="bg-gradient-to-r from-primary to-primary/90 hover:from-primary/90 hover:to-primary shadow-lg"
                    >
                      <ShoppingBag className="mr-2 h-4 w-4" />
                      Menü entdecken
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-6">
                    {/* Table verification status */}
                    {tableId && (
                      <div
                        className={cn(
                          "rounded-xl p-4 text-sm backdrop-blur-sm border",
                          tableVerified
                            ? "bg-gradient-to-r from-green-50 to-emerald-50 border-green-200/50 text-green-800"
                            : "bg-gradient-to-r from-amber-50 to-orange-50 border-amber-200/50 text-amber-800",
                        )}
                      >
                        {tableVerified ? (
                          <div className="flex items-center">
                            <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center mr-3">
                              <CheckCircle className="h-4 w-4 text-green-600" />
                            </div>
                            <div>
                              <p className="font-medium">Tisch {tableId} verifiziert</p>
                              <p className="text-xs text-green-700 mt-0.5">
                                Ihre Bestellung wird direkt an Tisch {tableId} gebracht
                              </p>
                            </div>
                          </div>
                        ) : (
                          <div>
                            <div className="flex items-center mb-2">
                              <ShieldAlert className="h-4 w-4 mr-2" />
                              <span className="font-medium">Tisch nicht verifiziert</span>
                            </div>
                            <p className="mb-3 text-xs">Bitte verifizieren Sie Tisch {tableId}, um fortzufahren.</p>
                            <Button
                              variant="outline"
                              size="sm"
                              className="h-8 border-amber-300 bg-amber-100/50 hover:bg-amber-100 text-amber-900 shadow-sm"
                              onClick={() => setShowVerificationDialog(true)}
                            >
                              <ShieldAlert className="mr-1.5 h-3.5 w-3.5" />
                              Jetzt verifizieren
                            </Button>
                          </div>
                        )}
                      </div>
                    )}

                    {/* Cart items list */}
                    <div className="space-y-3">
                      <h3 className="font-medium text-sm text-muted-foreground">Ihre ausgewählten Artikel</h3>
                      <AnimatePresence initial={false}>
                        {cartItems.map((item) => (
                          <motion.div
                            key={item.id + (item.guestId || "")}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, height: 0, marginTop: 0 }}
                            transition={{ duration: 0.2 }}
                            className="bg-white rounded-xl border shadow-sm overflow-hidden"
                          >
                            <div className="flex p-3">
                              {/* Item image */}
                              {item.imageUrl && (
                                <div className="relative h-20 w-20 flex-shrink-0 overflow-hidden rounded-lg mr-3">
                                  <Image
                                    src={item.imageUrl || "/placeholder.svg"}
                                    alt={item.name}
                                    fill
                                    className="object-cover"
                                    sizes="80px"
                                  />
                                </div>
                              )}

                              {/* Item details */}
                              <div className="flex-1 min-w-0">
                                <div className="flex justify-between">
                                  <h4 className="font-medium">{item.name}</h4>
                                  <Button
                                    variant="ghost"
                                    size="icon"
                                    className="h-6 w-6 -mr-1 text-muted-foreground hover:text-destructive"
                                    onClick={() => removeItem(item.id, item.guestId)}
                                    aria-label={`${item.name} entfernen`}
                                  >
                                    <X className="h-4 w-4" />
                                  </Button>
                                </div>

                                {item.customizations && (
                                  <p className="text-xs text-muted-foreground mt-0.5">{item.customizations}</p>
                                )}

                                {item.notes && (
                                  <p className="text-xs text-muted-foreground mt-0.5 italic">"{item.notes}"</p>
                                )}

                                {/* Price and quantity controls */}
                                <div className="flex items-center justify-between mt-2">
                                  <div className="flex items-center gap-2 bg-muted/30 rounded-full p-1">
                                    <Button
                                      variant="ghost"
                                      size="icon"
                                      className="h-6 w-6 rounded-full"
                                      onClick={() => handleQuantityChange(item.id, item.quantity - 1, item.guestId)}
                                      disabled={item.quantity <= 1}
                                      aria-label="Menge verringern"
                                    >
                                      <MinusCircle className="h-4 w-4" />
                                    </Button>
                                    <span className="w-6 text-center text-sm font-medium">{item.quantity}</span>
                                    <Button
                                      variant="ghost"
                                      size="icon"
                                      className="h-6 w-6 rounded-full"
                                      onClick={() => handleQuantityChange(item.id, item.quantity + 1, item.guestId)}
                                      aria-label="Menge erhöhen"
                                    >
                                      <PlusCircle className="h-4 w-4" />
                                    </Button>
                                  </div>
                                  <div className="font-medium">{(item.price * item.quantity).toFixed(2)} €</div>
                                </div>
                              </div>
                            </div>
                          </motion.div>
                        ))}
                      </AnimatePresence>
                    </div>

                    {/* Order summary */}
                    <div className="bg-muted/20 rounded-xl p-4 space-y-3">
                      <h3 className="font-medium">Zusammenfassung</h3>
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span className="text-muted-foreground">Zwischensumme</span>
                          <span>{totalPrice.toFixed(2)} €</span>
                        </div>
                        <Separator />
                        <div className="flex justify-between font-medium">
                          <span>Gesamtbetrag</span>
                          <span className="text-lg">{totalPrice.toFixed(2)} €</span>
                        </div>
                      </div>
                    </div>

                    {/* Action button - Send to Kitchen */}
                    <Button
                      variant={tableId && tableVerified ? "default" : "outline"}
                      onClick={handleSendToKitchen}
                      disabled={isSendingToKitchen || cartItems.length === 0}
                      className={cn(
                        "w-full h-12 transition-all duration-200",
                        tableId && tableVerified
                          ? "bg-gradient-to-b from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 shadow-lg hover:shadow-xl"
                          : "border-2 hover:border-primary/30 hover:bg-primary/5",
                      )}
                    >
                      {isSendingToKitchen ? (
                        <Loader2 className="h-5 w-5 mr-2 animate-spin" />
                      ) : (
                        <ChefHat className="h-5 w-5 mr-2" />
                      )}
                      Zur Küche senden
                    </Button>
                  </div>
                )}
              </div>
            )}

            {/* KÜCHE TAB */}
            {activeTab === "kitchen" && (
              <div className="p-4 pt-8">
                {kitchenItems.length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-16 text-center px-6">
                    <div className="relative mb-6">
                      <div className="w-20 h-20 rounded-full bg-gradient-to-br from-amber-100 to-amber-50 flex items-center justify-center">
                        <ChefHat className="h-10 w-10 text-amber-600/60" />
                      </div>
                    </div>
                    <h3 className="text-xl font-semibold mb-2 text-foreground">Keine Bestellungen in der Küche</h3>
                    <p className="text-muted-foreground mb-6 max-w-sm">
                      Bestellungen, die an die Küche gesendet wurden, erscheinen hier
                    </p>
                    <Button
                      variant="outline"
                      onClick={() => setActiveTab("cart")}
                      className="border-2 hover:border-primary/30"
                    >
                      <ShoppingBag className="mr-2 h-4 w-4" />
                      Zurück zum Warenkorb
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-6">
                    {/* Kitchen items list */}
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <h3 className="font-medium text-sm text-muted-foreground">Bestellungen in der Küche</h3>
                        <Badge variant="outline" className="bg-amber-50 text-amber-700 border-amber-200">
                          Wird zubereitet
                        </Badge>
                      </div>

                      {kitchenItems.map((item) => (
                        <div
                          key={`${item.id}-${item.guestId || "self"}`}
                          className="bg-white rounded-xl border shadow-sm overflow-hidden"
                        >
                          <div className="flex p-3">
                            {/* Item image */}
                            {item.imageUrl && (
                              <div className="relative h-16 w-16 flex-shrink-0 overflow-hidden rounded-lg mr-3">
                                <Image
                                  src={item.imageUrl || "/placeholder.svg"}
                                  alt={item.name}
                                  fill
                                  className="object-cover"
                                  sizes="64px"
                                />
                              </div>
                            )}

                            {/* Item details */}
                            <div className="flex-1 min-w-0">
                              <div className="flex justify-between">
                                <h4 className="font-medium">{item.name}</h4>
                                <div className="font-medium">{(item.price * item.quantity).toFixed(2)} €</div>
                              </div>

                              <div className="flex justify-between items-end mt-1">
                                <div>
                                  <p className="text-sm text-muted-foreground">
                                    {item.quantity} × {item.price.toFixed(2)} €
                                  </p>
                                  {item.notes && (
                                    <p className="text-xs text-muted-foreground mt-0.5 italic">"{item.notes}"</p>
                                  )}
                                </div>
                                {item.timestamp && (
                                  <p className="text-xs text-muted-foreground">
                                    <Clock className="h-3 w-3 inline mr-1" />
                                    {formatTimestamp(item.timestamp)}
                                  </p>
                                )}
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Payment section */}
                    <div className="bg-muted/10 rounded-xl p-4 border">
                      {/* Order summary */}
                      <div className="space-y-2">
                        <div className="flex justify-between font-medium">
                          <span>Gesamtbetrag</span>
                          <span className="text-lg">{kitchenTotal.toFixed(2)} €</span>
                        </div>
                      </div>
                    </div>

                    {/* Action buttons */}
                    <div className="grid grid-cols-2 gap-3">
                      {/* Continue Shopping Button */}
                      <Button
                        variant="outline"
                        onClick={handleContinueShopping}
                        className="h-12 border-2 hover:border-primary/30 hover:bg-primary/5 transition-all duration-200"
                      >
                        <ArrowLeft className="h-5 w-5 mr-2" />
                        Weiter bestellen
                      </Button>

                      {/* Pay Button */}
                      <Button
                        variant="default"
                        onClick={handlePayment}
                        disabled={isProcessingPayment || kitchenItems.length === 0}
                        className="h-12 bg-gradient-to-b from-primary to-primary/90 hover:from-primary/90 hover:to-primary shadow-lg hover:shadow-xl transition-all duration-200"
                      >
                        {isProcessingPayment ? (
                          <Loader2 className="h-5 w-5 mr-2 animate-spin" />
                        ) : (
                          <CreditCardIcon className="h-5 w-5 mr-2" />
                        )}
                        Bezahlen
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* BEZAHLT TAB */}
            {activeTab === "paid" && (
              <div className="p-4 pt-8">
                {paidItems.length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-16 text-center px-6">
                    <div className="relative mb-6">
                      <div className="w-20 h-20 rounded-full bg-gradient-to-br from-green-100 to-green-50 flex items-center justify-center">
                        <Receipt className="h-10 w-10 text-green-600/60" />
                      </div>
                    </div>
                    <h3 className="text-xl font-semibold mb-2 text-foreground">Keine bezahlten Bestellungen</h3>
                    <p className="text-muted-foreground mb-6 max-w-sm">
                      Bestellungen, die bereits bezahlt wurden, erscheinen hier
                    </p>
                    <Button
                      variant="outline"
                      onClick={() => setActiveTab("cart")}
                      className="border-2 hover:border-primary/30"
                    >
                      <ShoppingBag className="mr-2 h-4 w-4" />
                      Zurück zum Warenkorb
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-6">
                    {/* Paid items list */}
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <h3 className="font-medium text-sm text-muted-foreground">Bezahlte Bestellungen</h3>
                        <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                          Bezahlt
                        </Badge>
                      </div>

                      {paidItems.map((item) => (
                        <div
                          key={`${item.id}-${item.guestId || "self"}`}
                          className="bg-white rounded-xl border shadow-sm overflow-hidden"
                        >
                          <div className="flex p-3">
                            {/* Item image */}
                            {item.imageUrl && (
                              <div className="relative h-16 w-16 flex-shrink-0 overflow-hidden rounded-lg mr-3">
                                <Image
                                  src={item.imageUrl || "/placeholder.svg"}
                                  alt={item.name}
                                  fill
                                  className="object-cover"
                                  sizes="64px"
                                />
                              </div>
                            )}

                            {/* Item details */}
                            <div className="flex-1 min-w-0">
                              <div className="flex justify-between">
                                <h4 className="font-medium">{item.name}</h4>
                                <div className="font-medium">{(item.price * item.quantity).toFixed(2)} €</div>
                              </div>

                              <div className="flex justify-between items-end mt-1">
                                <div>
                                  <p className="text-sm text-muted-foreground">
                                    {item.quantity} × {item.price.toFixed(2)} €
                                  </p>
                                  {item.notes && (
                                    <p className="text-xs text-muted-foreground mt-0.5 italic">"{item.notes}"</p>
                                  )}
                                </div>
                                {item.timestamp && (
                                  <p className="text-xs text-muted-foreground">
                                    <CheckCircle className="h-3 w-3 inline mr-1 text-green-600" />
                                    {formatTimestamp(item.timestamp)}
                                  </p>
                                )}
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Paid summary */}
                    <div className="bg-green-50/50 rounded-xl p-4 border border-green-100 space-y-3">
                      <div className="flex items-center">
                        <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center mr-3">
                          <CheckCircle className="h-4 w-4 text-green-600" />
                        </div>
                        <div>
                          <h3 className="font-medium">Bezahlt</h3>
                          <p className="text-xs text-green-700 mt-0.5">Gesamtbetrag: {paidTotal.toFixed(2)} €</p>
                        </div>
                      </div>
                    </div>

                    {/* Continue shopping button */}
                    <Button
                      variant="outline"
                      onClick={handleContinueShopping}
                      className="w-full h-12 border-2 hover:border-primary/30 hover:bg-primary/5 transition-all duration-200"
                    >
                      <ArrowLeft className="h-5 w-5 mr-2" />
                      Weiter bestellen
                    </Button>
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
