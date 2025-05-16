"use client"

import { useState, useEffect } from "react"
import { Check, QrCode, RefreshCw, X } from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { cn } from "@/lib/utils"
import { Alert, AlertDescription } from "@/components/ui/alert"

interface TableVerificationDialogProps {
  tableId: string | null
  isOpen: boolean
  onClose: () => void
  onVerify: (verified: boolean) => void
}

export function TableVerificationDialog({ tableId, isOpen, onClose, onVerify }: TableVerificationDialogProps) {
  const [verificationCode, setVerificationCode] = useState("")
  const [isVerifying, setIsVerifying] = useState(false)
  const [verificationError, setVerificationError] = useState<string | null>(null)
  const [verificationMethod, setVerificationMethod] = useState<"code" | "qr" | "location" | "bypass">("code")
  const [locationStatus, setLocationStatus] = useState<"idle" | "checking" | "success" | "error">("idle")
  const [showDebugInfo, setShowDebugInfo] = useState(false)

  // Reset state when dialog opens
  useEffect(() => {
    if (isOpen) {
      setVerificationCode("")
      setVerificationError(null)
      setIsVerifying(false)
      setLocationStatus("idle")
    }
  }, [isOpen])

  // Generate a simple verification code based on table ID
  // In a real app, this would come from the server
  const getExpectedCode = (tableId: string) => {
    // Simple algorithm: reverse the table ID and add "RT" prefix
    return `RT${tableId.split("").reverse().join("")}`
  }

  const handleVerifyCode = () => {
    if (!tableId) return

    setIsVerifying(true)
    setVerificationError(null)

    // Simulate API call
    setTimeout(() => {
      const expectedCode = getExpectedCode(tableId)

      // Make comparison case-insensitive and trim whitespace
      if (verificationCode.trim().toUpperCase() === expectedCode.toUpperCase()) {
        // Call onVerify first, then close the dialog
        onVerify(true)
      } else {
        setVerificationError("Der eingegebene Code ist ungültig. Bitte überprüfen Sie den Code auf Ihrem Tisch.")
        setIsVerifying(false)
      }
    }, 1000)
  }

  const handleVerifyQR = () => {
    setIsVerifying(true)
    setVerificationError(null)

    // Simulate QR scanning
    setTimeout(() => {
      // Always succeed for demo purposes
      onVerify(true)
    }, 1500)
  }

  const handleVerifyLocation = () => {
    setLocationStatus("checking")
    setVerificationError(null)

    // Simulate location verification
    setTimeout(() => {
      // Always succeed for demo purposes
      setLocationStatus("success")
      setTimeout(() => {
        onVerify(true)
      }, 1000)
    }, 2000)
  }

  const handleBypassVerification = () => {
    // Immediately verify without checks (for testing)
    onVerify(true)
  }

  // For debugging purposes
  const expectedCode = tableId ? getExpectedCode(tableId) : "N/A"

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Tisch {tableId} verifizieren</DialogTitle>
          <DialogDescription>
            Bitte verifizieren Sie, dass Sie tatsächlich an diesem Tisch sitzen, um fortzufahren.
          </DialogDescription>
        </DialogHeader>

        <Tabs
          defaultValue="code"
          className="w-full"
          value={verificationMethod}
          onValueChange={(v) => setVerificationMethod(v as any)}
        >
          <TabsList className="grid grid-cols-4 mb-4">
            <TabsTrigger value="code">Tischcode</TabsTrigger>
            <TabsTrigger value="qr">QR-Code</TabsTrigger>
            <TabsTrigger value="location">Standort</TabsTrigger>
            <TabsTrigger value="bypass">Test</TabsTrigger>
          </TabsList>

          <TabsContent value="code" className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="verification-code">Tischcode eingeben</Label>
              <div className="flex gap-2">
                <Input
                  id="verification-code"
                  placeholder="z.B. RT24T"
                  value={verificationCode}
                  onChange={(e) => setVerificationCode(e.target.value)}
                  className="flex-1"
                  disabled={isVerifying}
                />
                <Button onClick={handleVerifyCode} disabled={!verificationCode || isVerifying}>
                  {isVerifying ? <RefreshCw className="h-4 w-4 animate-spin" /> : "Prüfen"}
                </Button>
              </div>
              <p className="text-xs text-muted-foreground">
                Der Tischcode ist auf dem Tischaufsteller oder der Tischkarte zu finden.
              </p>

              <Button
                variant="ghost"
                size="sm"
                className="text-xs text-muted-foreground"
                onClick={() => setShowDebugInfo(!showDebugInfo)}
              >
                {showDebugInfo ? "Debug-Info ausblenden" : "Debug-Info anzeigen"}
              </Button>

              {showDebugInfo && (
                <Alert variant="outline" className="bg-muted/50 mt-2">
                  <AlertDescription>
                    <div className="text-xs space-y-1">
                      <p>
                        <strong>Tischnummer:</strong> {tableId}
                      </p>
                      <p>
                        <strong>Erwarteter Code:</strong> {expectedCode}
                      </p>
                      <p>
                        <strong>Eingegebener Code:</strong> {verificationCode}
                      </p>
                      <p className="text-muted-foreground">
                        Hinweis: Der Code wird durch Umkehrung der Tischnummer und Hinzufügen des Präfixes "RT"
                        generiert.
                      </p>
                    </div>
                  </AlertDescription>
                </Alert>
              )}
            </div>
          </TabsContent>

          <TabsContent value="qr" className="space-y-4">
            <div className="flex flex-col items-center justify-center space-y-4">
              <div className="border rounded-lg p-4 w-full aspect-square flex flex-col items-center justify-center bg-muted/50">
                <QrCode className="h-16 w-16 mb-4 text-muted-foreground" />
                <p className="text-sm text-center text-muted-foreground">
                  Scannen Sie den Verifizierungs-QR-Code auf Ihrem Tisch
                </p>
              </div>
              <Button onClick={handleVerifyQR} disabled={isVerifying} className="w-full">
                {isVerifying ? (
                  <RefreshCw className="h-4 w-4 animate-spin mr-2" />
                ) : (
                  <QrCode className="h-4 w-4 mr-2" />
                )}
                QR-Code scannen
              </Button>
            </div>
          </TabsContent>

          <TabsContent value="location" className="space-y-4">
            <div className="flex flex-col items-center justify-center space-y-4">
              <div
                className={cn(
                  "w-16 h-16 rounded-full flex items-center justify-center",
                  locationStatus === "idle" && "bg-muted",
                  locationStatus === "checking" && "bg-amber-100",
                  locationStatus === "success" && "bg-green-100",
                  locationStatus === "error" && "bg-red-100",
                )}
              >
                {locationStatus === "idle" && <div className="h-6 w-6 rounded-full bg-muted-foreground/20" />}
                {locationStatus === "checking" && <RefreshCw className="h-6 w-6 text-amber-600 animate-spin" />}
                {locationStatus === "success" && <Check className="h-6 w-6 text-green-600" />}
                {locationStatus === "error" && <X className="h-6 w-6 text-red-600" />}
              </div>
              <p className="text-sm text-center">
                {locationStatus === "idle" &&
                  "Überprüfen Sie Ihren Standort, um zu bestätigen, dass Sie am richtigen Tisch sitzen."}
                {locationStatus === "checking" && "Standort wird überprüft..."}
                {locationStatus === "success" && "Standort erfolgreich verifiziert!"}
                {locationStatus === "error" && "Standortverifizierung fehlgeschlagen."}
              </p>
              <Button
                onClick={handleVerifyLocation}
                disabled={locationStatus === "checking" || locationStatus === "success"}
                className="w-full"
              >
                {locationStatus === "checking" ? (
                  <RefreshCw className="h-4 w-4 animate-spin mr-2" />
                ) : (
                  <svg className="h-4 w-4 mr-2" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path
                      d="M12 2C8.13 2 5 5.13 5 9C5 14.25 12 22 12 22C12 22 19 14.25 19 9C19 5.13 15.87 2 12 2ZM12 11.5C10.62 11.5 9.5 10.38 9.5 9C9.5 7.62 10.62 6.5 12 6.5C13.38 6.5 14.5 7.62 14.5 9C14.5 10.38 13.38 11.5 12 11.5Z"
                      fill="currentColor"
                    />
                  </svg>
                )}
                Standort verifizieren
              </Button>
            </div>
          </TabsContent>

          <TabsContent value="bypass" className="space-y-4">
            <div className="flex flex-col items-center justify-center space-y-4">
              <div className="border rounded-lg p-4 w-full flex flex-col items-center justify-center bg-muted/50">
                <p className="text-sm text-center text-muted-foreground mb-2">Testmodus: Verifizierung überspringen</p>
                <p className="text-xs text-center text-muted-foreground">
                  Diese Option ist nur für Testzwecke gedacht und sollte in einer Produktionsumgebung nicht verfügbar
                  sein.
                </p>
              </div>
              <Button onClick={handleBypassVerification} className="w-full bg-amber-500 hover:bg-amber-600">
                Verifizierung überspringen
              </Button>
            </div>
          </TabsContent>
        </Tabs>

        {verificationError && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md text-sm">
            {verificationError}
          </div>
        )}

        <DialogFooter className="sm:justify-between">
          <Button variant="ghost" onClick={onClose} type="button">
            Abbrechen
          </Button>
          <p className="text-xs text-muted-foreground">
            Tischverifizierung hilft, Bestellungen dem richtigen Tisch zuzuordnen.
          </p>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
