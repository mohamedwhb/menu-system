"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { Check, Info, QrCode, Shield, Users, X } from "lucide-react"
import { useCart } from "@/contexts/cart-context"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { cn } from "@/lib/utils"
import { TableVerificationDialog } from "@/components/verification/table-verification-dialog"
import { toast } from "@/hooks/use-toast"

export function TableIdSelector() {
  const { tableId, tableVerified, setTableId, setTableVerified } = useCart()
  const [inputValue, setInputValue] = useState(tableId || "")
  const [isEditing, setIsEditing] = useState(!tableId)
  const [showVerificationDialog, setShowVerificationDialog] = useState(false)

  // Sync with localStorage on mount
  useEffect(() => {
    const savedTableId = localStorage.getItem("tischID")
    if (savedTableId && !tableId) {
      setTableId(savedTableId)
      setInputValue(savedTableId)
      setIsEditing(false)
    }
  }, [tableId, setTableId])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (inputValue.trim()) {
      setTableId(inputValue.trim())
      localStorage.setItem("tischID", inputValue.trim())
      setIsEditing(false)
      setTableVerified(false) // Reset verification when table changes

      // Show verification dialog after setting table ID
      setTimeout(() => {
        setShowVerificationDialog(true)
      }, 300)
    }
  }

  const handleClear = () => {
    setTableId(null)
    setTableVerified(false)
    setInputValue("")
    localStorage.removeItem("tischID")
    setIsEditing(true)
  }

  const handleVerify = () => {
    setShowVerificationDialog(true)
  }

  // Handle successful verification
  const handleVerificationSuccess = (verified: boolean) => {
    setTableVerified(verified)
    setShowVerificationDialog(false)

    if (verified) {
      toast({
        title: "Tisch erfolgreich verifiziert",
        description: `Sie können jetzt an Tisch ${tableId} bestellen.`,
        duration: 3000,
      })
    }
  }

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-1">
          <h3 className="text-sm font-medium">Tischnummer</h3>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Info className="h-3.5 w-3.5 text-muted-foreground cursor-help" />
              </TooltipTrigger>
              <TooltipContent className="max-w-xs">
                <p>
                  Geben Sie Ihre Tischnummer ein, um eine Gruppenbestellung zu starten oder einer bestehenden
                  beizutreten.
                </p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>

        {tableId && !isEditing && (
          <Button variant="ghost" size="sm" className="h-7 text-xs" onClick={() => setIsEditing(true)}>
            Bearbeiten
          </Button>
        )}
      </div>

      {isEditing ? (
        <form onSubmit={handleSubmit} className="flex gap-2">
          <div className="relative flex-1">
            <Input
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder="z.B. T42"
              className="pr-8"
            />
            <Button
              type="button"
              variant="ghost"
              size="icon"
              className="absolute right-0 top-0 h-full w-8 text-muted-foreground hover:text-foreground"
            >
              <QrCode className="h-4 w-4" />
            </Button>
          </div>
          <Button type="submit" size="sm" disabled={!inputValue.trim()}>
            Bestätigen
          </Button>
        </form>
      ) : (
        <div
          className={cn(
            "flex items-center justify-between p-2 rounded-md",
            tableVerified ? "border border-green-200 bg-green-50" : "border border-amber-200 bg-amber-50",
          )}
        >
          <div className="flex items-center">
            <div
              className={cn(
                "h-8 w-8 rounded-full flex items-center justify-center mr-2",
                tableVerified ? "bg-green-100" : "bg-amber-100",
              )}
            >
              {tableVerified ? (
                <Shield className="h-4 w-4 text-green-600" />
              ) : (
                <Users className="h-4 w-4 text-amber-600" />
              )}
            </div>
            <div>
              <div className="flex items-center">
                <span className="font-medium">Tisch {tableId}</span>
                {tableVerified ? (
                  <Check className="h-3.5 w-3.5 text-green-600 ml-1" />
                ) : (
                  <X className="h-3.5 w-3.5 text-amber-600 ml-1" />
                )}
              </div>
              <p className="text-xs text-muted-foreground">
                {tableVerified ? "Tisch verifiziert" : "Tisch nicht verifiziert"}
              </p>
            </div>
          </div>
          <div className="flex gap-1">
            {!tableVerified && (
              <Button
                variant="outline"
                size="sm"
                className="h-7 text-xs border-amber-200 bg-amber-50 hover:bg-amber-100 text-amber-700"
                onClick={handleVerify}
              >
                Verifizieren
              </Button>
            )}
            <Button variant="ghost" size="sm" className="h-7 text-xs" onClick={handleClear}>
              Entfernen
            </Button>
          </div>
        </div>
      )}

      {/* Verification Dialog */}
      <TableVerificationDialog
        tableId={tableId}
        isOpen={showVerificationDialog}
        onClose={() => setShowVerificationDialog(false)}
        onVerify={handleVerificationSuccess}
      />
    </div>
  )
}
