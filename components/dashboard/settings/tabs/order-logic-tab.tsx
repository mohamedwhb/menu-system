import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Switch } from "@/components/ui/switch"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

export default function OrderLogicTab() {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Bestelllogik</CardTitle>
          <CardDescription>Konfigurieren Sie die Logik für Bestellungen in Ihrem Restaurant.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="group-order">Gruppenbestellung über Session-ID aktivieren</Label>
              <p className="text-sm text-muted-foreground">
                Wenn aktiviert, können mehrere Personen an einer Bestellung teilnehmen.
              </p>
            </div>
            <Switch id="group-order" defaultChecked />
          </div>

          <div className="space-y-2">
            <Label htmlFor="max-items">Maximale Artikelanzahl pro Tisch</Label>
            <Input id="max-items" type="number" defaultValue="50" min="1" />
            <p className="text-sm text-muted-foreground">
              Die maximale Anzahl von Artikeln, die pro Tisch bestellt werden können.
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="order-timeout">Timeout für Bestellungen</Label>
            <div className="flex items-center gap-2">
              <Input id="order-timeout" type="number" defaultValue="15" min="1" />
              <Select defaultValue="minutes">
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Einheit wählen" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="minutes">Minuten</SelectItem>
                  <SelectItem value="hours">Stunden</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <p className="text-sm text-muted-foreground">
              Die Zeit, nach der eine inaktive Bestellung automatisch storniert wird.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
