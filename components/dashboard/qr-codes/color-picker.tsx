"use client"

import { useState } from "react"
import { Input } from "@/components/ui/input"

interface ColorPickerProps {
  color: string
  onChange: (color: string) => void
}

export function ColorPicker({ color, onChange }: ColorPickerProps) {
  const [showPicker, setShowPicker] = useState(false)

  const presetColors = [
    "#000000", // Black
    "#006AFF", // Square Blue
    "#00C286", // Green
    "#FF9800", // Orange
    "#EF4444", // Red
    "#8B5CF6", // Purple
  ]

  return (
    <div className="space-y-2">
      <div className="flex items-center gap-2">
        <div
          className="w-10 h-10 rounded-md border border-[#EAEAEA] cursor-pointer"
          style={{ backgroundColor: color }}
          onClick={() => setShowPicker(!showPicker)}
        />
        <Input
          type="text"
          value={color}
          onChange={(e) => onChange(e.target.value)}
          className="w-32"
          maxLength={7}
          pattern="^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$"
        />
        <Input
          type="color"
          value={color}
          onChange={(e) => onChange(e.target.value)}
          className="w-10 h-10 p-1 cursor-pointer"
        />
      </div>

      {showPicker && (
        <div className="flex flex-wrap gap-2 mt-2">
          {presetColors.map((presetColor) => (
            <div
              key={presetColor}
              className="w-8 h-8 rounded-md border border-[#EAEAEA] cursor-pointer hover:scale-110 transition-transform"
              style={{ backgroundColor: presetColor }}
              onClick={() => {
                onChange(presetColor)
                setShowPicker(false)
              }}
            />
          ))}
        </div>
      )}
    </div>
  )
}
