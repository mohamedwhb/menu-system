"use client"

import { useState, useEffect } from "react"
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts"
import { useCart } from "@/contexts/cart-context"
import { Button } from "@/components/ui/button"
import { Slider } from "@/components/ui/slider"
import { Input } from "@/components/ui/input"
import { cn } from "@/lib/utils"
import { Tooltip as UITooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import {
  AlertCircle,
  CheckCircle2,
  HelpCircle,
  UserMinus,
  UserPlus,
  Percent,
  RefreshCw,
  DivideSquare,
} from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"

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
  const [excludedGuests, setExcludedGuests] = useState<string[]>([])
  const [quickSplitMode, setQuickSplitMode] = useState<"all" | "custom">("all")
  const [showAdvanced, setShowAdvanced] = useState(false)

  // Get all guest IDs, including "self" if there are items without a guestId
  const allGuestIds = ["self", ...getGuestIds()].filter((id, index, self) => self.indexOf(id) === index)

  // Filter out excluded guests for equal splitting
  const activeGuestIds = allGuestIds.filter((id) => !excludedGuests.includes(id))

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

  // Toggle guest exclusion for equal splitting
  const toggleGuestExclusion = (guestId: string) => {
    setExcludedGuests((prev) => {
      if (prev.includes(guestId)) {
        return prev.filter((id) => id !== guestId)
      } else {
        return [...prev, guestId]
      }
    })
  }

  // Effect to handle equal splitting when excluded guests change
  useEffect(() => {
    if (splitType === "equal" && activeGuestIds.length > 0) {
      const equalPercentage = 100 / activeGuestIds.length

      guestSplits.forEach((split) => {
        if (excludedGuests.includes(split.guestId)) {
          // Set excluded guests to 0%
          updateGuestPercentage(split.guestId, 0)
        } else if (activeGuestIds.includes(split.guestId)) {
          // Set active guests to equal percentage
          updateGuestPercentage(split.guestId, equalPercentage)
        }
      })
    }
  }, [excludedGuests, splitType, activeGuestIds.length])

  // Quick split presets for percentage mode
  const applyQuickSplit = (preset: string) => {
    resetSplits()

    switch (preset) {
      case "50-50":
        if (allGuestIds.length >= 2) {
          updateGuestPercentage(allGuestIds[0], 50)
          updateGuestPercentage(allGuestIds[1], 50)
        }
        break
      case "60-40":
        if (allGuestIds.length >= 2) {
          updateGuestPercentage(allGuestIds[0], 60)
          updateGuestPercentage(allGuestIds[1], 40)
        }
        break
      case "70-30":
        if (allGuestIds.length >= 2) {
          updateGuestPercentage(allGuestIds[0], 70)
          updateGuestPercentage(allGuestIds[1], 30)
        }
        break
      case "33-33-33":
        if (allGuestIds.length >= 3) {
          updateGuestPercentage(allGuestIds[0], 33.33)
          updateGuestPercentage(allGuestIds[1], 33.33)
          updateGuestPercentage(allGuestIds[2], 33.34)
        }
        break
      case "25-25-25-25":
        if (allGuestIds.length >= 4) {
          updateGuestPercentage(allGuestIds[0], 25)
          updateGuestPercentage(allGuestIds[1], 25)
          updateGuestPercentage(allGuestIds[2], 25)
          updateGuestPercentage(allGuestIds[3], 25)
        }
        break
    }
  }

  return (
    <div className="space-y-6">
      {/* Visual representation */}
      <div className="bg-muted/20 p-4 rounded-lg">
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-sm font-medium">Rechnungsaufteilung</h3>
          <TooltipProvider>
            <UITooltip>
              <TooltipTrigger asChild>
                <Button variant="ghost" size="icon" className="h-6 w-6">
                  <HelpCircle className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent className="max-w-xs">
                <p>
                  {splitType === "percentage"
                    ? "Teilen Sie die Rechnung prozentual auf. Jeder Gast zahlt einen bestimmten Prozentsatz der Gesamtrechnung."
                    : "Teilen Sie die Rechnung gleichmäßig auf. Jeder Gast zahlt den gleichen Betrag."}
                </p>
              </TooltipContent>
            </UITooltip>
          </TooltipProvider>
        </div>
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
                  label={({ name, value }) => `${name}: ${value.toFixed(1)}%`}
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
                  formatter={(value: number) => [`${value.toFixed(1)}%`, "Anteil"]}
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
              <div className="flex justify-between text-sm pt-2">
                <span>Status:</span>
                <div className="flex items-center gap-1">
                  {totalAllocated === 100 ? (
                    <>
                      <CheckCircle2 className="h-4 w-4 text-green-500" />
                      <span className="text-green-500 font-medium">Bereit</span>
                    </>
                  ) : (
                    <>
                      <AlertCircle className="h-4 w-4 text-amber-500" />
                      <span className="text-amber-500 font-medium">Unvollständig</span>
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Action buttons */}
      <div className="flex flex-wrap gap-2">
        {splitType === "percentage" && (
          <>
            <div className="flex-1 flex flex-col gap-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-medium">Schnellauswahl:</span>
                <div className="flex items-center gap-1">
                  <Button
                    variant={quickSplitMode === "all" ? "default" : "outline"}
                    size="xs"
                    className="h-6 text-xs px-2"
                    onClick={() => setQuickSplitMode("all")}
                  >
                    Voreinstellungen
                  </Button>
                  <Button
                    variant={quickSplitMode === "custom" ? "default" : "outline"}
                    size="xs"
                    className="h-6 text-xs px-2"
                    onClick={() => setQuickSplitMode("custom")}
                  >
                    Anpassen
                  </Button>
                </div>
              </div>

              {quickSplitMode === "all" ? (
                <div className="grid grid-cols-3 gap-1">
                  <Button variant="outline" size="sm" onClick={() => applyQuickSplit("50-50")} className="text-xs h-8">
                    50/50
                  </Button>
                  <Button variant="outline" size="sm" onClick={() => applyQuickSplit("60-40")} className="text-xs h-8">
                    60/40
                  </Button>
                  <Button variant="outline" size="sm" onClick={() => applyQuickSplit("70-30")} className="text-xs h-8">
                    70/30
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => applyQuickSplit("33-33-33")}
                    className="text-xs h-8"
                  >
                    33/33/33
                  </Button>
                  <Button variant="outline" size="sm" onClick={() => splitEqually} className="text-xs h-8">
                    Gleich
                  </Button>
                  <Button variant="outline" size="sm" onClick={resetSplits} className="text-xs h-8">
                    Reset
                  </Button>
                </div>
              ) : (
                <div className="grid grid-cols-2 gap-1">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={splitEqually}
                    className="text-xs h-8 flex items-center gap-1"
                  >
                    <DivideSquare className="h-3.5 w-3.5" />
                    <span>Gleichmäßig</span>
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={distributeRemaining}
                    className="text-xs h-8 flex items-center gap-1"
                    disabled={remaining <= 0}
                  >
                    <Percent className="h-3.5 w-3.5" />
                    <span>Rest verteilen</span>
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={resetSplits}
                    className="text-xs h-8 flex items-center gap-1"
                  >
                    <RefreshCw className="h-3.5 w-3.5" />
                    <span>Zurücksetzen</span>
                  </Button>
                </div>
              )}
            </div>
          </>
        )}

        {splitType === "equal" && (
          <div className="w-full space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium">Teilnehmer:</span>
              <Badge variant="outline" className="font-normal">
                {activeGuestIds.length} von {allGuestIds.length} aktiv
              </Badge>
            </div>
            <div className="flex flex-wrap gap-1">
              {allGuestIds.map((guestId) => {
                const isExcluded = excludedGuests.includes(guestId)
                return (
                  <Button
                    key={guestId}
                    variant={isExcluded ? "outline" : "default"}
                    size="sm"
                    className={cn("text-xs h-8 flex items-center gap-1", isExcluded && "opacity-70")}
                    onClick={() => toggleGuestExclusion(guestId)}
                  >
                    {isExcluded ? <UserPlus className="h-3.5 w-3.5" /> : <UserMinus className="h-3.5 w-3.5" />}
                    <span>{getGuestName(guestId)}</span>
                  </Button>
                )
              })}
            </div>
            <div className="flex items-center justify-between pt-1">
              <span className="text-xs text-muted-foreground">
                {excludedGuests.length > 0
                  ? `${excludedGuests.length} Gäste ausgeschlossen`
                  : "Alle Gäste eingeschlossen"}
              </span>
              <Button
                variant="ghost"
                size="sm"
                className="h-7 text-xs"
                onClick={() => setExcludedGuests([])}
                disabled={excludedGuests.length === 0}
              >
                Alle einschließen
              </Button>
            </div>
          </div>
        )}
      </div>

      {/* Advanced options toggle */}
      <div className="flex items-center justify-between pt-2">
        <div className="flex items-center space-x-2">
          <Switch id="show-advanced" checked={showAdvanced} onCheckedChange={setShowAdvanced} />
          <Label htmlFor="show-advanced">Erweiterte Optionen anzeigen</Label>
        </div>
      </div>

      {/* Guest sliders */}
      {(showAdvanced || splitType === "percentage") && (
        <div className="space-y-4">
          <h3 className="text-sm font-medium flex items-center gap-1">
            <span>Anteile anpassen</span>
            {splitType === "equal" && (
              <Badge variant="outline" className="ml-2 font-normal">
                Erweitert
              </Badge>
            )}
          </h3>
          {allGuestIds.map((guestId) => {
            const split = guestSplits.find((s) => s.guestId === guestId) || { guestId, percentage: 0, amount: 0 }
            const guestName = getGuestName(guestId)
            const amount = getGuestTotal(guestId)
            const isExcluded = splitType === "equal" && excludedGuests.includes(guestId)

            return (
              <div key={guestId} className={cn("space-y-2", isExcluded && "opacity-50")}>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1">
                    <span className="text-sm font-medium">{guestName}</span>
                    {splitType === "equal" && (
                      <Badge variant={isExcluded ? "outline" : "default"} className="ml-1 text-[10px] px-1 py-0 h-4">
                        {isExcluded ? "Ausgeschlossen" : "Aktiv"}
                      </Badge>
                    )}
                  </div>
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
                  disabled={splitType === "equal" && !showAdvanced}
                  className={cn(splitType === "percentage" && split.percentage > 0 && "data-[value]:bg-primary")}
                />
              </div>
            )
          })}
        </div>
      )}

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
