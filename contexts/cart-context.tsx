"use client"

import type React from "react"

import { createContext, useContext, useEffect, useState } from "react"

export type PaymentMethod = "card" | "paypal" | "applepay" | "googlepay" | "cash" | "banktransfer"
export type SplitMethod = "items" | "percentage" | "equal"
export type ItemStatus = "cart" | "kitchen" | "paid"
export type TipOption = 0 | 5 | 10 | 15 | 20 | "custom"

export interface CartItem {
  id: string
  name: string
  price: number
  quantity: number
  imageUrl?: string
  guestId?: string
  guestName?: string
  selected?: boolean
  notes?: string
  customizations?: string
  status: ItemStatus
  timestamp?: number
}

export interface GuestSplit {
  guestId: string
  percentage: number
  amount: number
}

interface CartContextType {
  items: CartItem[]
  itemCount: number
  kitchenItemCount: number
  paidItemCount: number
  totalPrice: number
  selectedTotalPrice: number
  isOpen: boolean
  paymentMethod: PaymentMethod | null
  specialInstructions: string
  tableId: string | null
  tableVerified: boolean
  splitMethod: SplitMethod
  guestSplits: GuestSplit[]
  tipOption: TipOption
  tipAmount: number
  customTipAmount: number
  addItem: (item: Omit<CartItem, "quantity" | "status">, guestId?: string, guestName?: string) => void
  removeItem: (id: string, guestId?: string, status?: ItemStatus) => void
  updateQuantity: (id: string, quantity: number, guestId?: string, status?: ItemStatus) => void
  updateItemNotes: (id: string, notes: string, guestId?: string, status?: ItemStatus) => void
  clearCart: () => void
  clearKitchenItems: () => void
  clearPaidItems: () => void
  toggleCart: () => void
  closeCart: () => void
  setPaymentMethod: (method: PaymentMethod | null) => void
  setSpecialInstructions: (instructions: string) => void
  setTableId: (id: string | null) => void
  setTableVerified: (verified: boolean) => void
  toggleItemSelection: (id: string, guestId?: string, selected?: boolean, status?: ItemStatus) => void
  selectAllItems: (selected: boolean, status?: ItemStatus) => void
  getGuestIds: () => string[]
  getGuestName: (guestId: string) => string
  getItemsByGuest: (guestId: string, status?: ItemStatus) => CartItem[]
  setSplitMethod: (method: "items" | "equal") => void
  updateGuestPercentage: (guestId: string, percentage: number) => void
  distributeRemaining: () => void
  resetSplits: () => void
  splitEqually: () => void
  getGuestTotal: (guestId: string) => number
  sendItemsToKitchen: () => void
  markItemsAsPaid: (items?: CartItem[]) => void
  setTipOption: (option: TipOption) => void
  setCustomTipAmount: (amount: number) => void
  getTotalWithTip: () => number
  isProcessingPayment: boolean
  paymentError: string | null
  paymentSuccess: boolean
  initiatePayment: (items?: CartItem[]) => Promise<boolean>
  completePayment: (paymentDetails?: any) => void
  cancelPayment: () => void
  getItemsForPayment: () => CartItem[]
}

