"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Euro, Percent, Calculator } from "lucide-react"
import { useCart, type TipOption } from "@/contexts/cart-context"
import { cn } from "@/lib/utils"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"

export function TipSelector() {
  const { totalPrice, tipOption, tipAmount, customTipAmount, setTipOption, setCustomTipAmount } = useCart()
  const [customInputValue, setCustomInputValue] = useState("")
  const [customPercentageValue, setCustomPercentageValue] = useState("")
  const [isCustomActive, setIsCustomActive] = useState(false)
  const [inputMode, setInputMode] = useState<"amount" | "percentage">("amount")

  // Erweiterte Tip-Optionen
  const tipOptions: TipOption[] = [0, 5, 10, 15, 18, 20, 25]

  // Berechne Trinkgeldbetrag für Prozentsatz
  const calculateTipAmount = (percentage: number): number => {
    return (totalPrice * percentage) / 100
  }

  // Berechne Prozentsatz für Betrag
  const calculateTipPercentage = (amount: number): number => {
    return totalPrice > 0 ? (amount / totalPrice) * 100 : 0
  }

  // Update custom input values when customTipAmount changes
  useEffect(() => {
    if (tipOption === "custom" && customTipAmount > 0) {
      setCustomInputValue(customTipAmount.toFixed(2))
      setCustomPercentageValue(calculateTipPercentage(customTipAmount).toFixed(1))
    }
  }, [tipOption, customTipAmount, totalPrice])

  // Handle tip option selection
  const handleTipOptionSelect = (option: TipOption) => {
    setTipOption(option)
    setIsCustomActive(option === "custom")

    if (option !== "custom") {
      setCustomInputValue("")
      setCustomPercentageValue("")
    }
  }

  // Handle custom tip amount input
  const handleCustomAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    setCustomInputValue(value)

    const numValue = Number.parseFloat(value)
    if (!isNaN(numValue) && numValue >= 0 && numValue <= totalPrice * 2) {
      setCustomTipAmount(numValue)
      setCustomPercentageValue(calculateTipPercentage(numValue).toFixed(1))
    } else if (value === "") {
      setCustomTipAmount(0)
      setCustomPercentageValue("")
    }
  }

  // Handle custom tip percentage input
  const handleCustomPercentageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    setCustomPercentageValue(value)

    const numValue = Number.parseFloat(value)
    if (!isNaN(numValue) && numValue >= 0 && numValue <= 100) {
      const amount = calculateTipAmount(numValue)
      setCustomTipAmount(amount)
      setCustomInputValue(amount.toFixed(2))
    } else if (value === "") {
      setCustomTipAmount(0)
      setCustomInputValue("")
    }
  }

  // Format tip amount for display
  const formatTipAmount = (option: TipOption) => {
    if (option === 0) return "Kein Trinkgeld"
    if (option === "custom") return `${customTipAmount.toFixed(2)} €`

    const amount = calculateTipAmount(option)
    return `${amount.toFixed(2)} € (${option}%)`
  }

  // Get current tip percentage for display
  const getCurrentTipPercentage = (): number => {
    if (tipOption === "custom") {
      return calculateTipPercentage(customTipAmount)
    } else if (typeof tipOption === "number") {
      return tipOption
    }
    return 0
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-medium flex items-center">
          <Calculator className="h-4 w-4 mr-2" />
          Trinkgeld
        </h3>
        {tipOption !== 0 && (
          <div className="text-sm text-primary font-medium">
            +{tipAmount.toFixed(2)} € ({getCurrentTipPercentage().toFixed(1)}%)
          </div>
        )}
      </div>

      {/* Subtotal Display */}
      <div className="bg-muted/20 p-3 rounded-lg">
        <div className="flex justify-between items-center text-sm">
          <span className="text-muted-foreground">Rechnungsbetrag:</span>
          <span className="font-medium">{totalPrice.toFixed(2)} €</span>
        </div>
      </div>

      {/* Percentage Options */}
      <div className="grid grid-cols-4 gap-2">
        {tipOptions.map((option) => {
          const tipAmountForOption = option > 0 ? calculateTipAmount(option) : 0
          const isSelected = tipOption === option

          return (
            <button
              key={option}
              type="button"
              className={cn(
                "flex flex-col items-center justify-center p-2 rounded-lg border text-xs transition-all",
                "hover:border-primary/50 hover:bg-primary/5",
                isSelected
                  ? "border-primary bg-primary/10 text-primary"
                  : "border-border bg-background text-foreground",
              )}
              onClick={() => handleTipOptionSelect(option)}
            >
              <span className="font-medium">{option}%</span>
              <span className="text-xs text-muted-foreground mt-1">
                {option > 0 ? `${tipAmountForOption.toFixed(2)} €` : "Kein"}
              </span>
            </button>
          )
        })}
      </div>

      {/* Custom Input Section */}
      <div className="space-y-3">
        <div className="flex items-center gap-2">
          <Button
            type="button"
            variant={tipOption === "custom" ? "default" : "outline"}
            size="sm"
            onClick={() => handleTipOptionSelect("custom")}
            className="flex-1"
          >
            Benutzerdefiniert
          </Button>

          {tipOption === "custom" && (
            <div className="flex rounded-md border">
              <Button
                type="button"
                variant={inputMode === "amount" ? "default" : "ghost"}
                size="sm"
                onClick={() => setInputMode("amount")}
                className="rounded-r-none border-r"
              >
                <Euro className="h-3 w-3" />
              </Button>
              <Button
                type="button"
                variant={inputMode === "percentage" ? "default" : "ghost"}
                size="sm"
                onClick={() => setInputMode("percentage")}
                className="rounded-l-none"
              >
                <Percent className="h-3 w-3" />
              </Button>
            </div>
          )}
        </div>

        {tipOption === "custom" && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {/* Amount Input */}
            <div className="space-y-1">
              <Label htmlFor="custom-tip-amount" className="text-xs">
                Betrag (€)
              </Label>
              <div className="relative">
                <Input
                  id="custom-tip-amount"
                  type="number"
                  min="0"
                  max={totalPrice * 2}
                  step="0.50"
                  placeholder="0.00"
                  value={customInputValue}
                  onChange={handleCustomAmountChange}
                  className="pl-7 text-sm"
                />
                <Euro className="absolute left-2 top-1/2 transform -translate-y-1/2 h-3 w-3 text-muted-foreground" />
              </div>
            </div>

            {/* Percentage Input */}
            <div className="space-y-1">
              <Label htmlFor="custom-tip-percentage" className="text-xs">
                Prozentsatz (%)
              </Label>
              <div className="relative">
                <Input
                  id="custom-tip-percentage"
                  type="number"
                  min="0"
                  max="100"
                  step="0.5"
                  placeholder="0"
                  value={customPercentageValue}
                  onChange={handleCustomPercentageChange}
                  className="pr-7 text-sm"
                />
                <Percent className="absolute right-2 top-1/2 transform -translate-y-1/2 h-3 w-3 text-muted-foreground" />
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Result Display */}
      {tipAmount > 0 && (
        <div className="bg-primary/5 border border-primary/20 p-3 rounded-lg">
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span>Rechnungsbetrag:</span>
              <span>{totalPrice.toFixed(2)} €</span>
            </div>
            <div className="flex justify-between text-primary">
              <span>Trinkgeld ({getCurrentTipPercentage().toFixed(1)}%):</span>
              <span>+{tipAmount.toFixed(2)} €</span>
            </div>
            <div className="border-t border-primary/20 pt-2">
              <div className="flex justify-between font-medium">
                <span>Gesamtbetrag:</span>
                <span>{(totalPrice + tipAmount).toFixed(2)} €</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tip Guidelines */}
      <div className="text-xs text-center text-muted-foreground space-y-1">
        <p>Trinkgeld ist freiwillig und wird direkt an das Servicepersonal weitergegeben.</p>
        <p>Übliche Trinkgelder: 10-15% (gut), 18-20% (sehr gut), 25%+ (außergewöhnlich)</p>
      </div>
    </div>
  )
}
