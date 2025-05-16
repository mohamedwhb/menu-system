"use client"

import { useState } from "react"
import { Edit, MoreHorizontal, Star, Eye, EyeOff, ArrowUpDown } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Checkbox } from "@/components/ui/checkbox"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { EditMenuItemDialog } from "@/components/dashboard/menu/edit-menu-item-dialog"
import { menuItems } from "@/data/menu-items"

export function MenuItemsTable() {
  const [items, setItems] = useState(menuItems)
  const [editingItem, setEditingItem] = useState<(typeof menuItems)[0] | null>(null)
  const [sortColumn, setSortColumn] = useState<string | null>(null)
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc")

  const handleSort = (column: string) => {
    if (sortColumn === column) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc")
    } else {
      setSortColumn(column)
      setSortDirection("asc")
    }
  }

  const toggleFeatured = (id: string) => {
    setItems(items.map((item) => (item.id === id ? { ...item, featured: !item.featured } : item)))
  }

  const toggleAvailable = (id: string) => {
    setItems(items.map((item) => (item.id === id ? { ...item, available: !item.available } : item)))
  }

  return (
    <>
      <div className="rounded-md border border-[#EAEAEA] overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full caption-bottom text-sm">
            <thead className="border-b border-[#EAEAEA] bg-[#F9FAFB]">
              <tr>
                <th className="h-12 w-12 px-4 text-left align-middle">
                  <Checkbox />
                </th>
                <th className="h-12 px-4 text-left align-middle font-medium text-[#6B7280]">
                  <Button
                    variant="ghost"
                    onClick={() => handleSort("name")}
                    className="flex items-center gap-1 hover:bg-transparent hover:text-[#1F1F1F] -ml-3"
                  >
                    Name
                    <ArrowUpDown className="h-4 w-4" />
                  </Button>
                </th>
                <th className="h-12 px-4 text-left align-middle font-medium text-[#6B7280]">
                  <Button
                    variant="ghost"
                    onClick={() => handleSort("category")}
                    className="flex items-center gap-1 hover:bg-transparent hover:text-[#1F1F1F] -ml-3"
                  >
                    Kategorie
                    <ArrowUpDown className="h-4 w-4" />
                  </Button>
                </th>
                <th className="h-12 px-4 text-left align-middle font-medium text-[#6B7280]">Diät-Optionen</th>
                <th className="h-12 px-4 text-right align-middle font-medium text-[#6B7280]">
                  <Button
                    variant="ghost"
                    onClick={() => handleSort("price")}
                    className="flex items-center gap-1 hover:bg-transparent hover:text-[#1F1F1F] -ml-3"
                  >
                    Preis
                    <ArrowUpDown className="h-4 w-4" />
                  </Button>
                </th>
                <th className="h-12 px-4 text-center align-middle font-medium text-[#6B7280]">Status</th>
                <th className="h-12 w-[100px] px-4 align-middle font-medium text-[#6B7280]">Aktionen</th>
              </tr>
            </thead>
            <tbody>
              {items.map((item) => (
                <tr key={item.id} className="border-b border-[#EAEAEA] hover:bg-[#F9FAFB] transition-colors">
                  <td className="p-4 align-middle">
                    <Checkbox />
                  </td>
                  <td className="p-4 align-middle font-medium text-[#1F1F1F]">
                    {item.name}
                    <div className="text-xs text-[#6B7280] line-clamp-1 mt-1">{item.description}</div>
                  </td>
                  <td className="p-4 align-middle">
                    {item.category && (
                      <Badge variant="outline" className="text-xs">
                        {item.category}
                      </Badge>
                    )}
                  </td>
                  <td className="p-4 align-middle">
                    <div className="flex flex-wrap gap-1">
                      {item.vegetarian && (
                        <Badge variant="outline" className="bg-[#F0FDF4] text-[#16A34A] border-[#DCFCE7] text-xs">
                          Vegetarisch
                        </Badge>
                      )}
                      {item.vegan && (
                        <Badge variant="outline" className="bg-[#ECFDF5] text-[#059669] border-[#D1FAE5] text-xs">
                          Vegan
                        </Badge>
                      )}
                      {item.glutenFree && (
                        <Badge variant="outline" className="bg-[#FEF3C7] text-[#D97706] border-[#FDE68A] text-xs">
                          Glutenfrei
                        </Badge>
                      )}
                    </div>
                  </td>
                  <td className="p-4 align-middle text-right font-medium">{item.price.toFixed(2)} €</td>
                  <td className="p-4 align-middle">
                    <div className="flex items-center justify-center gap-2">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8"
                        onClick={() => toggleFeatured(item.id)}
                        title={item.featured ? "Nicht mehr empfehlen" : "Als empfohlen markieren"}
                      >
                        {item.featured ? (
                          <Star className="h-4 w-4 text-[#F59E0B]" />
                        ) : (
                          <Star className="h-4 w-4 text-[#D1D5DB]" />
                        )}
                      </Button>

                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8"
                        onClick={() => toggleAvailable(item.id)}
                        title={item.available ? "Als nicht verfügbar markieren" : "Als verfügbar markieren"}
                      >
                        {item.available ? (
                          <Eye className="h-4 w-4 text-[#10B981]" />
                        ) : (
                          <EyeOff className="h-4 w-4 text-[#EF4444]" />
                        )}
                      </Button>
                    </div>
                  </td>
                  <td className="p-4 align-middle">
                    <div className="flex items-center justify-end">
                      <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => setEditingItem(item)}>
                        <Edit className="h-4 w-4" />
                        <span className="sr-only">Bearbeiten</span>
                      </Button>

                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon" className="h-8 w-8">
                            <MoreHorizontal className="h-4 w-4" />
                            <span className="sr-only">Aktionen</span>
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-[160px] bg-white border-[#EAEAEA]">
                          <DropdownMenuItem onClick={() => setEditingItem(item)}>
                            <Edit className="mr-2 h-4 w-4" />
                            Bearbeiten
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem className="text-red-500">Löschen</DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {editingItem && (
        <EditMenuItemDialog
          item={editingItem}
          open={!!editingItem}
          onOpenChange={(open) => !open && setEditingItem(null)}
        />
      )}
    </>
  )
}
