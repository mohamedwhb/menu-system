import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Switch } from "@/components/ui/switch"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { InfoIcon } from "lucide-react"

export default function TaxTab() {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Umsatzsteuereinstellungen</CardTitle>
          <CardDescription>Konfigurieren Sie die Umsatzsteuereinstellungen für Ihr Restaurant.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="show-tax">Preise inkl. USt anzeigen</Label>
              <p className="text-sm text-muted-foreground">
                Wenn aktiviert, werden alle Preise inklusive Umsatzsteuer angezeigt.
              </p>
            </div>
            <Switch id="show-tax" defaultChecked />
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="food-tax">Mehrwertsteuer für Speisen (%)</Label>
              <Input id="food-tax" type="number" defaultValue="10" min="0" max="100" />
            </div>

            <div className="space-y-2">
              <Label htmlFor="drink-tax">Mehrwertsteuer für Getränke (%)</Label>
              <Input id="drink-tax" type="number" defaultValue="20" min="0" max="100" />
            </div>
          </div>
        </CardContent>
      </Card>

      <Alert>
        <InfoIcon className="h-4 w-4" />
        <AlertTitle>Information</AlertTitle>
        <AlertDescription>
          Diese Einstellungen entsprechen der österreichischen Registrierkassensicherheitsverordnung (RKSV). Für weitere
          Informationen besuchen Sie bitte die{" "}
          <a
            href="https://www.bmf.gv.at/themen/steuern/selbststaendige-unternehmer/registrierkassen.html"
            target="_blank"
            rel="noopener noreferrer"
            className="font-medium underline underline-offset-4"
          >
            offizielle Website des Bundesministeriums für Finanzen
          </a>
          .
        </AlertDescription>
      </Alert>
    </div>
  )
}
