"use client"

import type React from "react"
import { createContext, useContext, useState, useEffect } from "react"

export interface QRCodeData {
  id: string
  tableNumber: string
  tableName?: string
  description: string
  url: string
  active: boolean
  createdAt: string
  qrColor: string
  bgColor: string
  logoEnabled?: boolean
  logo?: string
}

interface QRCodesContextType {
  qrCodes: QRCodeData[]
  addQRCode: (qrCode: Omit<QRCodeData, "id" | "createdAt">) => void
  updateQRCode: (id: string, updates: Partial<QRCodeData>) => void
  deleteQRCode: (id: string) => void
  toggleQRCodeActive: (id: string) => void
}

const QRCodesContext = createContext<QRCodesContextType | undefined>(undefined)

const defaultQRCodes: QRCodeData[] = [
  {
    id: "qr-1",
    tableNumber: "1",
    tableName: "Terrasse 1",
    description: "Scannen Sie den QR-Code, um unser digitales Menü zu öffnen",
    url: "/menu-example?tisch=1",
    active: true,
    createdAt: "2023-05-10T10:30:00Z",
    qrColor: "#000000",
    bgColor: "#FFFFFF",
  },
  {
    id: "qr-2",
    tableNumber: "2",
    description: "Scannen Sie den QR-Code, um unser digitales Menü zu öffnen",
    url: "/menu-example?tisch=2",
    active: true,
    createdAt: "2023-05-10T10:35:00Z",
    qrColor: "#006AFF",
    bgColor: "#FFFFFF",
  },
  {
    id: "qr-3",
    tableNumber: "3",
    tableName: "Fensterplatz",
    description: "Scannen Sie den QR-Code, um unser digitales Menü zu öffnen",
    url: "/menu-example?tisch=3",
    active: false,
    createdAt: "2023-05-10T10:40:00Z",
    qrColor: "#000000",
    bgColor: "#FFFFFF",
  },
  {
    id: "qr-4",
    tableNumber: "4",
    description: "Scannen Sie den QR-Code, um unser digitales Menü zu öffnen",
    url: "/menu-example?tisch=4",
    active: true,
    createdAt: "2023-05-10T10:45:00Z",
    qrColor: "#000000",
    bgColor: "#FFFFFF",
  },
  {
    id: "qr-5",
    tableNumber: "5",
    tableName: "Bar 1",
    description: "Scannen Sie den QR-Code, um unser digitales Menü zu öffnen",
    url: "/menu-example?tisch=5",
    active: true,
    createdAt: "2023-05-10T10:50:00Z",
    qrColor: "#000000",
    bgColor: "#FFFFFF",
    logoEnabled: true,
    logo: "/restaurant-logo.png",
  },
  {
    id: "qr-6",
    tableNumber: "6",
    description: "Scannen Sie den QR-Code, um unser digitales Menü zu öffnen",
    url: "/menu-example?tisch=6",
    active: true,
    createdAt: "2023-05-10T10:55:00Z",
    qrColor: "#000000",
    bgColor: "#FFFFFF",
  },
]

export function QRCodesProvider({ children }: { children: React.ReactNode }) {
  const [qrCodes, setQRCodes] = useState<QRCodeData[]>(defaultQRCodes)

  // Load QR codes from localStorage on mount
  useEffect(() => {
    const savedQRCodes = localStorage.getItem("restaurant-qr-codes")
    if (savedQRCodes) {
      try {
        const parsed = JSON.parse(savedQRCodes)
        setQRCodes(parsed)
      } catch (error) {
        console.error("Error loading QR codes from localStorage:", error)
      }
    }
  }, [])

  // Save QR codes to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem("restaurant-qr-codes", JSON.stringify(qrCodes))
  }, [qrCodes])

  const addQRCode = (qrCodeData: Omit<QRCodeData, "id" | "createdAt">) => {
    const newQRCode: QRCodeData = {
      ...qrCodeData,
      id: `qr-${Date.now()}`,
      createdAt: new Date().toISOString(),
    }
    setQRCodes((prev) => [...prev, newQRCode])
  }

  const updateQRCode = (id: string, updates: Partial<QRCodeData>) => {
    setQRCodes((prev) => prev.map((qr) => (qr.id === id ? { ...qr, ...updates } : qr)))
  }

  const deleteQRCode = (id: string) => {
    setQRCodes((prev) => prev.filter((qr) => qr.id !== id))
  }

  const toggleQRCodeActive = (id: string) => {
    setQRCodes((prev) => prev.map((qr) => (qr.id === id ? { ...qr, active: !qr.active } : qr)))
  }

  return (
    <QRCodesContext.Provider
      value={{
        qrCodes,
        addQRCode,
        updateQRCode,
        deleteQRCode,
        toggleQRCodeActive,
      }}
    >
      {children}
    </QRCodesContext.Provider>
  )
}

export function useQRCodes() {
  const context = useContext(QRCodesContext)
  if (context === undefined) {
    throw new Error("useQRCodes must be used within a QRCodesProvider")
  }
  return context
}
