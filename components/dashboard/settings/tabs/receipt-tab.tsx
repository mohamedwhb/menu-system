import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Switch } from "@/components/ui/switch"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"

export default function ReceiptTab() {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Belegeinstellungen</CardTitle>
          <CardDescription>Konfigurieren Sie die Einstellungen für Belege und Rechnungen.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="auto-print">Automatischer Belegdruck</Label>
              <p className="text-sm text-muted-foreground">
                Wenn aktiviert, werden Belege automatisch gedruckt, sobald eine Bestellung abgeschlossen ist.
              </p>
            </div>
            <Switch id="auto-print" defaultChecked />
          </div>

          <div className="space-y-2">
            <Label htmlFor="receipt-prefix">Rechnungsnummer-Präfix</Label>
            <Input id="receipt-prefix" placeholder="z.B. QS-2025-" defaultValue="QS-2025-" />
            <p className="text-sm text-muted-foreground">Dieses Präfix wird allen Rechnungsnummern vorangestellt.</p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="api-url">API-URL für externes Kassensystem</Label>
            <Input id="api-url" placeholder="https://api.example.com/pos" />
            <p className="text-sm text-muted-foreground">
              Geben Sie die URL für die Integration mit Ihrem externen Kassensystem an.
            </p>
          </div>

          <div className="space-y-2">
            <Label>QR-Code auf Bon aktivieren</Label>
            <RadioGroup defaultValue="yes">
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="yes" id="qr-yes" />
                <Label htmlFor="qr-yes">Ja</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="no" id="qr-no" />
                <Label htmlFor="qr-no">Nein</Label>
              </div>
            </RadioGroup>
            <p className="text-sm text-muted-foreground">
              QR-Codes auf Belegen ermöglichen es Kunden, Feedback zu geben oder digitale Kopien zu erhalten.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
