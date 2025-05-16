"use client"

import type React from "react"
import { cn } from "@/lib/utils"

interface FloorPlan2DFallbackProps {
  room: any
  zoom: number
  selectedTable: any
  isDragging: boolean
  dragOffset: { x: number; y: number }
  onTableClick: (table: any, e: React.MouseEvent) => void
  onMouseDown: (e: React.MouseEvent, table: any) => void
}

export function FloorPlan2DFallback({
  room,
  zoom,
  selectedTable,
  isDragging,
  dragOffset,
  onTableClick,
  onMouseDown,
}: FloorPlan2DFallbackProps) {
  const getTableColor = (status: string) => {
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

  return (
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
      {room.walls.map((wall: any) => (
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
      {room.tables.map((table: any) => {
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
            onClick={(e) => onTableClick(table, e)}
            onMouseDown={(e) => onMouseDown(e, table)}
          >
            <div className="text-center">
              <div className="font-medium">{table.number}</div>
              <div className="text-xs">{table.seats} Plätze</div>
            </div>
          </div>
        )
      })}
    </div>
  )
}
