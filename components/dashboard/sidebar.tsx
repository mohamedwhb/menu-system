"use client"

import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { ChevronLeft } from "lucide-react"
import { cn } from "@/lib/utils"
import { sidebarItems } from "@/app/dashboard/sidebar-items"

export function DashboardSidebar() {
  const pathname = usePathname()
  const [collapsed, setCollapsed] = useState(false)

  return (
    <aside
      className={cn(
        "bg-white border-r border-[#EAEAEA] h-screen flex flex-col transition-all duration-300",
        collapsed ? "w-[70px]" : "w-[240px]",
      )}
    >
      <div className="p-4 flex items-center justify-between border-b border-[#EAEAEA]">
        <div className={cn("flex items-center", collapsed && "justify-center w-full")}>
          <div className="h-8 w-8 bg-[#006AFF] rounded flex items-center justify-center">
            <span className="font-bold text-white">R</span>
          </div>
          {!collapsed && <span className="ml-2 font-semibold text-[#1F1F1F]">RestaurantOS</span>}
        </div>
        <button
          onClick={() => setCollapsed(!collapsed)}
          className={cn(
            "h-8 w-8 rounded-full flex items-center justify-center hover:bg-[#F7F7F7] transition-colors",
            collapsed && "hidden",
          )}
        >
          <ChevronLeft size={18} className="text-[#1F1F1F]" />
        </button>
      </div>

      <nav className="flex-1 py-6">
        <ul className="space-y-1 px-2">
          {sidebarItems.map((item) => (
            <li key={item.href}>
              <Link
                href={item.href}
                className={cn(
                  "flex items-center gap-3 px-3 py-2 rounded-md transition-colors",
                  "hover:bg-[#F7F7F7]",
                  pathname === item.href ? "bg-[#F7F7F7] text-[#006AFF]" : "text-[#6B7280]",
                  collapsed && "justify-center px-0",
                )}
              >
                <item.icon size={20} />
                {!collapsed && <span>{item.title}</span>}
              </Link>
            </li>
          ))}
        </ul>
      </nav>

      <div className={cn("p-4 border-t border-[#EAEAEA] text-xs text-[#6B7280]", collapsed && "text-center")}>
        {collapsed ? "v1.0" : "RestaurantOS v1.0"}
      </div>
    </aside>
  )
}
