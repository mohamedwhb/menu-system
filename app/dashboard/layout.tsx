import type React from "react"
import { DashboardSidebar } from "@/components/dashboard/sidebar"
import { TopBar } from "@/components/dashboard/top-bar"
import { NotificationsProvider } from "@/contexts/notifications-context"
import { FinanzOnlineProvider } from "@/contexts/finanzonline-context"

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <FinanzOnlineProvider>
      <NotificationsProvider>
        <div className="flex h-screen bg-gray-50">
          <DashboardSidebar />
          <div className="flex-1 flex flex-col overflow-hidden">
            <TopBar />
            <main className="flex-1 overflow-auto p-6">{children}</main>
          </div>
        </div>
      </NotificationsProvider>
    </FinanzOnlineProvider>
  )
}
