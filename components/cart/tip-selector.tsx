"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Euro } from "lucide-react"
import { useCart, type TipOption } from "@/contexts/cart-context"
import { cn } from "@/lib/utils"
import { Input } from "@/components/ui/input"

export function TipSelector() {
  const { totalPrice, tipOption, tipAmount, customTipAmount, setTipOption, setCustomTipAmount } = useCart()
  const [customInputValue, setCustomInputValue] = useState("")
  const [isCustomActive, setIsCustomActive] = useState(false)

  // Preset tip options
  const tipOptions: TipOption[] = [0, 5, 10, 15, 20]

  // Update custom input value when customTipAmount changes
  useEffect(() => {
    if (tipOption === "custom" && customTipAmount > 0) {
      setCustomInputValue(customTipAmount.toString())
    }
  }, [tipOption, customTipAmount])

  // Handle tip option selection
  const handleTipOptionSelect = (option: TipOption) => {
    setTipOption(option)
    setIsCustomActive(option === "custom")

    if (option === "custom") {
      // Focus the custom input when custom option is selected
      setTimeout(() => {
        const customInput = document.getElementById("custom-tip-input")
        if (customInput) {
          customInput.focus()
        }
      }, 0)
    }
  }

  // Handle custom tip input change
  const handleCustomTipChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    setCustomInputValue(value)

    // Only update the actual tip amount if the value is a valid number
    const numValue = Number.parseFloat(value)
    if (!isNaN(numValue) && numValue >= 0) {
      setCustomTipAmount(numValue)
    } else {
      setCustomTipAmount(0)
    }
  }

  // Format tip amount for display
  const formatTipAmount = (option: TipOption) => {
    if (option === 0) return "Kein Trinkgeld"
    if (option === "custom") return `${customTipAmount.toFixed(2)} €`

    const amount = (totalPrice * (option / 100)).toFixed(2)
    return `${amount} € (${option}%)`
  }

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-medium">Trinkgeld</h3>
        {tipOption !== 0 && <span className="text-sm text-primary font-medium">+{tipAmount.toFixed(2)} €</span>}
      </div>

      <div className="grid grid-cols-3 gap-2">
        {tipOptions.map((option) => (
          <button
            key={option}
            type="button"
            className={cn(
              "flex flex-col items-center justify-center p-2 rounded-lg border text-sm transition-all",
              "hover:border-primary/50 hover:bg-primary/5",
              tipOption === option
                ? "border-primary bg-primary/10 text-primary"
                : "border-border bg-background text-foreground",
            )}
            onClick={() => handleTipOptionSelect(option)}
          >
            <span className="font-medium">{option}%</span>
            <span className="text-xs text-muted-foreground mt-1">
              {option > 0 ? `${(totalPrice * (option / 100)).toFixed(2)} €` : "Kein Trinkgeld"}
            </span>
          </button>
        ))}
      </div>

      <div className="flex items-center gap-2">
        <button
          type="button"
          className={cn(
            "flex-1 flex items-center justify-center p-2 rounded-lg border text-sm transition-all",
            "hover:border-primary/50 hover:bg-primary/5",
            tipOption === "custom"
              ? "border-primary bg-primary/10 text-primary"
              : "border-border bg-background text-foreground",
          )}
          onClick={() => handleTipOptionSelect("custom")}
        >
          Benutzerdefiniert
        </button>

        <div className={cn("relative flex-1", !isCustomActive && "opacity-50")}>
          <Input
            id="custom-tip-input"
            type="number"
            min="0"
            step="0.5"
            placeholder="Betrag eingeben"
            value={customInputValue}
            onChange={handleCustomTipChange}
            onClick={() => handleTipOptionSelect("custom")}
            className="pl-7"
            disabled={!isCustomActive}
          />
          <Euro className="absolute left-2 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        </div>
      </div>

      {tipOption !== 0 && (
        <div className="text-xs text-center text-muted-foreground mt-1">
          Vielen Dank für Ihr Trinkgeld! Es wird direkt an das Servicepersonal weitergegeben.
        </div>
      )}
    </div>
  )
}
