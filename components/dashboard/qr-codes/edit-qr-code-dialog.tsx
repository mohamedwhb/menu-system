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
import { useQRCodes, type QRCodeData } from "@/contexts/qr-codes-context"
import { useToast } from "@/hooks/use-toast"

interface EditQrCodeDialogProps {
  qrCode: QRCodeData
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function EditQrCodeDialog({ qrCode, open, onOpenChange }: EditQrCodeDialogProps) {
  const { updateQRCode } = useQRCodes()
  const { toast } = useToast()

  const [tableNumber, setTableNumber] = useState("")
  const [tableName, setTableName] = useState("")
  const [description, setDescription] = useState("")
  const [url, setUrl] = useState("")
  const [isActive, setIsActive] = useState(true)
  const [logoEnabled, setLogoEnabled] = useState(false)
  const [qrColor, setQrColor] = useState("#000000")
  const [bgColor, setBgColor] = useState("#FFFFFF")

  // Initialize form when dialog opens or qrCode changes
  useEffect(() => {
    if (open && qrCode) {
      setTableNumber(qrCode.tableNumber)
      setTableName(qrCode.tableName || "")
      setDescription(qrCode.description || "")
      setUrl(qrCode.url)
      setIsActive(qrCode.active)
      setLogoEnabled(qrCode.logoEnabled || false)
      setQrColor(qrCode.qrColor || "#000000")
      setBgColor(qrCode.bgColor || "#FFFFFF")
    }
  }, [open, qrCode])

  // Update URL when table number changes
  useEffect(() => {
    if (tableNumber && open) {
      setUrl(`/menu-example?tisch=${tableNumber}`)
    }
  }, [tableNumber, open])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    try {
      updateQRCode(qrCode.id, {
        tableNumber,
        tableName,
        description,
        url,
        active: isActive,
        logoEnabled,
        qrColor,
        bgColor,
      })

      toast({
        title: "QR-Code aktualisiert",
        description: `QR-Code für ${tableName || `Tisch ${tableNumber}`} wurde erfolgreich aktualisiert.`,
      })

      onOpenChange(false)
    } catch (error) {
      toast({
        title: "Fehler",
        description: "QR-Code konnte nicht aktualisiert werden.",
        variant: "destructive",
      })
    }
  }

  const handleCancel = () => {
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] bg-white">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>QR-Code bearbeiten</DialogTitle>
            <DialogDescription>Bearbeiten Sie die Details des QR-Codes.</DialogDescription>
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
                  <Label htmlFor="edit-tableNumber">Tischnummer*</Label>
                  <Input
                    id="edit-tableNumber"
                    value={tableNumber}
                    onChange={(e) => setTableNumber(e.target.value)}
                    required
                  />
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="edit-tableName">Tischname (optional)</Label>
                  <Input id="edit-tableName" value={tableName} onChange={(e) => setTableName(e.target.value)} />
                </div>
              </div>

              <div className="grid gap-2">
                <Label htmlFor="edit-description">Beschreibung</Label>
                <Textarea
                  id="edit-description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="resize-none"
                  rows={2}
                />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="edit-url">Ziel-URL*</Label>
                <Input id="edit-url" value={url} onChange={(e) => setUrl(e.target.value)} required />
              </div>

              <div className="flex items-center justify-between">
                <Label htmlFor="edit-active" className="cursor-pointer">
                  QR-Code aktiv
                </Label>
                <Switch id="edit-active" checked={isActive} onCheckedChange={setIsActive} />
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
                <Label htmlFor="edit-logo" className="cursor-pointer">
                  Logo hinzufügen
                </Label>
                <Switch id="edit-logo" checked={logoEnabled} onCheckedChange={setLogoEnabled} />
              </div>

              {logoEnabled && (
                <div className="grid gap-2">
                  <Label>Logo hochladen</Label>
                  <Input type="file" accept="image/*" />
                  {qrCode.logo && (
                    <div className="flex items-center gap-2 mt-2">
                      <div className="w-10 h-10 bg-[#F7F7F7] rounded flex items-center justify-center">
                        <img src={qrCode.logo || "/placeholder.svg"} alt="Logo" className="max-w-full max-h-full" />
                      </div>
                      <span className="text-sm text-[#6B7280]">Aktuelles Logo</span>
                    </div>
                  )}
                </div>
              )}
            </TabsContent>

            <TabsContent value="preview" className="mt-4">
              <div className="flex flex-col items-center justify-center p-6 border border-[#EAEAEA] rounded-lg">
                <div className="p-4 bg-white border border-[#EAEAEA] rounded-lg shadow-sm mb-4">
                  <QRCode value={url} size={200} fgColor={qrColor} bgColor={bgColor} />
                </div>
                <h3 className="text-lg font-medium">{tableName || `Tisch ${tableNumber}`}</h3>
                <p className="text-sm text-[#6B7280] text-center mt-1">{description}</p>
              </div>
            </TabsContent>
          </Tabs>

          <DialogFooter className="mt-6">
            <Button type="button" variant="outline" onClick={handleCancel}>
              Abbrechen
            </Button>
            <Button type="submit">Änderungen speichern</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
