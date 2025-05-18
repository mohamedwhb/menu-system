"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { Minus, Plus, Move, Square, Circle, RotateCw, Trash2, CuboidIcon as Cube, LayoutGrid } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { cn } from "@/lib/utils"
import { floorPlans } from "@/data/floor-plans"
import { TableDetailsPopover } from "@/components/dashboard/floor-plan/table-details-popover"
import { FloorSelector } from "@/components/dashboard/floor-plan/floor-selector"
import { RoomSelector } from "@/components/dashboard/floor-plan/room-selector"
import { FloorPlan3DView } from "@/components/dashboard/floor-plan/floor-plan-3d-view"

type TableShape = "square" | "rectangle" | "circle" | "oval"
type TableStatus = "available" | "reserved" | "occupied"

interface Table {
  id: string
  x: number
  y: number
  width: number
  height: number
  shape: TableShape
  number: string
  seats: number
  status: TableStatus
  rotation: number
  reservationId?: string
}

interface Wall {
  id: string
  x1: number
  y1: number
  x2: number
  y2: number
  type: "wall" | "window" | "door"
}

interface Room {
  id: string
  name: string
  tables: Table[]
  walls: Wall[]
}

interface Floor {
  id: string
  name: string
  level: number
  rooms: Room[]
}

interface FloorPlanData {
  id: string
  name: string
  floors: Floor[]
}

interface FloorPlanEditorProps {
  initialPlanId: string
}

