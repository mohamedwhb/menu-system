"use client"

import type React from "react"

import { useState, useRef } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Switch } from "@/components/ui/switch"
import { Button } from "@/components/ui/button"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Progress } from "@/components/ui/progress"
import { useFinanzOnline } from "@/contexts/finanzonline-context"
import {
  InfoIcon,
  CheckCircleIcon,
  AlertTriangleIcon,
  ExternalLinkIcon,
  LoaderIcon,
  XCircleIcon,
  UploadIcon,
  DownloadIcon,
  FileTextIcon,
} from "lucide-react"

export default function FinanzOnlineTab() {
  const { settings, status, updateSettings, testConnection, transmitNow, uploadCertificate, exportDEP, isLoading } =
    useFinanzOnline()

  const fileInputRef = useRef<HTMLInputElement>(null)
  const [formData, setFormData] = useState(settings)

  const handleInputChange = (field: string, value: string | boolean) => {
    const newData = { ...formData, [field]: value }
    setFormData(newData)
    updateSettings({ [field]: value })
  }

  const handleSaveSettings = () => {
    updateSettings(formData)
  }

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      await uploadCertificate(file)
    }
  }

  const formatDate = (date: Date | null) => {
    if (!date) return "Nie"
    return new Intl.DateTimeFormat("de-AT", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }).format(date)
  }

  const getStatusIcon = () => {
    if (isLoading) return <LoaderIcon className="h-5 w-5 animate-spin text-blue-500" />
    if (status.connected) return <CheckCircleIcon className="h-5 w-5 text-green-500" />
    return <XCircleIcon className="h-5 w-5 text-red-500" />
  }

  const getStatusText = () => {
    if (isLoading) return "Wird getestet..."
    if (status.connected) return "Verbindung aktiv"
    return "Verbindung getrennt"
  }

  const getStatusColor = () => {
    if (isLoading) return "text-blue-600"
    if (status.connected) return "text-green-600"
    return "text-red-600"
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            FinanzOnline Integration
            <Badge variant="outline" className="text-xs">
              Österreich
            </Badge>
            {settings.enabled && (
              <Badge variant="secondary" className="text-xs">
                Aktiv
              </Badge>
            )}
          </CardTitle>
          <CardDescription>
            Konfigurieren Sie die automatische Übermittlung von Kassendaten an das österreichische Finanzamt über
            FinanzOnline.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="finanzonline-enabled">FinanzOnline Integration aktivieren</Label>
              <p className="text-sm text-muted-foreground">
                Automatische Übermittlung der Kassendaten gemäß RKSV an das Finanzamt.
              </p>
            </div>
            <Switch
              id="finanzonline-enabled"
              checked={formData.enabled}
              onCheckedChange={(checked) => handleInputChange("enabled", checked)}
            />
          </div>

          {formData.enabled && (
            <>
              <Separator />

              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="teilnehmer-id">Teilnehmer-ID *</Label>
                  <Input
                    id="teilnehmer-id"
                    placeholder="z.B. 123456789"
                    value={formData.teilnehmerId}
                    onChange={(e) => handleInputChange("teilnehmerId", e.target.value)}
                    maxLength={9}
                  />
                  <p className="text-xs text-muted-foreground">Ihre FinanzOnline Teilnehmer-ID (9-stellig)</p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="benutzer-id">Benutzer-ID *</Label>
                  <Input
                    id="benutzer-id"
                    placeholder="Ihr FinanzOnline Benutzername"
                    value={formData.benutzerId}
                    onChange={(e) => handleInputChange("benutzerId", e.target.value)}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="pin">PIN *</Label>
                <Input
                  id="pin"
                  type="password"
                  placeholder="••••••••"
                  value={formData.pin}
                  onChange={(e) => handleInputChange("pin", e.target.value)}
                />
                <p className="text-xs text-muted-foreground">Ihre FinanzOnline PIN (wird verschlüsselt gespeichert)</p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="kassen-id">Kassen-Identifikationsnummer *</Label>
                <Input
                  id="kassen-id"
                  placeholder="z.B. DEMO-CASH-BOX123"
                  value={formData.kassenId}
                  onChange={(e) => handleInputChange("kassenId", e.target.value)}
                />
                <p className="text-xs text-muted-foreground">Eindeutige Identifikation Ihrer Registrierkasse</p>
              </div>

              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={testConnection}
                  disabled={isLoading || !formData.teilnehmerId || !formData.benutzerId}
                >
                  {isLoading ? <LoaderIcon className="h-4 w-4 animate-spin mr-2" /> : null}
                  Verbindung testen
                </Button>
                <Button variant="outline" size="sm" onClick={() => fileInputRef.current?.click()} disabled={isLoading}>
                  <UploadIcon className="h-4 w-4 mr-2" />
                  Zertifikat hochladen
                </Button>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept=".p12,.pfx"
                  onChange={handleFileUpload}
                  className="hidden"
                />
              </div>
            </>
          )}
        </CardContent>
      </Card>

      {formData.enabled && (
        <Card>
          <CardHeader>
            <CardTitle>RKSV Einstellungen</CardTitle>
            <CardDescription>
              Registrierkassensicherheitsverordnung - Spezifische Einstellungen für Österreich
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="aes-key">AES-Schlüssel</Label>
                <Input
                  id="aes-key"
                  type="password"
                  placeholder="••••••••••••••••••••••••••••••••"
                  value={formData.aesKey}
                  onChange={(e) => handleInputChange("aesKey", e.target.value)}
                />
                <p className="text-xs text-muted-foreground">256-Bit AES-Schlüssel für die Datenverschlüsselung</p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="signature-device">Signaturerstellungseinheit</Label>
                <Input
                  id="signature-device"
                  placeholder="z.B. Smartcard, HSM"
                  value={formData.signatureDevice}
                  onChange={(e) => handleInputChange("signatureDevice", e.target.value)}
                />
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="dep-export">DEP-Export aktivieren</Label>
                <p className="text-sm text-muted-foreground">
                  Automatischer Export der Datenerfassungsprotokoll-Dateien
                </p>
              </div>
              <Switch
                id="dep-export"
                checked={formData.depExport}
                onCheckedChange={(checked) => handleInputChange("depExport", checked)}
              />
            </div>

            {formData.depExport && (
              <div className="space-y-2">
                <Label htmlFor="export-path">Export-Pfad für DEP-Dateien</Label>
                <div className="flex gap-2">
                  <Input
                    id="export-path"
                    placeholder="/pfad/zu/dep/dateien"
                    value={formData.exportPath}
                    onChange={(e) => handleInputChange("exportPath", e.target.value)}
                    className="flex-1"
                  />
                  <Button variant="outline" size="sm" onClick={exportDEP} disabled={isLoading}>
                    <DownloadIcon className="h-4 w-4 mr-2" />
                    Jetzt exportieren
                  </Button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {formData.enabled && (
        <Card>
          <CardHeader>
            <CardTitle>Status & Übermittlung</CardTitle>
            <CardDescription>Aktueller Status der FinanzOnline-Verbindung und letzte Übermittlungen</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center gap-2">
              {getStatusIcon()}
              <span className={`text-sm font-medium ${getStatusColor()}`}>{getStatusText()}</span>
              <Badge variant="secondary" className="text-xs">
                Letzter Test: {formatDate(status.lastTest)}
              </Badge>
            </div>

            <Separator />

            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm">Letzte Übermittlung:</span>
                <span className="text-sm text-muted-foreground">{formatDate(status.lastTransmission)}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm">Übermittelte Belege heute:</span>
                <span className="text-sm font-medium">{status.transmittedToday}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm">Ausstehende Übermittlungen:</span>
                <Badge variant={status.pendingTransmissions > 0 ? "destructive" : "secondary"}>
                  {status.pendingTransmissions}
                </Badge>
              </div>

              {status.pendingTransmissions > 0 && (
                <div className="space-y-2">
                  <div className="flex justify-between text-xs text-muted-foreground">
                    <span>Übermittlungsfortschritt</span>
                    <span>
                      {Math.round(
                        (status.transmittedToday / (status.transmittedToday + status.pendingTransmissions)) * 100,
                      )}
                      %
                    </span>
                  </div>
                  <Progress
                    value={(status.transmittedToday / (status.transmittedToday + status.pendingTransmissions)) * 100}
                    className="h-2"
                  />
                </div>
              )}
            </div>

            <div className="flex gap-2">
              <Button
                size="sm"
                onClick={transmitNow}
                disabled={isLoading || !status.connected || status.pendingTransmissions === 0}
              >
                {isLoading ? <LoaderIcon className="h-4 w-4 animate-spin mr-2" /> : null}
                Jetzt übermitteln ({status.pendingTransmissions})
              </Button>
              <Button variant="outline" size="sm">
                <FileTextIcon className="h-4 w-4 mr-2" />
                Übermittlungslog anzeigen
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      <Alert>
        <InfoIcon className="h-4 w-4" />
        <AlertTitle>Wichtige Hinweise</AlertTitle>
        <AlertDescription className="space-y-2">
          <p>
            • Die FinanzOnline-Integration ist für alle österreichischen Unternehmen mit Registrierkassen verpflichtend.
          </p>
          <p>• Kassendaten müssen spätestens am 15. des Folgemonats übermittelt werden.</p>
          <p>
            • Bei technischen Problemen wenden Sie sich an den{" "}
            <a
              href="https://www.bmf.gv.at/services/anwend/finanzonline/"
              target="_blank"
              rel="noopener noreferrer"
              className="font-medium underline underline-offset-4 inline-flex items-center gap-1"
            >
              FinanzOnline Support
              <ExternalLinkIcon className="h-3 w-3" />
            </a>
          </p>
        </AlertDescription>
      </Alert>

      <Alert>
        <AlertTriangleIcon className="h-4 w-4" />
        <AlertTitle>Datenschutz</AlertTitle>
        <AlertDescription>
          Alle übermittelten Daten werden gemäß DSGVO und österreichischem Datenschutzrecht behandelt. Die
          Verschlüsselung erfolgt nach aktuellen Sicherheitsstandards.
        </AlertDescription>
      </Alert>
    </div>
  )
}
