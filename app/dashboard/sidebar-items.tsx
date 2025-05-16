import {
  BarChart3,
  CalendarDays,
  ClipboardList,
  CreditCard,
  Home,
  LayoutGrid,
  QrCode,
  Settings,
  ShieldCheck,
  Users,
} from "lucide-react"

export const sidebarItems = [
  {
    title: "Dashboard",
    href: "/dashboard",
    icon: Home,
  },
  {
    title: "Bestellungen",
    href: "/dashboard/orders",
    icon: ClipboardList,
  },
  {
    title: "Speisekarte",
    href: "/dashboard/menu",
    icon: CreditCard,
  },
  {
    title: "Reservierungen",
    href: "/dashboard/reservations",
    icon: CalendarDays,
  },
  {
    title: "Tischplan",
    href: "/dashboard/floor-plan",
    icon: LayoutGrid,
  },
  {
    title: "QR-Codes",
    href: "/dashboard/qr-codes",
    icon: QrCode,
  },
  {
    title: "Tischverifizierung",
    href: "/dashboard/verification-codes",
    icon: ShieldCheck,
  },
  {
    title: "Statistiken",
    href: "/dashboard/statistics",
    icon: BarChart3,
  },
  {
    title: "Mitarbeiter",
    href: "/dashboard/staff",
    icon: Users,
  },
  {
    title: "Einstellungen",
    href: "/dashboard/settings",
    icon: Settings,
  },
]
