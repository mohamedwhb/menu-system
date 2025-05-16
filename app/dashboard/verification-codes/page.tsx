import { VerificationCodeHelper } from "@/components/verification/verification-code-helper"

export default function VerificationCodesPage() {
  return (
    <div className="container mx-auto py-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Tischverifizierung</h1>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <VerificationCodeHelper />
        </div>
        <div className="space-y-4">
          <div className="p-6 border rounded-lg bg-white">
            <h2 className="text-lg font-semibold mb-4">Über Tischverifizierung</h2>
            <p className="mb-4">
              Die Tischverifizierung stellt sicher, dass Bestellungen dem richtigen Tisch zugeordnet werden und
              verhindert unbeabsichtigte oder betrügerische Bestellungen.
            </p>
            <h3 className="text-md font-medium mt-4 mb-2">Wie es funktioniert</h3>
            <ol className="list-decimal list-inside space-y-2 mb-4">
              <li>Jeder Tisch erhält einen eindeutigen Verifizierungscode</li>
              <li>Kunden scannen den QR-Code oder geben den Code manuell ein</li>
              <li>Das System überprüft den Code und verifiziert den Tisch</li>
              <li>Verifizierte Tische können Bestellungen aufgeben</li>
            </ol>
            <h3 className="text-md font-medium mt-4 mb-2">Verifizierungsmethoden</h3>
            <ul className="list-disc list-inside space-y-2">
              <li>Tischcode-Eingabe</li>
              <li>QR-Code-Scan</li>
              <li>Standortverifizierung</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}
