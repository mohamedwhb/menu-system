"use client"

import { useState } from "react"
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts"
import { useCart } from "@/contexts/cart-context"
import { Button } from "@/components/ui/button"
import { Slider } from "@/components/ui/slider"
import { Input } from "@/components/ui/input"
import { cn } from "@/lib/utils"

interface BillSplitterProps {
  splitType: "percentage" | "equal"
}

export function BillSplitter({ splitType }: BillSplitterProps) {
  const {
    totalPrice,
    getGuestIds,
    getGuestName,
    guestSplits,
    updateGuestPercentage,
    distributeRemaining,
    resetSplits,
    splitEqually,
    getGuestTotal,
  } = useCart()

  const [editMode, setEditMode] = useState<string | null>(null)

  // Get all guest IDs, including "self" if there are items without a guestId
  const allGuestIds = ["self", ...getGuestIds()].filter((id, index, self) => self.indexOf(id) === index)

  // Calculate total percentage allocated
  const totalAllocated = guestSplits.reduce((sum, split) => sum + split.percentage, 0)
  const remaining = 100 - totalAllocated

  // Generate colors for the pie chart
  const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#8884D8", "#82CA9D", "#A4DE6C"]

  // Prepare data for pie chart
  const pieData = guestSplits
    .filter((split) => split.percentage > 0)
    .map((split, index) => ({
      name: getGuestName(split.guestId),
      value: split.percentage,
      guestId: split.guestId,
    }))

  // Add remaining slice if there's any unallocated percentage
  if (remaining > 0) {
    pieData.push({
      name: "Nicht zugewiesen",
      value: remaining,
      guestId: "remaining",
    })
  }

  // Handle percentage change
  const handlePercentageChange = (guestId: string, value: number) => {
    updateGuestPercentage(guestId, value)
  }

  // Handle direct input of percentage
  const handleDirectInput = (guestId: string, value: string) => {
    const numValue = Number.parseFloat(value)
    if (!isNaN(numValue) && numValue >= 0 && numValue <= 100) {
      updateGuestPercentage(guestId, numValue)
    }
  }

  return (
    <div className="space-y-6">
      {/* Visual representation */}
      <div className="bg-muted/20 p-4 rounded-lg">
        <h3 className="text-sm font-medium mb-2">Rechnungsaufteilung</h3>
        <div className="flex flex-col sm:flex-row items-center gap-4">
          <div className="w-full sm:w-1/2 h-[200px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={2}
                  dataKey="value"
                  label={({ name, value }) => `${name}: ${value}%`}
                  labelLine={false}
                >
                  {pieData.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={entry.guestId === "remaining" ? "#d1d5db" : COLORS[index % COLORS.length]}
                    />
                  ))}
                </Pie>
                <Tooltip
                  formatter={(value: number) => [`${value}%`, "Anteil"]}
                  labelFormatter={(name) => name as string}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="w-full sm:w-1/2">
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Gesamtbetrag:</span>
                <span className="font-medium">{totalPrice.toFixed(2)} €</span>
              </div>
              <div className="flex justify-between text-sm">
                <span>Zugewiesen:</span>
                <span className={cn("font-medium", totalAllocated < 100 ? "text-amber-500" : "text-green-500")}>
                  {totalAllocated.toFixed(1)}%
                </span>
              </div>
              {remaining > 0 && (
                <div className="flex justify-between text-sm">
                  <span>Nicht zugewiesen:</span>
                  <span className="font-medium text-amber-500">{remaining.toFixed(1)}%</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Action buttons */}
      <div className="flex flex-wrap gap-2">
        <Button variant="outline" size="sm" onClick={splitEqually} className="flex-1">
          Gleichmäßig aufteilen
        </Button>
        <Button variant="outline" size="sm" onClick={distributeRemaining} className="flex-1" disabled={remaining <= 0}>
          Rest verteilen
        </Button>
        <Button variant="outline" size="sm" onClick={resetSplits} className="flex-1">
          Zurücksetzen
        </Button>
      </div>

      {/* Guest sliders */}
      <div className="space-y-4">
        <h3 className="text-sm font-medium">Anteile anpassen</h3>
        {allGuestIds.map((guestId) => {
          const split = guestSplits.find((s) => s.guestId === guestId) || { guestId, percentage: 0, amount: 0 }
          const guestName = getGuestName(guestId)
          const amount = getGuestTotal(guestId)

          return (
            <div key={guestId} className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">{guestName}</span>
                <div className="flex items-center gap-2">
                  {editMode === guestId ? (
                    <div className="flex items-center">
                      <Input
                        type="number"
                        min="0"
                        max="100"
                        value={split.percentage}
                        onChange={(e) => handleDirectInput(guestId, e.target.value)}
                        className="w-16 h-8 text-right"
                      />
                      <span className="ml-1 text-sm">%</span>
                      <Button variant="ghost" size="sm" className="h-8 ml-1" onClick={() => setEditMode(null)}>
                        OK
                      </Button>
                    </div>
                  ) : (
                    <div
                      className="text-sm font-medium cursor-pointer hover:underline"
                      onClick={() => setEditMode(guestId)}
                    >
                      {split.percentage.toFixed(1)}% ({amount.toFixed(2)} €)
                    </div>
                  )}
                </div>
              </div>
              <Slider
                value={[split.percentage]}
                min={0}
                max={100}
                step={1}
                onValueChange={(value) => handlePercentageChange(guestId, value[0])}
              />
            </div>
          )
        })}
      </div>

      {/* Warning if not 100% */}
      {totalAllocated !== 100 && (
        <div className="p-3 bg-amber-50 border border-amber-200 rounded-md text-amber-800 text-sm">
          {totalAllocated < 100
            ? `Es sind noch ${remaining.toFixed(1)}% nicht zugewiesen. Bitte verteilen Sie den gesamten Betrag.`
            : `Die Summe der Anteile übersteigt 100% (${totalAllocated.toFixed(1)}%). Bitte korrigieren Sie die Verteilung.`}
        </div>
      )}

      {/* Payment buttons */}
      <div className="flex gap-2 pt-2">
        <Button variant="default" className="flex-1" disabled={totalAllocated !== 100}>
          Mit dieser Aufteilung bezahlen
        </Button>
      </div>
    </div>
  )
}
