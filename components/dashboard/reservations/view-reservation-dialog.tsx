"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { cn } from "@/lib/utils"
import { format, parseISO, addMinutes } from "date-fns"
import { de } from "date-fns/locale"
import {
  Calendar,
  Clock,
  Mail,
  Phone,
  Users,
  MapPin,
  MessageSquare,
  Edit,
  Trash2,
  Copy,
  Send,
  AlertCircle,
} from "lucide-react"
import type { reservations } from "@/data/reservations"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"

interface ViewReservationDialogProps {
  reservation: (typeof reservations)[0]
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function ViewReservationDialog({ reservation, open, onOpenChange }: ViewReservationDialogProps) {
  const [activeTab, setActiveTab] = useState("details")
  const [showConflictAlert, setShowConflictAlert] = useState(false)

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

  const reservationDate = parseISO(reservation.date)
  const endTime = addMinutes(reservationDate, (reservation.duration || 2) * 60)

  // Simulate a conflict check
  const hasConflict = reservation.id === "res-003" // Just for demo purposes

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] bg-white">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <DialogTitle>Reservierungsdetails</DialogTitle>
            <Badge variant="outline" className={cn("text-xs", getStatusColor(reservation.status))}>
              {reservation.status === "confirmed"
                ? "Bestätigt"
                : reservation.status === "pending"
                  ? "Ausstehend"
                  : "Storniert"}
            </Badge>
          </div>
          <DialogDescription>
            Reservierung für {reservation.name} am {format(reservationDate, "PPP", { locale: de })}
          </DialogDescription>
        </DialogHeader>

        {showConflictAlert && (
          <Alert variant="destructive" className="mt-2">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Konflikt erkannt</AlertTitle>
            <AlertDescription>
              Tisch {reservation.table} ist zu dieser Zeit bereits reserviert. Bitte wählen Sie einen anderen Tisch oder
              eine andere Zeit.
            </AlertDescription>
          </Alert>
        )}

        <Tabs value={activeTab} onValueChange={setActiveTab} className="mt-4">
          <TabsList className="bg-[#F7F7F7] w-full">
            <TabsTrigger value="details" className="flex-1 data-[state=active]:bg-white">
              Details
            </TabsTrigger>
            <TabsTrigger value="history" className="flex-1 data-[state=active]:bg-white">
              Verlauf
            </TabsTrigger>
            <TabsTrigger value="actions" className="flex-1 data-[state=active]:bg-white">
              Aktionen
            </TabsTrigger>
          </TabsList>

