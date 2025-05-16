import { DashboardHeader } from "@/components/dashboard/dashboard-header"
import { OrdersFilter } from "@/components/dashboard/orders/orders-filter"
import { OrdersTable } from "@/components/dashboard/orders/orders-table"
import { OrdersStats } from "@/components/dashboard/orders/orders-stats"

export default function OrdersPage() {
  return (
    <div className="flex flex-col gap-6">
      <DashboardHeader title="Bestellungen" description="Verwalten Sie alle Bestellungen Ihres Restaurants." />

      <OrdersStats />
      <OrdersFilter />
      <OrdersTable />
    </div>
  )
}
