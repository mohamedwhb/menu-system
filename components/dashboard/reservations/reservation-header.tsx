"use client"

import { useState } from "react"
import { PlusCircle, Search, Filter, Download, Calendar } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { AddReservationDialog } from "@/components/dashboard/reservations/add-reservation-dialog"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"

export function ReservationHeader() {
  const [showAddDialog, setShowAddDialog] = useState(false)
  const [view, setView] = useState<"calendar" | "list">("calendar")

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-[#1F1F1F]">Reservierungen</h1>
          <p className="text-sm text-[#6B7280]">Verwalten Sie Tischreservierungen und Verfügbarkeiten</p>
        </div>

        <div className="flex flex-col sm:flex-row gap-2">
          <Button onClick={() => setShowAddDialog(true)} className="sm:order-2">
            <PlusCircle className="mr-2 h-4 w-4" />
            Neue Reservierung
          </Button>
          <Button variant="outline" className="sm:order-1">
            <Calendar className="mr-2 h-4 w-4" />
            Importieren
          </Button>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <div className="relative w-full sm:w-[300px] lg:w-[400px]">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-[#6B7280]" />
          <Input
            type="search"
            placeholder="Suchen nach Name, Telefon, Tisch..."
            className="pl-9 bg-white border-[#EAEAEA]"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto justify-between sm:justify-start">
          <Tabs value={view} onValueChange={(v) => setView(v as "calendar" | "list")} className="w-full sm:w-auto">
            <TabsList className="bg-[#F7F7F7] w-full sm:w-auto">
              <TabsTrigger value="calendar" className="flex-1 sm:flex-none data-[state=active]:bg-white">
                Kalender
              </TabsTrigger>
              <TabsTrigger value="list" className="flex-1 sm:flex-none data-[state=active]:bg-white">
                Liste
              </TabsTrigger>
            </TabsList>
          </Tabs>

          <Button variant="outline" size="icon" className="h-9 w-9">
            <Filter className="h-4 w-4" />
          </Button>
          <Button variant="outline" size="icon" className="h-9 w-9">
            <Download className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <AddReservationDialog open={showAddDialog} onOpenChange={setShowAddDialog} />
    </div>
  )
}
