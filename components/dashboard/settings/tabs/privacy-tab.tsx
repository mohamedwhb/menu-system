import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Checkbox } from "@/components/ui/checkbox"
import { Textarea } from "@/components/ui/textarea"
import { Input } from "@/components/ui/input"

export default function PrivacyTab() {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>DSGVO & Tracking</CardTitle>
          <CardDescription>
            Konfigurieren Sie die Datenschutz- und Tracking-Einstellungen für Ihr Restaurant.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="google-analytics">Google Analytics aktivieren</Label>
              <p className="text-sm text-muted-foreground">
                Wenn aktiviert, wird Google Analytics verwendet, um Besucher zu verfolgen.
              </p>
            </div>
            <Switch id="google-analytics" />
          </div>

          <div className="space-y-2">
            <Label htmlFor="ga-id">Google Analytics ID</Label>
            <Input id="ga-id" placeholder="G-XXXXXXXXXX" />
            <p className="text-sm text-muted-foreground">Ihre Google Analytics Tracking-ID.</p>
          </div>

          <div className="flex items-start space-x-2">
            <Checkbox id="cookie-consent" defaultChecked />
            <div className="grid gap-1.5 leading-none">
              <Label
                htmlFor="cookie-consent"
                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              >
                Cookie-Zustimmung aktiv verlangen
              </Label>
              <p className="text-sm text-muted-foreground">
                Wenn aktiviert, müssen Benutzer der Verwendung von Cookies zustimmen, bevor sie die Website nutzen
                können.
              </p>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="privacy-text">Hinweistext zur Datenschutzerklärung</Label>
            <Textarea
              id="privacy-text"
              rows={6}
              defaultValue="Wir verwenden Cookies, um Ihnen die bestmögliche Erfahrung auf unserer Website zu bieten. Durch die Nutzung unserer Website stimmen Sie der Verwendung von Cookies gemäß unserer Datenschutzerklärung zu."
            />
            <p className="text-sm text-muted-foreground">
              Dieser Text wird in der Cookie-Zustimmungsmeldung angezeigt.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
