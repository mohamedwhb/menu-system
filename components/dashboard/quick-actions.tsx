"use client"

import { Button } from "@/components/ui/button"
import { PlusCircle, QrCode, FileText, Calendar, Settings, Users } from "lucide-react"
import Link from "next/link"

export function QuickActions() {
  const actions = [
    {
      title: "Menüelement hinzufügen",
      icon: PlusCircle,
      href: "/dashboard/menu",
      color: "text-green-500",
      bgColor: "bg-green-50",
    },
    {
      title: "QR-Code erstellen",
      icon: QrCode,
      href: "/dashboard/qr-codes",
      color: "text-blue-500",
      bgColor: "bg-blue-50",
    },
    {
      title: "Bestellungen anzeigen",
      icon: FileText,
      href: "/dashboard/orders",
      color: "text-amber-500",
      bgColor: "bg-amber-50",
    },
    {
      title: "Reservierung hinzufügen",
      icon: Calendar,
      href: "/dashboard/reservations",
      color: "text-purple-500",
      bgColor: "bg-purple-50",
    },
    {
      title: "Einstellungen",
      icon: Settings,
      href: "/dashboard/settings",
      color: "text-gray-500",
      bgColor: "bg-gray-50",
    },
    {
      title: "Benutzer verwalten",
      icon: Users,
      href: "/dashboard/settings",
      color: "text-indigo-500",
      bgColor: "bg-indigo-50",
    },
  ]

  return (
    <div className="grid grid-cols-2 gap-2">
      {actions.map((action) => (
        <Link href={action.href} key={action.title}>
          <Button
            variant="outline"
            className="w-full h-auto flex flex-col items-center justify-center py-4 px-2 gap-2 border-dashed hover:border-solid hover:bg-white"
          >
            <div className={`p-2 rounded-full ${action.bgColor}`}>
              <action.icon className={`h-5 w-5 ${action.color}`} />
            </div>
            <span className="text-xs text-center">{action.title}</span>
          </Button>
        </Link>
      ))}
    </div>
  )
}
