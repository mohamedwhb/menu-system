import { MenuHeader } from "@/components/dashboard/menu/menu-header"
import { MenuCategories } from "@/components/dashboard/menu/menu-categories"
import { MenuItemsGrid } from "@/components/dashboard/menu/menu-items-grid"
import { MenuItemsTable } from "@/components/dashboard/menu/menu-items-table"
import { MenuFilter } from "@/components/dashboard/menu/menu-filter"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export default function MenuPage() {
  return (
    <div className="space-y-6">
      <MenuHeader />

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="md:col-span-1">
          <MenuCategories />
        </div>

        <div className="md:col-span-3 space-y-6">
          <div className="rounded-lg border border-[#EAEAEA] bg-white p-6 shadow-sm">
            <MenuFilter />

            <Tabs defaultValue="grid" className="mt-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-medium">Menü-Elemente</h3>
                <TabsList className="bg-[#F7F7F7]">
                  <TabsTrigger value="grid" className="data-[state=active]:bg-white">
                    Kacheln
                  </TabsTrigger>
                  <TabsTrigger value="table" className="data-[state=active]:bg-white">
                    Tabelle
                  </TabsTrigger>
                </TabsList>
              </div>

              <TabsContent value="grid" className="mt-0">
                <MenuItemsGrid />
              </TabsContent>

              <TabsContent value="table" className="mt-0">
                <MenuItemsTable />
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
    </div>
  )
}
