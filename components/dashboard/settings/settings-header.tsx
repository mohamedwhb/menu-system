import { Button } from "@/components/ui/button"
import { SaveIcon } from "lucide-react"

export default function SettingsHeader() {
  return (
    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Einstellungen</h1>
        <p className="text-muted-foreground">Verwalten Sie die Einstellungen für Ihr Restaurant.</p>
      </div>
      <Button className="ml-auto">
        <SaveIcon className="mr-2 h-4 w-4" />
        Änderungen speichern
      </Button>
    </div>
  )
}
