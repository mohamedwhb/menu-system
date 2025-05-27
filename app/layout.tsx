import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { CartProvider } from "@/contexts/cart-context"
import { MenuProvider } from "@/contexts/menu-context"
import { QRCodesProvider } from "@/contexts/qr-codes-context"
import { OrdersProvider } from "@/contexts/orders-context"
import { ThemeProvider } from "@/components/theme-provider"
import { Toaster } from "@/components/ui/toaster"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Restaurant POS & QR Code System",
  description: "Ein modernes POS-System mit QR-Code-Bestellung für Restaurants",
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="de">
      <body className={inter.className}>
        <ThemeProvider attribute="class" defaultTheme="light">
          <QRCodesProvider>
            <MenuProvider>
              <OrdersProvider>
                <CartProvider>
                  {children}
                  <Toaster />
                </CartProvider>
              </OrdersProvider>
            </MenuProvider>
          </QRCodesProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
