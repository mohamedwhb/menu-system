"use client"

import type React from "react"

import { CartProvider } from "@/contexts/cart-context"
import { CartDrawer } from "@/components/cart/cart-drawer"

export default function MenuLayout({ children }: { children: React.ReactNode }) {
  return (
    <CartProvider>
      <div className="min-h-screen">
        <main>{children}</main>

        <CartDrawer />
      </div>
    </CartProvider>
  )
}
