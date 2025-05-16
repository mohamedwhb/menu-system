import { ReservationHeader } from "@/components/dashboard/reservations/reservation-header"
import { ReservationCalendar } from "@/components/dashboard/reservations/reservation-calendar"
import { ReservationSidebar } from "@/components/dashboard/reservations/reservation-sidebar"

export default function ReservationsPage() {
  return (
    <div className="space-y-6">
      <ReservationHeader />

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <div className="lg:col-span-3">
          <div className="rounded-lg border border-[#EAEAEA] bg-white p-6 shadow-sm">
            <ReservationCalendar />
          </div>
        </div>

        <div className="lg:col-span-1">
          <ReservationSidebar />
        </div>
      </div>
    </div>
  )
}
