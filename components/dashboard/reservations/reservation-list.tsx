"use client"

import { useState, useMemo, useCallback } from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Checkbox } from "@/components/ui/checkbox"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { cn } from "@/lib/utils"
import { format, parseISO } from "date-fns"
import { de } from "date-fns/locale"
import { MoreHorizontal, ArrowUpDown, ArrowUp, ArrowDown, Eye, Edit, Trash2, Mail, Phone } from "lucide-react"
import type { reservations } from "@/data/reservations"

interface ReservationListProps {
  reservations: typeof reservations
  onBulkAction: (action: string, ids: string[]) => void
  isLoading: boolean
}

type SortField = "date" | "name" | "guests" | "table" | "status"
type SortDirection = "asc" | "desc"

export function ReservationList({ reservations, onBulkAction, isLoading }: ReservationListProps) {
  const [selectedIds, setSelectedIds] = useState<string[]>([])
  const [sortField, setSortField] = useState<SortField>("date")
  const [sortDirection, setSortDirection] = useState<SortDirection>("asc")
  const [pageSize, setPageSize] = useState(25)
  const [currentPage, setCurrentPage] = useState(1)

  // Get status badge color
  const getStatusColor = (status: string) => {
    switch (status) {
      case "confirmed":
        return "bg-[#DCFCE7] text-[#16A34A] border-[#DCFCE7]"
      case "pending":
        return "bg-[#FEF9C3] text-[#CA8A04] border-[#FEF9C3]"
      case "cancelled":
        return "bg-[#FEE2E2] text-[#DC2626] border-[#FEE2E2]"
      default:
        return "bg-[#F3F4F6] text-[#6B7280] border-[#F3F4F6]"
    }
  }

  // Sorted reservations
  const sortedReservations = useMemo(() => {
    const sorted = [...reservations].sort((a, b) => {
      let aValue: any
      let bValue: any

      switch (sortField) {
        case "date":
          aValue = parseISO(a.date).getTime()
          bValue = parseISO(b.date).getTime()
          break
        case "name":
          aValue = a.name.toLowerCase()
          bValue = b.name.toLowerCase()
          break
        case "guests":
          aValue = a.guests
          bValue = b.guests
          break
        case "table":
          aValue = Number.parseInt(a.table)
          bValue = Number.parseInt(b.table)
          break
        case "status":
          aValue = a.status
          bValue = b.status
          break
        default:
          return 0
      }

      if (aValue < bValue) return sortDirection === "asc" ? -1 : 1
      if (aValue > bValue) return sortDirection === "asc" ? 1 : -1
      return 0
    })

    return sorted
  }, [reservations, sortField, sortDirection])

  // Paginated reservations
  const paginatedReservations = useMemo(() => {
    const startIndex = (currentPage - 1) * pageSize
    return sortedReservations.slice(startIndex, startIndex + pageSize)
  }, [sortedReservations, currentPage, pageSize])

  const totalPages = Math.ceil(sortedReservations.length / pageSize)

  // Handlers
  const handleSort = useCallback(
    (field: SortField) => {
      if (sortField === field) {
        setSortDirection(sortDirection === "asc" ? "desc" : "asc")
      } else {
        setSortField(field)
        setSortDirection("asc")
      }
    },
    [sortField, sortDirection],
  )

  const handleSelectAll = useCallback(
    (checked: boolean) => {
      if (checked) {
        setSelectedIds(paginatedReservations.map((r) => r.id))
      } else {
        setSelectedIds([])
      }
    },
    [paginatedReservations],
  )

  const handleSelectOne = useCallback((id: string, checked: boolean) => {
    if (checked) {
      setSelectedIds((prev) => [...prev, id])
    } else {
      setSelectedIds((prev) => prev.filter((selectedId) => selectedId !== id))
    }
  }, [])

  const handleBulkAction = useCallback(
    (action: string) => {
      onBulkAction(action, selectedIds)
      setSelectedIds([])
    },
    [onBulkAction, selectedIds],
  )

  const getSortIcon = (field: SortField) => {
    if (sortField !== field) return <ArrowUpDown className="h-4 w-4" />
    return sortDirection === "asc" ? <ArrowUp className="h-4 w-4" /> : <ArrowDown className="h-4 w-4" />
  }

  return (
    <div className="space-y-4">
      {/* Bulk Actions */}
      {selectedIds.length > 0 && (
        <div className="flex items-center gap-2 p-4 bg-[#F0F7FF] border border-[#006AFF] rounded-md">
          <span className="text-sm font-medium">{selectedIds.length} ausgewählt</span>
          <Button size="sm" variant="outline" onClick={() => handleBulkAction("confirm")}>
            Bestätigen
          </Button>
          <Button size="sm" variant="outline" onClick={() => handleBulkAction("cancel")}>
            Stornieren
          </Button>
          <Button size="sm" variant="outline" onClick={() => handleBulkAction("delete")}>
            Löschen
          </Button>
          <Button size="sm" variant="outline" onClick={() => handleBulkAction("email")}>
            E-Mail senden
          </Button>
        </div>
      )}

      {/* Table */}
      <div className="rounded-md border border-[#EAEAEA] overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="bg-[#F9FAFB]">
              <TableHead className="w-12">
                <Checkbox
                  checked={selectedIds.length === paginatedReservations.length && paginatedReservations.length > 0}
                  onCheckedChange={handleSelectAll}
                />
              </TableHead>
              <TableHead>
                <Button variant="ghost" size="sm" onClick={() => handleSort("name")} className="h-8 p-0 font-medium">
                  Name {getSortIcon("name")}
                </Button>
              </TableHead>
              <TableHead>
                <Button variant="ghost" size="sm" onClick={() => handleSort("date")} className="h-8 p-0 font-medium">
                  Datum & Zeit {getSortIcon("date")}
                </Button>
              </TableHead>
              <TableHead>
                <Button variant="ghost" size="sm" onClick={() => handleSort("guests")} className="h-8 p-0 font-medium">
                  Gäste {getSortIcon("guests")}
                </Button>
              </TableHead>
              <TableHead>
                <Button variant="ghost" size="sm" onClick={() => handleSort("table")} className="h-8 p-0 font-medium">
                  Tisch {getSortIcon("table")}
                </Button>
              </TableHead>
              <TableHead>
                <Button variant="ghost" size="sm" onClick={() => handleSort("status")} className="h-8 p-0 font-medium">
                  Status {getSortIcon("status")}
                </Button>
              </TableHead>
              <TableHead>Kontakt</TableHead>
              <TableHead className="w-12"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {paginatedReservations.map((reservation) => (
              <TableRow key={reservation.id} className="hover:bg-[#F9FAFB]">
                <TableCell>
                  <Checkbox
                    checked={selectedIds.includes(reservation.id)}
                    onCheckedChange={(checked) => handleSelectOne(reservation.id, checked as boolean)}
                  />
                </TableCell>
                <TableCell className="font-medium">{reservation.name}</TableCell>
                <TableCell>
                  <div>
                    <div className="font-medium">
                      {format(parseISO(reservation.date), "dd.MM.yyyy", { locale: de })}
                    </div>
                    <div className="text-sm text-[#6B7280]">
                      {format(parseISO(reservation.date), "HH:mm", { locale: de })} Uhr
                    </div>
                  </div>
                </TableCell>
                <TableCell>{reservation.guests}</TableCell>
                <TableCell>Tisch {reservation.table}</TableCell>
                <TableCell>
                  <Badge variant="outline" className={cn("text-xs", getStatusColor(reservation.status))}>
                    {reservation.status === "confirmed"
                      ? "Bestätigt"
                      : reservation.status === "pending"
                        ? "Ausstehend"
                        : "Storniert"}
                  </Badge>
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    {reservation.email && (
                      <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
                        <Mail className="h-3 w-3" />
                      </Button>
                    )}
                    {reservation.phone && (
                      <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
                        <Phone className="h-3 w-3" />
                      </Button>
                    )}
                  </div>
                </TableCell>
                <TableCell>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-[160px] bg-white border-[#EAEAEA]">
                      <DropdownMenuItem>
                        <Eye className="mr-2 h-4 w-4" />
                        Anzeigen
                      </DropdownMenuItem>
                      <DropdownMenuItem>
                        <Edit className="mr-2 h-4 w-4" />
                        Bearbeiten
                      </DropdownMenuItem>
                      <DropdownMenuItem className="text-[#DC2626]">
                        <Trash2 className="mr-2 h-4 w-4" />
                        Löschen
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* Pagination */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-sm text-[#6B7280]">Zeilen pro Seite:</span>
          <Select value={pageSize.toString()} onValueChange={(value) => setPageSize(Number.parseInt(value))}>
            <SelectTrigger className="w-[70px] h-8">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="10">10</SelectItem>
              <SelectItem value="25">25</SelectItem>
              <SelectItem value="50">50</SelectItem>
              <SelectItem value="100">100</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-sm text-[#6B7280]">
            {(currentPage - 1) * pageSize + 1}-{Math.min(currentPage * pageSize, sortedReservations.length)} von{" "}
            {sortedReservations.length}
          </span>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setCurrentPage(currentPage - 1)}
            disabled={currentPage === 1}
          >
            Zurück
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setCurrentPage(currentPage + 1)}
            disabled={currentPage === totalPages}
          >
            Weiter
          </Button>
        </div>
      </div>
    </div>
  )
}
