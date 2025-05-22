"use client"

import { useState } from "react"
import { Check, CreditCard, Landmark, Smartphone, Wallet } from "lucide-react"
import { useCart, type PaymentMethod } from "@/contexts/cart-context"
import { cn } from "@/lib/utils"

const paymentMethods = [
  {
    id: "card" as PaymentMethod,
    name: "Kreditkarte",
    icon: CreditCard,
  },
  {
    id: "paypal" as PaymentMethod,
    name: "PayPal",
    icon: Wallet,
  },
  {
    id: "applepay" as PaymentMethod,
    name: "Apple Pay",
    icon: Smartphone,
  },
  {
    id: "cash" as PaymentMethod,
    name: "Barzahlung",
    icon: Landmark,
  },
]

export function PaymentMethodSelector() {
  const { paymentMethod, setPaymentMethod } = useCart()
  const [isExpanded, setIsExpanded] = useState(false)

  return (
    <div className="grid grid-cols-2 gap-2">
      {paymentMethods.map((method) => {
        const Icon = method.icon
        const isSelected = paymentMethod === method.id

        return (
          <button
            key={method.id}
            type="button"
            className={cn(
              "relative flex flex-col items-center justify-center p-3 rounded-lg border text-sm transition-all",
              "hover:border-primary/50 hover:bg-primary/5",
              isSelected ? "border-primary bg-primary/10 text-primary" : "border-border bg-background text-foreground",
            )}
            onClick={() => setPaymentMethod(method.id)}
          >
            {isSelected && (
              <div className="absolute top-1 right-1">
                <Check className="h-3 w-3" />
              </div>
            )}
            <Icon className="h-5 w-5 mb-1" />
            <span>{method.name}</span>
          </button>
        )
      })}
    </div>
  )
}
