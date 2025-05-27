"use client"

import type React from "react"
import { createContext, useState, useEffect, useContext, type ReactNode } from "react"

export interface OrderItem {
  id: string
  name: string
  price: number
  quantity: number
  options?: string
}

export interface OrderCustomer {
  name: string
  phone: string
  email: string
  since: string
  orderCount: number
  averageOrderValue: number
  address?: {
    street: string
    zip: string
    city: string
  }
}

export interface Order {
  id: string
  table: string
  date: string
  time: string
  items: OrderItem[]
  amount: number
  status: "new" | "in-progress" | "completed" | "cancelled"
  paymentMethod: string
  notes?: string
  discount: number
  customer?: OrderCustomer
  auditLog: Array<{
    timestamp: string
    action: string
    details: string
    user: string
  }>
}

interface OrdersContextType {
  orders: Order[]
  addOrder: (order: Omit<Order, "id" | "auditLog">) => void
  updateOrder: (orderId: string, updates: Partial<Order>) => void
  getOrderById: (id: string) => Order | undefined
}

const OrdersContext = createContext<OrdersContextType | undefined>(undefined)

interface OrdersProviderProps {
  children: ReactNode
}

export const OrdersProvider: React.FC<OrdersProviderProps> = ({ children }) => {
  const [orders, setOrders] = useState<Order[]>([])

  useEffect(() => {
    const storedOrders = localStorage.getItem("restaurant-orders")
    if (storedOrders) {
      try {
        setOrders(JSON.parse(storedOrders))
      } catch (error) {
        console.error("Error parsing stored orders:", error)
        setOrders([])
      }
    }
  }, [])

  useEffect(() => {
    if (orders.length > 0) {
      localStorage.setItem("restaurant-orders", JSON.stringify(orders))
    }
  }, [orders])

  const addOrder = (orderData: Omit<Order, "id" | "auditLog">) => {
    const newOrder: Order = {
      ...orderData,
      id: `ORD-${Date.now()}`,
      auditLog: [
        {
          timestamp: new Date().toISOString(),
          action: "Bestellung erstellt",
          details: `Bestellung mit ${orderData.items.length} Artikeln erstellt`,
          user: "System",
        },
      ],
    }

    setOrders((prevOrders) => [...prevOrders, newOrder])
  }

  const updateOrder = (orderId: string, updates: Partial<Order>) => {
    setOrders((prevOrders) =>
      prevOrders.map((order) => {
        if (order.id === orderId) {
          const updatedOrder = { ...order, ...updates }

          // Add audit log entry
          const auditEntry = {
            timestamp: new Date().toISOString(),
            action: "Bestellung aktualisiert",
            details: Object.keys(updates).join(", ") + " geändert",
            user: "Dashboard User",
          }

          updatedOrder.auditLog = [...(order.auditLog || []), auditEntry]

          return updatedOrder
        }
        return order
      }),
    )
  }

  const getOrderById = (id: string) => {
    return orders.find((order) => order.id === id)
  }

  const value = {
    orders,
    addOrder,
    updateOrder,
    getOrderById,
  }

  return <OrdersContext.Provider value={value}>{children}</OrdersContext.Provider>
}

export const useOrders = () => {
  const context = useContext(OrdersContext)
  if (!context) {
    throw new Error("useOrders must be used within a OrdersProvider")
  }
  return context
}
