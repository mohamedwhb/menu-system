import { DashboardHeader } from "@/components/dashboard/dashboard-header"
import { DashboardStats } from "@/components/dashboard/dashboard-stats"
import { RecentOrders } from "@/components/dashboard/recent-orders"
import { PopularItems } from "@/components/dashboard/popular-items"
import { RevenueChart } from "@/components/dashboard/revenue-chart"
import { QuickActions } from "@/components/dashboard/quick-actions"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export default function DashboardPage() {
  return (
    <div className="space-y-6">
      <DashboardHeader title="Dashboard" description="Übersicht aller Bestellungen, Umsätze und Aktivitäten" />

      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Übersicht</TabsTrigger>
          <TabsTrigger value="orders">Bestellungen</TabsTrigger>
          <TabsTrigger value="analytics">Analysen</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <DashboardStats />

          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
            <Card className="lg:col-span-4">
              <CardHeader>
                <CardTitle>Umsatzentwicklung</CardTitle>
                <CardDescription>Umsatz der letzten 7 Tage im Vergleich zur Vorwoche</CardDescription>
              </CardHeader>
              <CardContent>
                <RevenueChart />
              </CardContent>
            </Card>

            <Card className="lg:col-span-3">
              <CardHeader>
                <CardTitle>Beliebte Gerichte</CardTitle>
                <CardDescription>Die meistverkauften Gerichte der letzten 30 Tage</CardDescription>
              </CardHeader>
              <CardContent>
                <PopularItems />
              </CardContent>
            </Card>
          </div>

          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
            <Card className="lg:col-span-4">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <div className="space-y-1">
                  <CardTitle>Aktuelle Bestellungen</CardTitle>
                  <CardDescription>Die letzten 5 Bestellungen</CardDescription>
                </div>
                <a href="/dashboard/orders" className="text-sm text-blue-600 hover:underline">
                  Alle anzeigen
                </a>
              </CardHeader>
              <CardContent>
                <RecentOrders />
              </CardContent>
            </Card>

            <Card className="lg:col-span-3">
              <CardHeader>
                <CardTitle>Schnellzugriff</CardTitle>
                <CardDescription>Häufig verwendete Aktionen</CardDescription>
              </CardHeader>
              <CardContent>
                <QuickActions />
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="orders">
          <Card>
            <CardHeader>
              <CardTitle>Alle Bestellungen</CardTitle>
              <CardDescription>Verwalten Sie alle Bestellungen Ihres Restaurants</CardDescription>
            </CardHeader>
            <CardContent>
              <iframe src="/dashboard/orders" className="w-full h-[600px] border-0" title="Bestellungen" />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="analytics">
          <Card>
            <CardHeader>
              <CardTitle>Detaillierte Analysen</CardTitle>
              <CardDescription>Tiefere Einblicke in Ihre Geschäftsdaten</CardDescription>
            </CardHeader>
            <CardContent className="h-[600px] flex items-center justify-center">
              <div className="text-center">
                <h3 className="text-lg font-medium">Erweiterte Analysen</h3>
                <p className="text-muted-foreground mt-2">
                  Detaillierte Analysen werden in einem zukünftigen Update verfügbar sein.
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