const CartContext = createContext<CartContextType | undefined>(undefined)

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([])
  const [isOpen, setIsOpen] = useState(false)
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod | null>(null)
  const [specialInstructions, setSpecialInstructions] = useState("")
  const [tableId, setTableId] = useState<string | null>(null)
  const [tableVerified, setTableVerified] = useState(false)
  const [splitMethod, setSplitMethod] = useState<"items" | "equal">("items")
  const [guestSplits, setGuestSplits] = useState<GuestSplit[]>([])
  const [tipOption, setTipOption] = useState<TipOption>(0)
  const [customTipAmount, setCustomTipAmount] = useState(0)
  const [isProcessingPayment, setIsProcessingPayment] = useState(false)
  const [paymentError, setPaymentError] = useState<string | null>(null)
  const [paymentSuccess, setPaymentSuccess] = useState(false)

  // Count items by status
  const itemCount = items.filter((item) => item.status === "cart").reduce((total, item) => total + item.quantity, 0)
  const kitchenItemCount = items
    .filter((item) => item.status === "kitchen")
    .reduce((total, item) => total + item.quantity, 0)
  const paidItemCount = items.filter((item) => item.status === "paid").reduce((total, item) => total + item.quantity, 0)

  const totalPrice = items
    .filter((item) => item.status === "cart")
    .reduce((total, item) => total + item.price * item.quantity, 0)

  const selectedTotalPrice = items
    .filter((item) => item.status === "cart" && item.selected !== false) // If selected is undefined or true, include it
    .reduce((total, item) => total + item.price * item.quantity, 0)

  // Calculate tip amount based on selected option
  const tipAmount = tipOption === "custom" ? customTipAmount : totalPrice * (tipOption / 100)

  // Get total with tip
  const getTotalWithTip = () => {
    return totalPrice + tipAmount
  }

  // Load cart from localStorage on mount (client-side only)
  useEffect(() => {
    try {
      // First check for saved cart data
      const savedCart = localStorage.getItem("cart")
      if (savedCart) {
        const parsedCart = JSON.parse(savedCart)

        // Ensure all items have a status property
        const itemsWithStatus = (parsedCart.items || []).map((item: any) => ({
          ...item,
          status: item.status || "cart", // Default to cart if no status
          timestamp: item.timestamp || Date.now(),
        }))

        setItems(itemsWithStatus)
        setPaymentMethod(parsedCart.paymentMethod || null)
        setSpecialInstructions(parsedCart.specialInstructions || "")
        setTableId(parsedCart.tableId || null)
        setTableVerified(parsedCart.tableVerified || false)
        setSplitMethod(parsedCart.splitMethod || "items")
        setGuestSplits(parsedCart.guestSplits || [])
        setTipOption(parsedCart.tipOption || 0)
        setCustomTipAmount(parsedCart.customTipAmount || 0)
      }

      // Then check for table ID in localStorage (this takes precedence)
      const savedTableId = localStorage.getItem("tischID")
      if (savedTableId) {
        setTableId(savedTableId)
        // Don't automatically set verified to true when loading from localStorage
        // The user will need to verify again
        setTableVerified(false)
      }
    } catch (error) {
      console.error("Failed to load cart from localStorage:", error)
    }
  }, [])

  // Save cart to localStorage when it changes
  useEffect(() => {
    try {
      localStorage.setItem(
        "cart",
        JSON.stringify({
          items,
          paymentMethod,
          specialInstructions,
          tableId,
          tableVerified,
          splitMethod,
          guestSplits,
          tipOption,
          customTipAmount,
        }),
      )

      // Also update the tischID in localStorage if tableId changes
      if (tableId) {
        localStorage.setItem("tischID", tableId)
      } else if (localStorage.getItem("tischID")) {
        // Remove tischID from localStorage if tableId is null
        localStorage.removeItem("tischID")
      }
    } catch (error) {
      console.error("Failed to save cart to localStorage:", error)
    }
  }, [
    items,
    paymentMethod,
    specialInstructions,
    tableId,
    tableVerified,
    splitMethod,
    guestSplits,
    tipOption,
    customTipAmount,
  ])

  // Reset verification when table changes
  useEffect(() => {
    if (tableId) {
      setTableVerified(false)
    }
  }, [tableId])

  // Update guest splits when guests change
  useEffect(() => {
    const guestIds = getGuestIds()

    // Add self if there are items without a guestId
    const hasNoGuestItems = items.some((item) => !item.guestId)
    if (hasNoGuestItems && !guestIds.includes("self")) {
      guestIds.push("self")
    }

    // Initialize or update guest splits
    if (guestIds.length > 0) {
      setGuestSplits((prevSplits) => {
        // Keep existing guests and their percentages
        const existingSplits = prevSplits.filter((split) => guestIds.includes(split.guestId))

        // Add new guests with 0% initially
        const newGuests = guestIds.filter((id) => !existingSplits.some((split) => split.guestId === id))
        const newSplits = newGuests.map((guestId) => ({
          guestId,
          percentage: 0,
          amount: 0,
        }))

        return [...existingSplits, ...newSplits]
      })
    }
  }, [items])

  // Update split amounts when percentages or total price changes
  useEffect(() => {
    if (splitMethod === "percentage" || splitMethod === "equal") {
      setGuestSplits((prevSplits) => {
        return prevSplits.map((split) => ({
          ...split,
          percentage: split.percentage,
          amount: (split.percentage / 100) * totalPrice,
        }))
      })
    }
  }, [totalPrice, splitMethod, guestSplits.map((s) => s.percentage).join(",")])

  const addItem = (newItem: Omit<CartItem, "quantity" | "status">, guestId?: string, guestName?: string) => {
    setItems((currentItems) => {
      // If guestId is provided, look for the item with the same id AND guestId
      const existingItemIndex = currentItems.findIndex(
        (item) =>
          item.id === newItem.id && item.status === "cart" && (guestId ? item.guestId === guestId : !item.guestId),
      )

      if (existingItemIndex > -1) {
        // Item exists for this guest, increment quantity
        const updatedItems = [...currentItems]
        updatedItems[existingItemIndex] = {
          ...updatedItems[existingItemIndex],
          quantity: updatedItems[existingItemIndex].quantity + 1,
          selected: true, // Newly added items are selected by default
        }
        return updatedItems
      } else {
        // Item doesn't exist for this guest, add new item with quantity 1
        return [
          ...currentItems,
          {
            ...newItem,
            quantity: 1,
            status: "cart",
            guestId,
            guestName: guestName || (guestId ? `Gast ${guestId.toUpperCase()}` : undefined),
            selected: true, // Newly added items are selected by default
            timestamp: Date.now(),
          },
        ]
      }
    })

    // Open cart drawer when adding items
    // setIsOpen(true)
  }

  const removeItem = (id: string, guestId?: string, status: ItemStatus = "cart") => {
    setItems((currentItems) =>
      currentItems.filter(
        (item) => !(item.id === id && item.status === status && (guestId ? item.guestId === guestId : !item.guestId)),
      ),
    )
  }

  const updateQuantity = (id: string, quantity: number, guestId?: string, status: ItemStatus = "cart") => {
    if (quantity <= 0) {
      removeItem(id, guestId, status)
      return
    }

    setItems((currentItems) =>
      currentItems.map((item) =>
        item.id === id && item.status === status && (guestId ? item.guestId === guestId : !item.guestId)
          ? { ...item, quantity }
          : item,
      ),
    )
  }

  const updateItemNotes = (id: string, notes: string, guestId?: string, status: ItemStatus = "cart") => {
    setItems((currentItems) =>
      currentItems.map((item) =>
        item.id === id && item.status === status && (guestId ? item.guestId === guestId : !item.guestId)
          ? { ...item, notes }
          : item,
      ),
    )
  }

  const clearCart = () => {
    setItems((currentItems) => currentItems.filter((item) => item.status !== "cart"))
    setPaymentMethod(null)
    setSpecialInstructions("")
    setTipOption(0)
    setCustomTipAmount(0)
    // Note: We don't clear tableId when clearing the cart
  }

  const clearKitchenItems = () => {
    setItems((currentItems) => currentItems.filter((item) => item.status !== "kitchen"))
  }

  const clearPaidItems = () => {
    setItems((currentItems) => currentItems.filter((item) => item.status !== "paid"))
  }

  const toggleCart = () => {
    setIsOpen((prev) => !prev)
  }

  const closeCart = () => {
    setIsOpen(false)
  }

  const toggleItemSelection = (id: string, guestId?: string, selected?: boolean, status: ItemStatus = "cart") => {
    setItems((currentItems) =>
      currentItems.map((item) => {
        if (item.id === id && item.status === status && (guestId ? item.guestId === guestId : !item.guestId)) {
          return {
            ...item,
            selected: selected !== undefined ? selected : !item.selected,
          }
        }
        return item
      }),
    )
  }

  const selectAllItems = (selected: boolean, status: ItemStatus = "cart") => {
    setItems((currentItems) => currentItems.map((item) => (item.status === status ? { ...item, selected } : item)))
  }

  const getGuestIds = () => {
    const guestIds = new Set<string>()
    items.forEach((item) => {
      if (item.guestId) {
        guestIds.add(item.guestId)
      }
    })
    return Array.from(guestIds)
  }

  const getGuestName = (guestId: string) => {
    if (guestId === "self") return "Ihre Bestellung"
    const item = items.find((item) => item.guestId === guestId)
    return item?.guestName || `Gast ${guestId.toUpperCase()}`
  }

  const getItemsByGuest = (guestId: string, status?: ItemStatus) => {
    let filteredItems = items

    if (status) {
      filteredItems = filteredItems.filter((item) => item.status === status)
    }

    if (guestId === "self") {
      return filteredItems.filter((item) => !item.guestId)
    }
    return filteredItems.filter((item) => item.guestId === guestId)
  }

  const updateGuestPercentage = (guestId: string, percentage: number) => {
    setGuestSplits((prevSplits) => {
      return prevSplits.map((split) => {
        if (split.guestId === guestId) {
          return {
            ...split,
            percentage,
            amount: (percentage / 100) * totalPrice,
          }
        }
        return split
      })
    })
  }

  const distributeRemaining = () => {
    const totalPercentage = guestSplits.reduce((sum, split) => sum + split.percentage, 0)

    if (totalPercentage >= 100) return // Already at or over 100%

    const remaining = 100 - totalPercentage
    const guestsWithZero = guestSplits.filter((split) => split.percentage === 0)

    if (guestsWithZero.length === 0) return // No guests with 0%

    const percentPerGuest = remaining / guestsWithZero.length

    setGuestSplits((prevSplits) => {
      return prevSplits.map((split) => {
        if (split.percentage === 0) {
          return {
            ...split,
            percentage: percentPerGuest,
            amount: (percentPerGuest / 100) * totalPrice,
          }
        }
        return split
      })
    })
  }

  const resetSplits = () => {
    setGuestSplits((prevSplits) => {
      return prevSplits.map((split) => ({
        ...split,
        percentage: 0,
        amount: 0,
      }))
    })
  }

  const splitEqually = () => {
    const equalPercentage = 100 / guestSplits.length

    setGuestSplits((prevSplits) => {
      return prevSplits.map((split) => ({
        ...split,
        percentage: equalPercentage,
        amount: (equalPercentage / 100) * totalPrice,
      }))
    })
  }

  const getGuestTotal = (guestId: string) => {
    if (splitMethod === "items") {
      // For item-based splitting, calculate based on selected items
      const guestItems =
        guestId === "self"
          ? items.filter((item) => item.status === "cart" && !item.guestId && item.selected !== false)
          : items.filter((item) => item.status === "cart" && item.guestId === guestId && item.selected !== false)

      return guestItems.reduce((sum, item) => sum + item.price * item.quantity, 0)
    } else {
      // For percentage-based splitting, use the calculated amount
      const split = guestSplits.find((split) => split.guestId === guestId)
      return split?.amount || 0
    }
  }

  // Send items to kitchen
  const sendItemsToKitchen = () => {
    setItems((currentItems) => {
      return currentItems.map((item) => {
        if (item.status === "cart") {
          return {
            ...item,
            status: "kitchen",
            timestamp: Date.now(),
          }
        }
        return item
      })
    })
  }

  // Mark items as paid
  const markItemsAsPaid = (itemsToMark?: CartItem[]) => {
    setItems((currentItems) => {
      if (itemsToMark) {
        // Mark specific items as paid
        return currentItems.map((item) => {
          if (itemsToMark.some((i) => i.id === item.id && i.guestId === item.guestId && i.status === item.status)) {
            return {
              ...item,
              status: "paid",
              timestamp: Date.now(),
            }
          }
          return item
        })
      } else {
        // Mark all kitchen items as paid
        return currentItems.map((item) => {
          if (item.status === "kitchen") {
            return {
              ...item,
              status: "paid",
              timestamp: Date.now(),
            }
          }
          return item
        })
      }
    })
  }

  // Funktion zum Initiieren des Bezahlvorgangs
  const initiatePayment = async (itemsToPayFor?: CartItem[]): Promise<boolean> => {
    // Setzen Sie den Zahlungsstatus zurück
    setPaymentError(null)
    setPaymentSuccess(false)
    setIsProcessingPayment(true)

    try {
      // Hier würde in einer echten Anwendung die Kommunikation mit einem Zahlungsdienstleister stattfinden
      // Für dieses Beispiel simulieren wir eine erfolgreiche Zahlung nach einer kurzen Verzögerung
      await new Promise((resolve) => setTimeout(resolve, 2000))

      // Simulieren Sie eine erfolgreiche Zahlung
      setPaymentSuccess(true)
      setIsProcessingPayment(false)
      return true
    } catch (error) {
      // Bei einem Fehler setzen wir die entsprechenden Zustandsvariablen
      setPaymentError(error instanceof Error ? error.message : "Ein unbekannter Fehler ist aufgetreten")
      setIsProcessingPayment(false)
      return false
    }
  }

  // Funktion zum Abschließen des Bezahlvorgangs
  const completePayment = (paymentDetails?: any) => {
    // Markieren Sie alle Artikel in der Küche als bezahlt
    markItemsAsPaid()

    // Setzen Sie den Zahlungsstatus zurück
    setPaymentSuccess(true)
    setIsProcessingPayment(false)

    // Optional: Speichern Sie Zahlungsdetails oder führen Sie andere Aktionen durch
    console.log("Zahlung abgeschlossen mit Details:", paymentDetails)
  }

  // Funktion zum Abbrechen des Bezahlvorgangs
  const cancelPayment = () => {
    setIsProcessingPayment(false)
    setPaymentError(null)
    setPaymentSuccess(false)
  }

  // Funktion zum Abrufen aller Artikel, die bezahlt werden sollen
  const getItemsForPayment = () => {
    return items.filter((item) => item.status === "kitchen")
  }

  return (
    <CartContext.Provider
      value={{
        items,
        itemCount,
        kitchenItemCount,
        paidItemCount,
        totalPrice,
        selectedTotalPrice,
        isOpen,
        paymentMethod,
        specialInstructions,
        tableId,
        tableVerified,
        splitMethod,
        guestSplits,
        tipOption,
        tipAmount,
        customTipAmount,
        addItem,
        removeItem,
        updateQuantity,
        updateItemNotes,
        clearCart,
        clearKitchenItems,
        clearPaidItems,
        toggleCart,
        closeCart,
        setPaymentMethod,
        setSpecialInstructions,
        setTableId,
        setTableVerified,
        toggleItemSelection,
        selectAllItems,
        getGuestIds,
        getGuestName,
        getItemsByGuest,
        setSplitMethod,
        updateGuestPercentage,
        distributeRemaining,
        resetSplits,
        splitEqually,
        getGuestTotal,
        sendItemsToKitchen,
        markItemsAsPaid,
        setTipOption,
        setCustomTipAmount,
        getTotalWithTip,
        isProcessingPayment,
        paymentError,
        paymentSuccess,
        initiatePayment,
        completePayment,
        cancelPayment,
        getItemsForPayment,
      }}
    >
      {children}
    </CartContext.Provider>
  )
}

export function useCart() {
  const context = useContext(CartContext)
  if (context === undefined) {
    throw new Error("useCart must be used within a CartProvider")
  }
  return context
}
