"use client"

import type React from "react"

import { CartProvider } from "@/contexts/cart-context"
import { CartDrawer } from "@/components/cart/cart-drawer"
import { CartButton } from "@/components/cart/cart-button"

export default function MenuLayout({ children }: { children: React.ReactNode }) {
  return (
    <CartProvider>
      <div className="min-h-screen">
        <header className="sticky top-0 z-10 bg-background border-b">
          <div className="container max-w-3xl mx-auto py-3 px-4 flex items-center justify-between">
            <h1 className="text-xl font-bold">Restaurant Name</h1>
            <CartButton />
          </div>
        </header>

        <main>{children}</main>

        <CartDrawer />
      </div>
    </CartProvider>
  )
}
