"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Switch } from "@/components/ui/switch"
import { EyeIcon, EyeOffIcon } from "lucide-react"
import { useState } from "react"
import { Button } from "@/components/ui/button"

export default function PaymentTab() {
  const [showApiKey, setShowApiKey] = useState(false)

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Zahlungseinstellungen</CardTitle>
          <CardDescription>
            Konfigurieren Sie die Zahlungsmethoden und -einstellungen für Ihr Restaurant.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="cash-payment">Barzahlung aktivieren</Label>
              <p className="text-sm text-muted-foreground">Wenn aktiviert, können Kunden mit Bargeld bezahlen.</p>
            </div>
            <Switch id="cash-payment" defaultChecked />
          </div>

          <div className="space-y-2">
            <Label htmlFor="stripe-api-key">Stripe API-Schlüssel</Label>
            <div className="flex">
              <Input
                id="stripe-api-key"
                type={showApiKey ? "text" : "password"}
                placeholder="sk_test_..."
                defaultValue="sk_test_51NzT7QKG8oBfCbVhOcG7QWR5jSm2vH"
              />
              <Button
                type="button"
                variant="outline"
                size="icon"
                className="ml-2"
                onClick={() => setShowApiKey(!showApiKey)}
              >
                {showApiKey ? <EyeOffIcon className="h-4 w-4" /> : <EyeIcon className="h-4 w-4" />}
              </Button>
            </div>
            <p className="text-sm text-muted-foreground">
              Ihr Stripe API-Schlüssel für die Verarbeitung von Kreditkartenzahlungen.
            </p>
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="tip-function">Trinkgeldfunktion aktivieren</Label>
              <p className="text-sm text-muted-foreground">Wenn aktiviert, können Kunden Trinkgeld geben.</p>
            </div>
            <Switch id="tip-function" defaultChecked />
          </div>

          <div className="space-y-2">
            <Label htmlFor="min-order">Mindestbestellwert (€)</Label>
            <Input id="min-order" type="number" defaultValue="10" min="0" step="0.01" />
            <p className="text-sm text-muted-foreground">
              Der Mindestbestellwert für Bestellungen. Lassen Sie das Feld leer, wenn kein Mindestbestellwert
              erforderlich ist.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
