"use client"

import type React from "react"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { ImageIcon, UploadIcon } from "lucide-react"

export default function GeneralTab() {
  const [logo, setLogo] = useState<string | null>(null)

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (e) => {
        setLogo(e.target?.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Restaurantinformationen</CardTitle>
          <CardDescription>Grundlegende Informationen über Ihr Restaurant.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="restaurant-name">Restaurantname</Label>
              <Input id="restaurant-name" placeholder="Ihr Restaurant" defaultValue="Mein Restaurant" />
            </div>

            <div className="space-y-2">
              <Label htmlFor="uid">UID-Nummer</Label>
              <Input id="uid" placeholder="ATU12345678" defaultValue="ATU12345678" />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="address">Adresse</Label>
            <Textarea
              id="address"
              placeholder="Straße, Hausnummer, PLZ, Ort"
              defaultValue="Hauptstraße 1, 1010 Wien"
              rows={3}
            />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Öffnungszeiten</CardTitle>
          <CardDescription>Legen Sie die Öffnungszeiten Ihres Restaurants fest.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {["Montag", "Dienstag", "Mittwoch", "Donnerstag", "Freitag", "Samstag", "Sonntag"].map((day, index) => (
              <div key={index} className="grid grid-cols-[1fr_auto_1fr] items-center gap-2">
                <div className="font-medium">{day}</div>
                <div className="text-center">von</div>
                <div className="grid grid-cols-[1fr_auto_1fr] items-center gap-2">
                  <Input type="time" defaultValue="08:00" />
                  <div className="text-center">bis</div>
                  <Input type="time" defaultValue="22:00" />
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Logo</CardTitle>
          <CardDescription>Laden Sie das Logo Ihres Restaurants hoch.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col items-center space-y-4">
            <div className="border rounded-md p-4 w-full flex flex-col items-center justify-center">
              {logo ? (
                <div className="relative w-48 h-48">
                  <img
                    src={logo || "/placeholder.svg"}
                    alt="Restaurant Logo"
                    className="w-full h-full object-contain"
                  />
                  <Button
                    variant="destructive"
                    size="sm"
                    className="absolute top-0 right-0"
                    onClick={() => setLogo(null)}
                  >
                    Entfernen
                  </Button>
                </div>
              ) : (
                <div className="w-48 h-48 border-2 border-dashed rounded-md flex items-center justify-center bg-muted">
                  <ImageIcon className="h-12 w-12 text-muted-foreground" />
                </div>
              )}
            </div>

            <div className="flex items-center justify-center w-full">
              <label htmlFor="logo-upload" className="cursor-pointer">
                <div className="flex items-center justify-center">
                  <Button type="button">
                    <UploadIcon className="mr-2 h-4 w-4" />
                    Logo hochladen
                  </Button>
                </div>
                <input id="logo-upload" type="file" accept="image/*" className="hidden" onChange={handleLogoUpload} />
              </label>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
