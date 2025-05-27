"use client"

import type React from "react"
import { createContext, useContext, useState, useEffect } from "react"

export interface Notification {
  id: string
  type: "order" | "reservation" | "system" | "payment" | "inventory"
  title: string
  message: string
  timestamp: Date
  isRead: boolean
  priority: "low" | "medium" | "high"
  actionUrl?: string
}

interface NotificationsContextType {
  notifications: Notification[]
  unreadCount: number
  markAsRead: (id: string) => void
  markAllAsRead: () => void
  addNotification: (notification: Omit<Notification, "id" | "timestamp" | "isRead">) => void
}

const NotificationsContext = createContext<NotificationsContextType | undefined>(undefined)

export function useNotifications() {
  const context = useContext(NotificationsContext)
  if (!context) {
    throw new Error("useNotifications must be used within a NotificationsProvider")
  }
  return context
}

// Mock-Daten für Benachrichtigungen
const mockNotifications: Notification[] = [
  {
    id: "1",
    type: "order",
    title: "Neue Bestellung",
    message: "Bestellung #1234 von Tisch 5 eingegangen",
    timestamp: new Date(Date.now() - 2 * 60 * 1000), // 2 Minuten ago
    isRead: false,
    priority: "high",
    actionUrl: "/dashboard/orders",
  },
  {
    id: "2",
    type: "order",
    title: "Bestellung bereit",
    message: "Bestellung #1230 für Tisch 3 ist fertig zum Servieren",
    timestamp: new Date(Date.now() - 5 * 60 * 1000), // 5 Minuten ago
    isRead: false,
    priority: "medium",
    actionUrl: "/dashboard/orders",
  },
  {
    id: "3",
    type: "reservation",
    title: "Neue Reservierung",
    message: "Reservierung für 4 Personen um 19:00 Uhr",
    timestamp: new Date(Date.now() - 10 * 60 * 1000), // 10 Minuten ago
    isRead: false,
    priority: "medium",
    actionUrl: "/dashboard/reservations",
  },
  {
    id: "4",
    type: "system",
    title: "Drucker offline",
    message: "Küchendrucker ist nicht erreichbar",
    timestamp: new Date(Date.now() - 15 * 60 * 1000), // 15 Minuten ago
    isRead: true,
    priority: "high",
    actionUrl: "/dashboard/settings",
  },
  {
    id: "5",
    type: "payment",
    title: "Zahlung eingegangen",
    message: "Kartenzahlung von €45.50 bestätigt",
    timestamp: new Date(Date.now() - 20 * 60 * 1000), // 20 Minuten ago
    isRead: true,
    priority: "low",
    actionUrl: "/dashboard/orders",
  },
  {
    id: "6",
    type: "inventory",
    title: "Lagerbestand niedrig",
    message: "Nur noch 3 Portionen Lachs verfügbar",
    timestamp: new Date(Date.now() - 30 * 60 * 1000), // 30 Minuten ago
    isRead: false,
    priority: "medium",
    actionUrl: "/dashboard/menu",
  },
]

export function NotificationsProvider({ children }: { children: React.ReactNode }) {
  const [notifications, setNotifications] = useState<Notification[]>(mockNotifications)

  const unreadCount = notifications.filter((n) => !n.isRead).length

  const markAsRead = (id: string) => {
    setNotifications((prev) =>
      prev.map((notification) => (notification.id === id ? { ...notification, isRead: true } : notification)),
    )
  }

  const markAllAsRead = () => {
    setNotifications((prev) => prev.map((notification) => ({ ...notification, isRead: true })))
  }

  const addNotification = (newNotification: Omit<Notification, "id" | "timestamp" | "isRead">) => {
    const notification: Notification = {
      ...newNotification,
      id: Date.now().toString(),
      timestamp: new Date(),
      isRead: false,
    }
    setNotifications((prev) => [notification, ...prev])
  }

  // Simuliere neue Benachrichtigungen alle 30 Sekunden
  useEffect(() => {
    const interval = setInterval(() => {
      const randomNotifications = [
        {
          type: "order" as const,
          title: "Neue Bestellung",
          message: `Bestellung #${Math.floor(Math.random() * 9999)} von Tisch ${Math.floor(Math.random() * 20) + 1}`,
          priority: "high" as const,
          actionUrl: "/dashboard/orders",
        },
        {
          type: "reservation" as const,
          title: "Reservierung storniert",
          message: "Reservierung für heute Abend wurde storniert",
          priority: "medium" as const,
          actionUrl: "/dashboard/reservations",
        },
        {
          type: "payment" as const,
          title: "Zahlung eingegangen",
          message: `Kartenzahlung von €${(Math.random() * 100).toFixed(2)} bestätigt`,
          priority: "low" as const,
          actionUrl: "/dashboard/orders",
        },
      ]

      if (Math.random() > 0.7) {
        // 30% Chance für neue Benachrichtigung
        const randomNotification = randomNotifications[Math.floor(Math.random() * randomNotifications.length)]
        addNotification(randomNotification)
      }
    }, 30000) // Alle 30 Sekunden

    return () => clearInterval(interval)
  }, [])

  return (
    <NotificationsContext.Provider
      value={{
        notifications,
        unreadCount,
        markAsRead,
        markAllAsRead,
        addNotification,
      }}
    >
      {children}
    </NotificationsContext.Provider>
  )
}