export function FloorPlanEditor({ initialPlanId }: FloorPlanEditorProps) {
  const [zoom, setZoom] = useState(1)
  const [mode, setMode] = useState<"select" | "move" | "add-square" | "add-circle">("select")
  const [selectedTable, setSelectedTable] = useState<Table | null>(null)
  const [showTableDetails, setShowTableDetails] = useState(false)
  const [floorPlan, setFloorPlan] = useState<FloorPlanData | null>(null)
  const [isDragging, setIsDragging] = useState(false)
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 })
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 })
  const [selectedFloorId, setSelectedFloorId] = useState<string>("")
  const [selectedRoomId, setSelectedRoomId] = useState<string>("")
  const [viewMode, setViewMode] = useState<"2d" | "3d">("2d")

  const containerRef = useRef<HTMLDivElement>(null)

  // Load floor plan data
  useEffect(() => {
    const plan = floorPlans.find((p) => p.id === initialPlanId) || floorPlans[0]
    setFloorPlan(plan)

    // Set default selected floor and room
    if (plan && plan.floors.length > 0) {
      setSelectedFloorId(plan.floors[0].id)

      if (plan.floors[0].rooms.length > 0) {
        setSelectedRoomId(plan.floors[0].rooms[0].id)
      }
    }
  }, [initialPlanId])

  const handleZoomIn = () => {
    setZoom((prev) => Math.min(prev + 0.1, 2))
  }

  const handleZoomOut = () => {
    setZoom((prev) => Math.max(prev - 0.1, 0.5))
  }

  const handleTableClick = (table: Table, e: React.MouseEvent) => {
    e.stopPropagation()
    setSelectedTable(table)
    setShowTableDetails(true)
  }

  const handleCanvasClick = () => {
    setSelectedTable(null)
    setShowTableDetails(false)

    if (!floorPlan || !selectedFloorId || !selectedRoomId) return

    const selectedFloor = floorPlan.floors.find((f) => f.id === selectedFloorId)
    if (!selectedFloor) return

    const selectedRoom = selectedFloor.rooms.find((r) => r.id === selectedRoomId)
    if (!selectedRoom) return

    if (mode === "add-square") {
      const newTable: Table = {
        id: `table-${Date.now()}`,
        x: 200,
        y: 200,
        width: 80,
        height: 80,
        shape: "square",
        number: `${selectedRoom.tables.length + 1}`,
        seats: 4,
        status: "available",
        rotation: 0,
      }

      // Update the room's tables
      const updatedRooms = selectedFloor.rooms.map((room) => {
        if (room.id === selectedRoomId) {
          return {
            ...room,
            tables: [...room.tables, newTable],
          }
        }
        return room
      })

      // Update the floor's rooms
      const updatedFloors = floorPlan.floors.map((floor) => {
        if (floor.id === selectedFloorId) {
          return {
            ...floor,
            rooms: updatedRooms,
          }
        }
        return floor
      })

      // Update the floor plan
      setFloorPlan({
        ...floorPlan,
        floors: updatedFloors,
      })

      setSelectedTable(newTable)
      setMode("select")
    } else if (mode === "add-circle") {
      const newTable: Table = {
        id: `table-${Date.now()}`,
        x: 200,
        y: 200,
        width: 80,
        height: 80,
        shape: "circle",
        number: `${selectedRoom.tables.length + 1}`,
        seats: 4,
        status: "available",
        rotation: 0,
      }

      // Update the room's tables
      const updatedRooms = selectedFloor.rooms.map((room) => {
        if (room.id === selectedRoomId) {
          return {
            ...room,
            tables: [...room.tables, newTable],
          }
        }
        return room
      })

      // Update the floor's rooms
      const updatedFloors = floorPlan.floors.map((floor) => {
        if (floor.id === selectedFloorId) {
          return {
            ...floor,
            rooms: updatedRooms,
          }
        }
        return floor
      })

      // Update the floor plan
      setFloorPlan({
        ...floorPlan,
        floors: updatedFloors,
      })

      setSelectedTable(newTable)
      setMode("select")
    }
  }

  const handleMouseDown = (e: React.MouseEvent, table: Table) => {
    if (mode === "move") {
      e.stopPropagation()
      setIsDragging(true)
      setDragStart({ x: e.clientX, y: e.clientY })
      setSelectedTable(table)
    }
  }

  const handleMouseMove = (e: React.MouseEvent) => {
    if (isDragging && selectedTable && mode === "move") {
      const dx = (e.clientX - dragStart.x) / zoom
      const dy = (e.clientY - dragStart.y) / zoom

      setDragOffset({ x: dx, y: dy })
    }
  }

  const handleMouseUp = () => {
    if (isDragging && selectedTable && floorPlan && selectedFloorId && selectedRoomId) {
      const selectedFloor = floorPlan.floors.find((f) => f.id === selectedFloorId)
      if (!selectedFloor) return

      const selectedRoom = selectedFloor.rooms.find((r) => r.id === selectedRoomId)
      if (!selectedRoom) return

      // Update the table position in the selected room
      const updatedTables = selectedRoom.tables.map((table) => {
        if (table.id === selectedTable.id) {
          return {
            ...table,
            x: table.x + dragOffset.x,
            y: table.y + dragOffset.y,
          }
        }
        return table
      })

      // Update the room's tables
      const updatedRooms = selectedFloor.rooms.map((room) => {
        if (room.id === selectedRoomId) {
          return {
            ...room,
            tables: updatedTables,
          }
        }
        return room
      })

      // Update the floor's rooms
      const updatedFloors = floorPlan.floors.map((floor) => {
        if (floor.id === selectedFloorId) {
          return {
            ...floor,
            rooms: updatedRooms,
          }
        }
        return floor
      })

      // Update the floor plan
      setFloorPlan({
        ...floorPlan,
        floors: updatedFloors,
      })

      setIsDragging(false)
      setDragOffset({ x: 0, y: 0 })
    }
  }

  const handleRotateTable = () => {
    if (selectedTable && floorPlan && selectedFloorId && selectedRoomId) {
      const selectedFloor = floorPlan.floors.find((f) => f.id === selectedFloorId)
      if (!selectedFloor) return

      const selectedRoom = selectedFloor.rooms.find((r) => r.id === selectedRoomId)
      if (!selectedRoom) return

      // Update the table rotation in the selected room
      const updatedTables = selectedRoom.tables.map((table) => {
        if (table.id === selectedTable.id) {
          return {
            ...table,
            rotation: (table.rotation + 45) % 360,
          }
        }
        return table
      })

      // Update the room's tables
      const updatedRooms = selectedFloor.rooms.map((room) => {
        if (room.id === selectedRoomId) {
          return {
            ...room,
            tables: updatedTables,
          }
        }
        return room
      })

      // Update the floor's rooms
      const updatedFloors = floorPlan.floors.map((floor) => {
        if (floor.id === selectedFloorId) {
          return {
            ...floor,
            rooms: updatedRooms,
          }
        }
        return floor
      })

      // Update the floor plan
      setFloorPlan({
        ...floorPlan,
        floors: updatedFloors,
      })
    }
  }

  const handleDeleteTable = () => {
    if (selectedTable && floorPlan && selectedFloorId && selectedRoomId) {
      const selectedFloor = floorPlan.floors.find((f) => f.id === selectedFloorId)
      if (!selectedFloor) return

      const selectedRoom = selectedFloor.rooms.find((r) => r.id === selectedRoomId)
      if (!selectedRoom) return

      // Filter out the selected table
      const updatedTables = selectedRoom.tables.filter((table) => table.id !== selectedTable.id)

      // Update the room's tables
      const updatedRooms = selectedFloor.rooms.map((room) => {
        if (room.id === selectedRoomId) {
          return {
            ...room,
            tables: updatedTables,
          }
        }
        return room
      })

      // Update the floor's rooms
      const updatedFloors = floorPlan.floors.map((floor) => {
        if (floor.id === selectedFloorId) {
          return {
            ...floor,
            rooms: updatedRooms,
          }
        }
        return floor
      })

      // Update the floor plan
      setFloorPlan({
        ...floorPlan,
        floors: updatedFloors,
      })

      setSelectedTable(null)
      setShowTableDetails(false)
    }
  }

  const getTableColor = (status: TableStatus) => {
    switch (status) {
      case "available":
        return "bg-[#DCFCE7] border-[#16A34A]"
      case "reserved":
        return "bg-[#FEF9C3] border-[#CA8A04]"
      case "occupied":
        return "bg-[#FEE2E2] border-[#DC2626]"
      default:
        return "bg-[#F3F4F6] border-[#6B7280]"
    }
  }

  // Get the current room data
  const getCurrentRoom = () => {
    if (!floorPlan || !selectedFloorId || !selectedRoomId) return null

    const selectedFloor = floorPlan.floors.find((f) => f.id === selectedFloorId)
    if (!selectedFloor) return null

    return selectedFloor.rooms.find((r) => r.id === selectedRoomId) || null
  }

  const currentRoom = getCurrentRoom()

  if (!floorPlan) {
    return <div className="flex items-center justify-center h-full">Lädt Tischplan...</div>
  }

  return (
    <div className="h-full flex flex-col">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          {viewMode === "2d" && (
            <>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="outline"
                      size="icon"
                      className={cn("h-8 w-8", mode === "select" && "bg-[#F0F7FF] text-[#006AFF]")}
                      onClick={() => setMode("select")}
                    >
                      <Move className="h-4 w-4" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>Auswählen</TooltipContent>
                </Tooltip>
              </TooltipProvider>

              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="outline"
                      size="icon"
                      className={cn("h-8 w-8", mode === "move" && "bg-[#F0F7FF] text-[#006AFF]")}
                      onClick={() => setMode("move")}
                    >
                      <Move className="h-4 w-4" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>Verschieben</TooltipContent>
                </Tooltip>
              </TooltipProvider>

              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="outline"
                      size="icon"
                      className={cn("h-8 w-8", mode === "add-square" && "bg-[#F0F7FF] text-[#006AFF]")}
                      onClick={() => setMode("add-square")}
                    >
                      <Square className="h-4 w-4" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>Eckigen Tisch hinzufügen</TooltipContent>
                </Tooltip>
              </TooltipProvider>

              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="outline"
                      size="icon"
                      className={cn("h-8 w-8", mode === "add-circle" && "bg-[#F0F7FF] text-[#006AFF]")}
                      onClick={() => setMode("add-circle")}
                    >
                      <Circle className="h-4 w-4" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>Runden Tisch hinzufügen</TooltipContent>
                </Tooltip>
              </TooltipProvider>

              {selectedTable && (
                <>
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button variant="outline" size="icon" className="h-8 w-8" onClick={handleRotateTable}>
                          <RotateCw className="h-4 w-4" />
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>Tisch drehen</TooltipContent>
                    </Tooltip>
                  </TooltipProvider>

                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button variant="outline" size="icon" className="h-8 w-8" onClick={handleDeleteTable}>
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>Tisch löschen</TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </>
              )}
            </>
          )}

          <div className="h-6 border-r border-[#EAEAEA] mx-2"></div>

          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="outline"
                  size="icon"
                  className={cn("h-8 w-8", viewMode === "2d" && "bg-[#F0F7FF] text-[#006AFF]")}
                  onClick={() => setViewMode("2d")}
                >
                  <LayoutGrid className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>2D Ansicht</TooltipContent>
            </Tooltip>
          </TooltipProvider>

          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="outline"
                  size="icon"
                  className={cn("h-8 w-8", viewMode === "3d" && "bg-[#F0F7FF] text-[#006AFF]")}
                  onClick={() => setViewMode("3d")}
                >
                  <Cube className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>3D Ansicht</TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>

        <div className="flex items-center gap-2">
          {viewMode === "2d" && (
            <>
              <Button variant="outline" size="icon" className="h-8 w-8" onClick={handleZoomOut}>
                <Minus className="h-4 w-4" />
              </Button>
              <span className="text-sm">{Math.round(zoom * 100)}%</span>
              <Button variant="outline" size="icon" className="h-8 w-8" onClick={handleZoomIn}>
                <Plus className="h-4 w-4" />
              </Button>
            </>
          )}
        </div>
      </div>

      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-4">
          <FloorSelector
            floors={floorPlan.floors}
            selectedFloorId={selectedFloorId}
            onSelectFloor={setSelectedFloorId}
          />

          <RoomSelector
            rooms={floorPlan.floors.find((f) => f.id === selectedFloorId)?.rooms || []}
            selectedRoomId={selectedRoomId}
            onSelectRoom={setSelectedRoomId}
          />
        </div>
      </div>

      {viewMode === "3d" ? (
        <div className="flex-1 border border-[#EAEAEA] rounded-md overflow-hidden bg-[#F9FAFB] relative">
          <FloorPlan3DView floorPlan={floorPlan} selectedFloorId={selectedFloorId} selectedRoomId={selectedRoomId} />
        </div>
      ) : (
        <div
          className="flex-1 border border-[#EAEAEA] rounded-md overflow-auto bg-[#F9FAFB] relative"
          ref={containerRef}
          onClick={handleCanvasClick}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseUp}
        >
          {currentRoom ? (
            <div
              className="absolute"
              style={{
                transform: `scale(${zoom})`,
                transformOrigin: "0 0",
                width: "100%",
                height: "100%",
              }}
            >
              {/* Walls */}
              {currentRoom.walls.map((wall) => (
                <div
                  key={wall.id}
                  className={cn(
                    "absolute bg-[#1F1F1F]",
                    wall.type === "window" && "bg-[#A5F3FC] opacity-30",
                    wall.type === "door" && "bg-transparent border-2 border-dashed border-[#1F1F1F]",
                  )}
                  style={{
                    left: Math.min(wall.x1, wall.x2),
                    top: Math.min(wall.y1, wall.y2),
                    width: Math.abs(wall.x2 - wall.x1) || 4,
                    height: Math.abs(wall.y2 - wall.y1) || 4,
                  }}
                />
              ))}

              {/* Tables */}
              {currentRoom.tables.map((table) => {
                const isSelected = selectedTable?.id === table.id
                const tableX = isDragging && isSelected ? table.x + dragOffset.x : table.x
                const tableY = isDragging && isSelected ? table.y + dragOffset.y : table.y

                return (
                  <div
                    key={table.id}
                    className={cn(
                      "absolute flex items-center justify-center border-2 cursor-pointer transition-shadow",
                      getTableColor(table.status),
                      isSelected && "ring-2 ring-[#006AFF]",
                      table.shape === "circle" || table.shape === "oval" ? "rounded-full" : "rounded-md",
                    )}
                    style={{
                      left: tableX,
                      top: tableY,
                      width: table.width,
                      height: table.height,
                      transform: `rotate(${table.rotation}deg)`,
                    }}
                    onClick={(e) => handleTableClick(table, e)}
                    onMouseDown={(e) => handleMouseDown(e, table)}
                  >
                    <div className="text-center">
                      <div className="font-medium">{table.number}</div>
                      <div className="text-xs">{table.seats} Plätze</div>
                    </div>
                  </div>
                )
              })}
            </div>
          ) : (
            <div className="flex items-center justify-center h-full text-[#6B7280]">
              Bitte wählen Sie eine Etage und einen Raum aus
            </div>
          )}
        </div>
      )}

      {selectedTable && showTableDetails && viewMode === "2d" && (
        <TableDetailsPopover
          table={selectedTable}
          onClose={() => setShowTableDetails(false)}
          onUpdate={(updatedTable) => {
            if (floorPlan && selectedFloorId && selectedRoomId) {
              const selectedFloor = floorPlan.floors.find((f) => f.id === selectedFloorId)
              if (!selectedFloor) return

              const selectedRoom = selectedFloor.rooms.find((r) => r.id === selectedRoomId)
              if (!selectedRoom) return

              // Update the table in the selected room
              const updatedTables = selectedRoom.tables.map((t) => (t.id === updatedTable.id ? updatedTable : t))

              // Update the room's tables
              const updatedRooms = selectedFloor.rooms.map((room) => {
                if (room.id === selectedRoomId) {
                  return {
                    ...room,
                    tables: updatedTables,
                  }
                }
                return room
              })

              // Update the floor's rooms
              const updatedFloors = floorPlan.floors.map((floor) => {
                if (floor.id === selectedFloorId) {
                  return {
                    ...floor,
                    rooms: updatedRooms,
                  }
                }
                return floor
              })

              // Update the floor plan
              setFloorPlan({
                ...floorPlan,
                floors: updatedFloors,
              })

              setSelectedTable(updatedTable)
            }
          }}
        />
      )}
    </div>
  )
}
