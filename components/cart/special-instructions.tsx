"use client"

import type React from "react"

import { useState } from "react"
import { useCart } from "@/contexts/cart-context"
import { Textarea } from "@/components/ui/textarea"

export function SpecialInstructions() {
  const { specialInstructions, setSpecialInstructions } = useCart()
  const [localInstructions, setLocalInstructions] = useState(specialInstructions)
  const maxLength = 200

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const value = e.target.value
    if (value.length <= maxLength) {
      setLocalInstructions(value)
      setSpecialInstructions(value)
    }
  }

  const charactersLeft = maxLength - localInstructions.length

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-medium">Besondere Anweisungen</h3>
        <span className={`text-xs ${charactersLeft < 20 ? "text-amber-500" : "text-muted-foreground"}`}>
          {charactersLeft} Zeichen übrig
        </span>
      </div>

      <Textarea
        placeholder="Besondere Wünsche oder Anweisungen für Ihre Bestellung..."
        value={localInstructions}
        onChange={handleChange}
        className="resize-none"
        rows={3}
      />

      <p className="text-xs text-muted-foreground">
        Bitte geben Sie hier Allergien, Diätvorschriften oder spezielle Anweisungen für Ihre Bestellung an.
      </p>
    </div>
  )
}
