"use client"

import type React from "react"
import { createContext, useContext, useState, useEffect } from "react"
import { useToast } from "@/hooks/use-toast"

interface FinanzOnlineSettings {
  enabled: boolean
  teilnehmerId: string
  benutzerId: string
  pin: string
  kassenId: string
  aesKey: string
  signatureDevice: string
  depExport: boolean
  exportPath: string
}

interface FinanzOnlineStatus {
  connected: boolean
  lastTest: Date | null
  lastTransmission: Date | null
  transmittedToday: number
  pendingTransmissions: number
}

interface FinanzOnlineContextType {
  settings: FinanzOnlineSettings
  status: FinanzOnlineStatus
  updateSettings: (settings: Partial<FinanzOnlineSettings>) => void
  testConnection: () => Promise<boolean>
  transmitNow: () => Promise<boolean>
  uploadCertificate: (file: File) => Promise<boolean>
  exportDEP: () => Promise<boolean>
  isLoading: boolean
}

const FinanzOnlineContext = createContext<FinanzOnlineContextType | undefined>(undefined)

export function FinanzOnlineProvider({ children }: { children: React.ReactNode }) {
  const { toast } = useToast()
  const [isLoading, setIsLoading] = useState(false)

  const [settings, setSettings] = useState<FinanzOnlineSettings>({
    enabled: true,
    teilnehmerId: "123456789",
    benutzerId: "demo_user",
    pin: "",
    kassenId: "QS-KASSE-001",
    aesKey: "",
    signatureDevice: "Software-Zertifikat",
    depExport: true,
    exportPath: "/var/exports/dep/",
  })

  const [status, setStatus] = useState<FinanzOnlineStatus>({
    connected: true,
    lastTest: new Date(Date.now() - 2 * 60 * 60 * 1000), // vor 2 Stunden
    lastTransmission: new Date(Date.now() - 4 * 60 * 60 * 1000), // vor 4 Stunden
    transmittedToday: 47,
    pendingTransmissions: 3,
  })

  // Simuliere regelmäßige Status-Updates
  useEffect(() => {
    const interval = setInterval(() => {
      if (settings.enabled) {
        setStatus((prev) => ({
          ...prev,
          transmittedToday: prev.transmittedToday + Math.floor(Math.random() * 3),
          pendingTransmissions: Math.max(0, prev.pendingTransmissions + Math.floor(Math.random() * 2) - 1),
        }))
      }
    }, 30000) // alle 30 Sekunden

    return () => clearInterval(interval)
  }, [settings.enabled])

  const updateSettings = (newSettings: Partial<FinanzOnlineSettings>) => {
    setSettings((prev) => ({ ...prev, ...newSettings }))
    toast({
      title: "Einstellungen gespeichert",
      description: "Die FinanzOnline-Einstellungen wurden erfolgreich aktualisiert.",
    })
  }

  const testConnection = async (): Promise<boolean> => {
    setIsLoading(true)
    try {
      // Simuliere API-Call
      await new Promise((resolve) => setTimeout(resolve, 2000))

      if (!settings.teilnehmerId || !settings.benutzerId) {
        throw new Error("Teilnehmer-ID und Benutzer-ID sind erforderlich")
      }

      const success = Math.random() > 0.2 // 80% Erfolgsrate

      if (success) {
        setStatus((prev) => ({
          ...prev,
          connected: true,
          lastTest: new Date(),
        }))
        toast({
          title: "Verbindung erfolgreich",
          description: "Die Verbindung zu FinanzOnline wurde erfolgreich getestet.",
        })
      } else {
        throw new Error("Verbindung fehlgeschlagen")
      }

      return success
    } catch (error) {
      setStatus((prev) => ({ ...prev, connected: false }))
      toast({
        title: "Verbindung fehlgeschlagen",
        description: error instanceof Error ? error.message : "Unbekannter Fehler",
        variant: "destructive",
      })
      return false
    } finally {
      setIsLoading(false)
    }
  }

  const transmitNow = async (): Promise<boolean> => {
    setIsLoading(true)
    try {
      await new Promise((resolve) => setTimeout(resolve, 3000))

      if (!status.connected) {
        throw new Error("Keine Verbindung zu FinanzOnline")
      }

      const transmitted = status.pendingTransmissions
      setStatus((prev) => ({
        ...prev,
        lastTransmission: new Date(),
        transmittedToday: prev.transmittedToday + transmitted,
        pendingTransmissions: 0,
      }))

      toast({
        title: "Übermittlung erfolgreich",
        description: `${transmitted} Belege wurden erfolgreich an FinanzOnline übermittelt.`,
      })
      return true
    } catch (error) {
      toast({
        title: "Übermittlung fehlgeschlagen",
        description: error instanceof Error ? error.message : "Unbekannter Fehler",
        variant: "destructive",
      })
      return false
    } finally {
      setIsLoading(false)
    }
  }

  const uploadCertificate = async (file: File): Promise<boolean> => {
    setIsLoading(true)
    try {
      await new Promise((resolve) => setTimeout(resolve, 2000))

      if (!file.name.endsWith(".p12") && !file.name.endsWith(".pfx")) {
        throw new Error("Nur .p12 oder .pfx Dateien sind erlaubt")
      }

      toast({
        title: "Zertifikat hochgeladen",
        description: `Zertifikat "${file.name}" wurde erfolgreich hochgeladen.`,
      })
      return true
    } catch (error) {
      toast({
        title: "Upload fehlgeschlagen",
        description: error instanceof Error ? error.message : "Unbekannter Fehler",
        variant: "destructive",
      })
      return false
    } finally {
      setIsLoading(false)
    }
  }

  const exportDEP = async (): Promise<boolean> => {
    setIsLoading(true)
    try {
      await new Promise((resolve) => setTimeout(resolve, 1500))

      toast({
        title: "DEP-Export erfolgreich",
        description: `DEP-Dateien wurden nach "${settings.exportPath}" exportiert.`,
      })
      return true
    } catch (error) {
      toast({
        title: "Export fehlgeschlagen",
        description: error instanceof Error ? error.message : "Unbekannter Fehler",
        variant: "destructive",
      })
      return false
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <FinanzOnlineContext.Provider
      value={{
        settings,
        status,
        updateSettings,
        testConnection,
        transmitNow,
        uploadCertificate,
        exportDEP,
        isLoading,
      }}
    >
      {children}
    </FinanzOnlineContext.Provider>
  )
}

export function useFinanzOnline() {
  const context = useContext(FinanzOnlineContext)
  if (context === undefined) {
    throw new Error("useFinanzOnline must be used within a FinanzOnlineProvider")
  }
  return context
}
