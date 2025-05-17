import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { CartProvider } from "@/contexts/cart-context"
import { MenuProvider } from "@/contexts/menu-context"
import { ThemeProvider } from "@/components/theme-provider"

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
          <MenuProvider>
            <CartProvider>{children}</CartProvider>
          </MenuProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
