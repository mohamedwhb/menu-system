"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Calculator, Percent, Euro } from "lucide-react"
import { cn } from "@/lib/utils"

interface TipCalculatorProps {
  subtotal: number
  onTipChange: (amount: number, percentage: number) => void
  selectedTip?: number
  selectedPercentage?: number
}

export function TipCalculator({ subtotal, onTipChange, selectedTip = 0, selectedPercentage = 0 }: TipCalculatorProps) {
  const [customAmount, setCustomAmount] = useState("")
  const [customPercentage, setCustomPercentage] = useState("")
  const [activeMode, setActiveMode] = useState<"percentage" | "amount" | null>(null)

  // Vordefinierte Trinkgeld-Prozentsätze
  const tipPercentages = [0, 5, 10, 15, 18, 20, 25]

  // Berechne Trinkgeld basierend auf Prozentsatz
  const calculateTipFromPercentage = (percentage: number) => {
    return (subtotal * percentage) / 100
  }

  // Berechne Prozentsatz basierend auf Betrag
  const calculatePercentageFromTip = (amount: number) => {
    return subtotal > 0 ? (amount / subtotal) * 100 : 0
  }

  // Handle Prozentsatz-Auswahl
  const handlePercentageSelect = (percentage: number) => {
    const tipAmount = calculateTipFromPercentage(percentage)
    setActiveMode("percentage")
    setCustomAmount("")
    setCustomPercentage("")
    onTipChange(tipAmount, percentage)
  }

  // Handle benutzerdefinierter Betrag
  const handleCustomAmountChange = (value: string) => {
    setCustomAmount(value)
    const amount = Number.parseFloat(value) || 0

    if (amount >= 0 && amount <= subtotal * 2) {
      const percentage = calculatePercentageFromTip(amount)
      setActiveMode("amount")
      onTipChange(amount, percentage)
    }
  }

  // Handle benutzerdefinierter Prozentsatz
  const handleCustomPercentageChange = (value: string) => {
    setCustomPercentage(value)
    const percentage = Number.parseFloat(value) || 0

    if (percentage >= 0 && percentage <= 100) {
      const amount = calculateTipFromPercentage(percentage)
      setActiveMode("percentage")
      onTipChange(amount, percentage)
    }
  }

  // Formatiere Währung
  const formatCurrency = (amount: number) => {
    return amount.toFixed(2) + " €"
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center text-lg">
          <Calculator className="h-5 w-5 mr-2" />
          Trinkgeld-Rechner
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Subtotal Anzeige */}
        <div className="bg-muted/20 p-3 rounded-lg">
          <div className="flex justify-between items-center">
            <span className="text-sm text-muted-foreground">Rechnungsbetrag:</span>
            <span className="font-medium">{formatCurrency(subtotal)}</span>
          </div>
        </div>

        {/* Prozentsatz-Buttons */}
        <div>
          <Label className="text-sm font-medium mb-3 block">Trinkgeld-Prozentsätze</Label>
          <div className="grid grid-cols-4 gap-2">
            {tipPercentages.map((percentage) => {
              const tipAmount = calculateTipFromPercentage(percentage)
              const isSelected = activeMode === "percentage" && Math.abs(selectedPercentage - percentage) < 0.01

              return (
                <button
                  key={percentage}
                  type="button"
                  className={cn(
                    "flex flex-col items-center justify-center p-3 rounded-lg border text-xs transition-all",
                    "hover:border-primary/50 hover:bg-primary/5",
                    isSelected
                      ? "border-primary bg-primary/10 text-primary"
                      : "border-border bg-background text-foreground",
                  )}
                  onClick={() => handlePercentageSelect(percentage)}
                >
                  <span className="font-medium text-sm">{percentage}%</span>
                  <span className="text-xs text-muted-foreground mt-1">
                    {percentage > 0 ? formatCurrency(tipAmount) : "Kein"}
                  </span>
                </button>
              )
            })}
          </div>
        </div>

        {/* Benutzerdefinierte Eingaben */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* Benutzerdefinierter Betrag */}
          <div className="space-y-2">
            <Label htmlFor="custom-amount" className="text-sm font-medium">
              Benutzerdefinierter Betrag
            </Label>
            <div className="relative">
              <Input
                id="custom-amount"
                type="number"
                min="0"
                max={subtotal * 2}
                step="0.50"
                placeholder="0.00"
                value={customAmount}
                onChange={(e) => handleCustomAmountChange(e.target.value)}
                className="pl-8"
              />
              <Euro className="absolute left-2 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            </div>
            {activeMode === "amount" && selectedTip > 0 && (
              <p className="text-xs text-muted-foreground">
                Das entspricht {selectedPercentage.toFixed(1)}% der Rechnung
              </p>
            )}
          </div>

          {/* Benutzerdefinierter Prozentsatz */}
          <div className="space-y-2">
            <Label htmlFor="custom-percentage" className="text-sm font-medium">
              Benutzerdefinierter Prozentsatz
            </Label>
            <div className="relative">
              <Input
                id="custom-percentage"
                type="number"
                min="0"
                max="100"
                step="0.5"
                placeholder="0"
                value={customPercentage}
                onChange={(e) => handleCustomPercentageChange(e.target.value)}
                className="pr-8"
              />
              <Percent className="absolute right-2 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            </div>
            {activeMode === "percentage" && selectedPercentage > 0 && (
              <p className="text-xs text-muted-foreground">Das entspricht {formatCurrency(selectedTip)}</p>
            )}
          </div>
        </div>

        {/* Ergebnis-Anzeige */}
        {selectedTip > 0 && (
          <div className="bg-primary/5 border border-primary/20 p-4 rounded-lg">
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-sm">Rechnungsbetrag:</span>
                <span className="font-medium">{formatCurrency(subtotal)}</span>
              </div>
              <div className="flex justify-between items-center text-primary">
                <span className="text-sm">Trinkgeld ({selectedPercentage.toFixed(1)}%):</span>
                <span className="font-medium">+{formatCurrency(selectedTip)}</span>
              </div>
              <div className="border-t border-primary/20 pt-2">
                <div className="flex justify-between items-center font-semibold">
                  <span>Gesamtbetrag:</span>
                  <span className="text-lg">{formatCurrency(subtotal + selectedTip)}</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Trinkgeld-Hinweis */}
        <div className="text-xs text-center text-muted-foreground">
          <p>Trinkgeld ist freiwillig und wird direkt an das Servicepersonal weitergegeben.</p>
          <p className="mt-1">Übliche Trinkgelder liegen zwischen 10-20% der Rechnung.</p>
        </div>
      </CardContent>
    </Card>
  )
}