          <TabsContent value="details" className="mt-4 space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="flex items-start gap-3">
                <Calendar className="h-5 w-5 text-[#6B7280] mt-0.5" />
                <div>
                  <div className="text-sm font-medium">Datum</div>
                  <div className="text-sm text-[#6B7280]">{format(reservationDate, "PPP", { locale: de })}</div>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Clock className="h-5 w-5 text-[#6B7280] mt-0.5" />
                <div>
                  <div className="text-sm font-medium">Uhrzeit</div>
                  <div className="text-sm text-[#6B7280]">
                    {format(reservationDate, "HH:mm", { locale: de })} - {format(endTime, "HH:mm", { locale: de })} Uhr
                    {reservation.duration && ` (${reservation.duration} Stunden)`}
                  </div>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Users className="h-5 w-5 text-[#6B7280] mt-0.5" />
                <div>
                  <div className="text-sm font-medium">Anzahl der Gäste</div>
                  <div className="text-sm text-[#6B7280]">
                    {reservation.guests} {reservation.guests === 1 ? "Person" : "Personen"}
                  </div>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <MapPin className="h-5 w-5 text-[#6B7280] mt-0.5" />
                <div>
                  <div className="text-sm font-medium">Tisch</div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-[#6B7280]">Tisch {reservation.table}</span>
                    {hasConflict && (
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <AlertCircle className="h-4 w-4 text-[#DC2626]" />
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>Konflikt: Tisch ist bereits reserviert</p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    )}
                  </div>
                </div>
              </div>

              {reservation.email && (
                <div className="flex items-start gap-3">
                  <Mail className="h-5 w-5 text-[#6B7280] mt-0.5" />
                  <div>
                    <div className="text-sm font-medium">E-Mail</div>
                    <div className="text-sm text-[#6B7280] flex items-center gap-1">
                      {reservation.email}
                      <button className="text-[#006AFF] hover:text-[#0055CC] ml-1">
                        <Copy className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {reservation.phone && (
                <div className="flex items-start gap-3">
                  <Phone className="h-5 w-5 text-[#6B7280] mt-0.5" />
                  <div>
                    <div className="text-sm font-medium">Telefon</div>
                    <div className="text-sm text-[#6B7280] flex items-center gap-1">
                      {reservation.phone}
                      <button className="text-[#006AFF] hover:text-[#0055CC] ml-1">
                        <Copy className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {reservation.notes && (
              <div className="flex items-start gap-3 pt-2 border-t border-[#EAEAEA]">
                <MessageSquare className="h-5 w-5 text-[#6B7280] mt-0.5" />
                <div>
                  <div className="text-sm font-medium">Notizen</div>
                  <div className="text-sm text-[#6B7280]">{reservation.notes}</div>
                </div>
              </div>
            )}
          </TabsContent>

          <TabsContent value="history" className="mt-4">
            <div className="space-y-4">
              <div className="text-sm text-[#6B7280]">Aktivitätsverlauf für diese Reservierung:</div>

              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <div className="h-6 w-6 rounded-full bg-[#F0F7FF] flex items-center justify-center">
                    <div className="h-2 w-2 rounded-full bg-[#006AFF]"></div>
                  </div>
                  <div className="flex-1">
                    <div className="text-sm">Reservierung erstellt</div>
                    <div className="text-xs text-[#6B7280]">
                      {format(parseISO(reservation.createdAt), "PPp", { locale: de })}
                    </div>
                  </div>
                </div>

                {reservation.status === "confirmed" && (
                  <div className="flex items-start gap-3">
                    <div className="h-6 w-6 rounded-full bg-[#F0FDF4] flex items-center justify-center">
                      <div className="h-2 w-2 rounded-full bg-[#16A34A]"></div>
                    </div>
                    <div className="flex-1">
                      <div className="text-sm">Reservierung bestätigt</div>
                      <div className="text-xs text-[#6B7280]">
                        {format(new Date(parseISO(reservation.createdAt).getTime() + 1000 * 60 * 30), "PPp", {
                          locale: de,
                        })}
                      </div>
                    </div>
                  </div>
                )}

                {reservation.status === "cancelled" && (
                  <div className="flex items-start gap-3">
                    <div className="h-6 w-6 rounded-full bg-[#FEF2F2] flex items-center justify-center">
                      <div className="h-2 w-2 rounded-full bg-[#DC2626]"></div>
                    </div>
                    <div className="flex-1">
                      <div className="text-sm">Reservierung storniert</div>
                      <div className="text-xs text-[#6B7280]">
                        {format(new Date(parseISO(reservation.createdAt).getTime() + 1000 * 60 * 60 * 2), "PPp", {
                          locale: de,
                        })}
                      </div>
                    </div>
                  </div>
                )}

                {/* Example of a reminder sent */}
                {reservation.status === "confirmed" && (
                  <div className="flex items-start gap-3">
                    <div className="h-6 w-6 rounded-full bg-[#F0F7FF] flex items-center justify-center">
                      <div className="h-2 w-2 rounded-full bg-[#006AFF]"></div>
                    </div>
                    <div className="flex-1">
                      <div className="text-sm">Erinnerung gesendet</div>
                      <div className="text-xs text-[#6B7280]">
                        {format(new Date(parseISO(reservation.createdAt).getTime() + 1000 * 60 * 60 * 24), "PPp", {
                          locale: de,
                        })}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </TabsContent>

          <TabsContent value="actions" className="mt-4">
            <div className="space-y-4">
              <div className="text-sm text-[#6B7280]">Verfügbare Aktionen für diese Reservierung:</div>

              <div className="grid grid-cols-2 gap-3">
                <Button variant="outline" className="justify-start">
                  <Send className="mr-2 h-4 w-4" />
                  Bestätigung senden
                </Button>
                <Button variant="outline" className="justify-start">
                  <Send className="mr-2 h-4 w-4" />
                  Erinnerung senden
                </Button>
                <Button variant="outline" className="justify-start" onClick={() => setShowConflictAlert(true)}>
                  <AlertCircle className="mr-2 h-4 w-4" />
                  Konflikt prüfen
                </Button>
                <Button variant="outline" className="justify-start">
                  <Edit className="mr-2 h-4 w-4" />
                  Tisch ändern
                </Button>
                <Button variant="outline" className="justify-start">
                  <Clock className="mr-2 h-4 w-4" />
                  Zeit ändern
                </Button>
                <Button variant="outline" className="justify-start">
                  <Users className="mr-2 h-4 w-4" />
                  Gäste ändern
                </Button>
              </div>

              <div className="pt-4 border-t border-[#EAEAEA]">
                <Button variant="destructive" className="w-full justify-center">
                  <Trash2 className="mr-2 h-4 w-4" />
                  Reservierung stornieren
                </Button>
              </div>
            </div>
          </TabsContent>
        </Tabs>

        <DialogFooter className="flex flex-col sm:flex-row gap-2">
          <Button variant="outline" className="sm:mr-auto" onClick={() => onOpenChange(false)}>
            Schließen
          </Button>
          <Button variant="outline" className="gap-2">
            <Edit className="h-4 w-4" />
            Bearbeiten
          </Button>
          {reservation.status !== "cancelled" && (
            <Button variant="destructive" className="gap-2">
              <Trash2 className="h-4 w-4" />
              Stornieren
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
