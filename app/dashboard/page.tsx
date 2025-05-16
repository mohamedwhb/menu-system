import { OrdersTable } from "@/components/dashboard/orders-table"
import { OrdersFilter } from "@/components/dashboard/orders-filter"
import { DashboardHeader } from "@/components/dashboard/dashboard-header"

export default function DashboardPage() {
  return (
    <div className="space-y-6">
      <DashboardHeader title="Dashboard" description="Übersicht aller Bestellungen und Aktivitäten" />

      <div className="rounded-lg border border-[#EAEAEA] bg-white p-6 shadow-sm">
        <div className="mb-6">
          <OrdersFilter />
        </div>
        <OrdersTable />
      </div>
    </div>
  )
}
