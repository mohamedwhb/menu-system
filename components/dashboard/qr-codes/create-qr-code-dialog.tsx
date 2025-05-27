"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { QRCode } from "react-qr-code"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ColorPicker } from "@/components/dashboard/qr-codes/color-picker"
import { useQRCodes } from "@/contexts/qr-codes-context"
import { toast } from "@/hooks/use-toast"

interface CreateQrCodeDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function CreateQrCodeDialog({ open, onOpenChange }: CreateQrCodeDialogProps) {
  const { addQRCode } = useQRCodes()
  const [tableNumber, setTableNumber] = useState("")
  const [tableName, setTableName] = useState("")
  const [description, setDescription] = useState("Scannen Sie den QR-Code, um unser digitales Menü zu öffnen")
  const [url, setUrl] = useState("/menu-example?tisch=")
  const [isActive, setIsActive] = useState(true)
  const [logoEnabled, setLogoEnabled] = useState(false)
  const [qrColor, setQrColor] = useState("#000000")
  const [bgColor, setBgColor] = useState("#FFFFFF")

  useEffect(() => {
    if (tableNumber) {
      setUrl(`/menu-example?tisch=${tableNumber}`)
    } else {
      setUrl("/menu-example?tisch=")
    }
  }, [tableNumber])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (!tableNumber) {
      toast({
        title: "Fehler",
        description: "Bitte geben Sie eine Tischnummer ein.",
        variant: "destructive",
      })
      return
    }

    // Add the new QR code
    addQRCode({
      tableNumber,
      tableName,
      description,
      url,
      active: isActive,
      qrColor,
      bgColor,
      logoEnabled,
    })

    toast({
      title: "QR-Code erstellt",
      description: `QR-Code für Tisch ${tableNumber} wurde erfolgreich erstellt.`,
    })

    // Reset form
    setTableNumber("")
    setTableName("")
    setDescription("Scannen Sie den QR-Code, um unser digitales Menü zu öffnen")
    setUrl("/menu-example?tisch=")
    setIsActive(true)
    setLogoEnabled(false)
    setQrColor("#000000")
    setBgColor("#FFFFFF")

    onOpenChange(false)
  }

  const handleTestUrl = () => {
    if (url && tableNumber) {
      window.open(url, "_blank")
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] bg-white">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>Neuen QR-Code erstellen</DialogTitle>
            <DialogDescription>Erstellen Sie einen QR-Code für einen Tisch in Ihrem Restaurant.</DialogDescription>
          </DialogHeader>

          <Tabs defaultValue="details" className="mt-4">
            <TabsList className="bg-[#F7F7F7] w-full">
              <TabsTrigger value="details" className="flex-1 data-[state=active]:bg-white">
                Details
              </TabsTrigger>
              <TabsTrigger value="design" className="flex-1 data-[state=active]:bg-white">
                Design
              </TabsTrigger>
              <TabsTrigger value="preview" className="flex-1 data-[state=active]:bg-white">
                Vorschau
              </TabsTrigger>
            </TabsList>

            <TabsContent value="details" className="mt-4 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="tableNumber">Tischnummer*</Label>
                  <Input
                    id="tableNumber"
                    value={tableNumber}
                    onChange={(e) => setTableNumber(e.target.value)}
                    placeholder="z.B. 1, 2, 3..."
                    required
                  />
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="tableName">Tischname (optional)</Label>
                  <Input
                    id="tableName"
                    value={tableName}
                    onChange={(e) => setTableName(e.target.value)}
                    placeholder="z.B. Terrasse 1"
                  />
                </div>
              </div>

              <div className="grid gap-2">
                <Label htmlFor="description">Beschreibung</Label>
                <Textarea
                  id="description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Kurze Beschreibung für den QR-Code"
                  className="resize-none"
                  rows={2}
                />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="url">Ziel-URL*</Label>
                <div className="flex gap-2">
                  <Input
                    id="url"
                    value={url}
                    onChange={(e) => setUrl(e.target.value)}
                    placeholder="/menu-example?tisch=1"
                    required
                    className="flex-1"
                  />
                  <Button type="button" variant="outline" onClick={handleTestUrl} disabled={!tableNumber}>
                    Testen
                  </Button>
                </div>
                <p className="text-xs text-[#6B7280]">
                  Dies ist die URL, zu der Benutzer weitergeleitet werden, wenn sie den QR-Code scannen.
                </p>
              </div>

              <div className="flex items-center justify-between">
                <Label htmlFor="active" className="cursor-pointer">
                  QR-Code aktiv
                </Label>
                <Switch id="active" checked={isActive} onCheckedChange={setIsActive} />
              </div>
            </TabsContent>

            <TabsContent value="design" className="mt-4 space-y-4">
              <div className="grid gap-2">
                <Label>QR-Code Farbe</Label>
                <ColorPicker color={qrColor} onChange={setQrColor} />
              </div>

              <div className="grid gap-2">
                <Label>Hintergrund Farbe</Label>
                <ColorPicker color={bgColor} onChange={setBgColor} />
              </div>

              <div className="flex items-center justify-between">
                <Label htmlFor="logo" className="cursor-pointer">
                  Logo hinzufügen
                </Label>
                <Switch id="logo" checked={logoEnabled} onCheckedChange={setLogoEnabled} />
              </div>

              {logoEnabled && (
                <div className="grid gap-2">
                  <Label>Logo hochladen</Label>
                  <Input type="file" accept="image/*" />
                  <p className="text-xs text-[#6B7280]">
                    Für beste Ergebnisse verwenden Sie ein quadratisches Logo mit transparentem Hintergrund.
                  </p>
                </div>
              )}
            </TabsContent>

            <TabsContent value="preview" className="mt-4">
              <div className="flex flex-col items-center justify-center p-6 border border-[#EAEAEA] rounded-lg">
                <div className="p-4 bg-white border border-[#EAEAEA] rounded-lg shadow-sm mb-4">
                  <QRCode value={url || "/menu-example?tisch=1"} size={200} fgColor={qrColor} bgColor={bgColor} />
                </div>
                <h3 className="text-lg font-medium">
                  {tableName || tableNumber ? `Tisch ${tableNumber}` : "Tisch Vorschau"}
                </h3>
                <p className="text-sm text-[#6B7280] text-center mt-1 mb-2">{description}</p>
                <p className="text-xs text-[#9CA3AF] text-center font-mono">{url}</p>
              </div>
            </TabsContent>
          </Tabs>

          <DialogFooter className="mt-6">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Abbrechen
            </Button>
            <Button type="submit">QR-Code erstellen</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
