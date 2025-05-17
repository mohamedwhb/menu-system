import {
  LayoutDashboard,
  Menu,
  QrCode,
  CalendarClock,
  ShoppingCart,
  Map,
  Settings,
  AlertTriangle,
  Users,
} from "lucide-react"

export const sidebarItems = [
  {
    title: "Dashboard",
    href: "/dashboard",
    icon: LayoutDashboard,
  },
  {
    title: "Speisekarte",
    href: "/dashboard/menu",
    icon: Menu,
  },
  {
    title: "Allergene",
    href: "/dashboard/allergens",
    icon: AlertTriangle,
  },
  {
    title: "QR-Codes",
    href: "/dashboard/qr-codes",
    icon: QrCode,
  },
  {
    title: "Reservierungen",
    href: "/dashboard/reservations",
    icon: CalendarClock,
  },
  {
    title: "Bestellungen",
    href: "/dashboard/orders",
    icon: ShoppingCart,
  },
  {
    title: "Tischplan",
    href: "/dashboard/floor-plan",
    icon: Map,
  },
  {
    title: "Verifizierungscodes",
    href: "/dashboard/verification-codes",
    icon: Users,
  },
  {
    title: "Einstellungen",
    href: "/dashboard/settings",
    icon: Settings,
  },
]
