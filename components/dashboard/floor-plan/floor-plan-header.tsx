"use client"

import { useState } from "react"
import { Save, Share2, Plus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { SaveLayoutDialog } from "@/components/dashboard/floor-plan/save-layout-dialog"
import { AddRoomDialog } from "@/components/dashboard/floor-plan/add-room-dialog"
import { AddFloorDialog } from "@/components/dashboard/floor-plan/add-floor-dialog"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"

export function FloorPlanHeader() {
  const [mode, setMode] = useState<"view" | "edit">("view")
  const [showSaveDialog, setShowSaveDialog] = useState(false)
  const [showAddRoomDialog, setShowAddRoomDialog] = useState(false)
  const [showAddFloorDialog, setShowAddFloorDialog] = useState(false)

  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-[#1F1F1F]">Tischplan</h1>
        <p className="text-sm text-[#6B7280]">Verwalten Sie Ihr Restaurant-Layout und Tischreservierungen</p>
      </div>

      <div className="flex items-center gap-2">
        <Tabs value={mode} onValueChange={(v) => setMode(v as "view" | "edit")} className="mr-2">
          <TabsList className="bg-[#F7F7F7]">
            <TabsTrigger value="view" className="data-[state=active]:bg-white">
              Ansicht
            </TabsTrigger>
            <TabsTrigger value="edit" className="data-[state=active]:bg-white">
              Bearbeiten
            </TabsTrigger>
          </TabsList>
        </Tabs>

        {mode === "edit" && (
          <>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline">
                  <Plus className="mr-2 h-4 w-4" />
                  Hinzufügen
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="bg-white border-[#EAEAEA]">
                <DropdownMenuItem onClick={() => setShowAddRoomDialog(true)}>Raum hinzufügen</DropdownMenuItem>
                <DropdownMenuItem onClick={() => setShowAddFloorDialog(true)}>Etage hinzufügen</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            <Button onClick={() => setShowSaveDialog(true)}>
              <Save className="mr-2 h-4 w-4" />
              Layout speichern
            </Button>
          </>
        )}

        <Button variant="outline">
          <Share2 className="mr-2 h-4 w-4" />
          Teilen
        </Button>
      </div>

      <SaveLayoutDialog open={showSaveDialog} onOpenChange={setShowSaveDialog} />
      <AddRoomDialog open={showAddRoomDialog} onOpenChange={setShowAddRoomDialog} />
      <AddFloorDialog open={showAddFloorDialog} onOpenChange={setShowAddFloorDialog} />
    </div>
  )
}
