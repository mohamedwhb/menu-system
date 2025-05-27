"use client"

import { useState } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import SettingsHeader from "@/components/dashboard/settings/settings-header"
import GeneralTab from "@/components/dashboard/settings/tabs/general-tab"
import TaxTab from "@/components/dashboard/settings/tabs/tax-tab"
import ReceiptTab from "@/components/dashboard/settings/tabs/receipt-tab"
import PaymentTab from "@/components/dashboard/settings/tabs/payment-tab"
import OrderLogicTab from "@/components/dashboard/settings/tabs/order-logic-tab"
import PrivacyTab from "@/components/dashboard/settings/tabs/privacy-tab"
import UserManagementTab from "@/components/dashboard/settings/tabs/user-management-tab"
import FinanzOnlineTab from "@/components/dashboard/settings/tabs/finanzonline-tab"

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState("general")

  return (
    <div className="container mx-auto py-6 space-y-8">
      <SettingsHeader />

      <Tabs defaultValue="general" value={activeTab} onValueChange={setActiveTab} className="w-full">
        <div className="flex overflow-x-auto pb-2 mb-4">
          <TabsList className="h-auto flex flex-nowrap">
            <TabsTrigger value="general" className="px-4 py-2">
              Allgemein
            </TabsTrigger>
            <TabsTrigger value="tax" className="px-4 py-2">
              Umsatzsteuer
            </TabsTrigger>
            <TabsTrigger value="receipt" className="px-4 py-2">
              Kasse & Beleg
            </TabsTrigger>
            <TabsTrigger value="finanzonline" className="px-4 py-2">
              FinanzOnline
            </TabsTrigger>
            <TabsTrigger value="payment" className="px-4 py-2">
              Zahlung
            </TabsTrigger>
            <TabsTrigger value="order-logic" className="px-4 py-2">
              Bestelllogik
            </TabsTrigger>
            <TabsTrigger value="privacy" className="px-4 py-2">
              DSGVO & Tracking
            </TabsTrigger>
            <TabsTrigger value="user-management" className="px-4 py-2">
              Benutzerverwaltung
            </TabsTrigger>
          </TabsList>
        </div>

        <TabsContent value="general" className="mt-6">
          <GeneralTab />
        </TabsContent>

        <TabsContent value="tax" className="mt-6">
          <TaxTab />
        </TabsContent>

        <TabsContent value="receipt" className="mt-6">
          <ReceiptTab />
        </TabsContent>

        <TabsContent value="finanzonline" className="mt-6">
          <FinanzOnlineTab />
        </TabsContent>

        <TabsContent value="payment" className="mt-6">
          <PaymentTab />
        </TabsContent>

        <TabsContent value="order-logic" className="mt-6">
          <OrderLogicTab />
        </TabsContent>

        <TabsContent value="privacy" className="mt-6">
          <PrivacyTab />
        </TabsContent>

        <TabsContent value="user-management" className="mt-6">
          <UserManagementTab />
        </TabsContent>
      </Tabs>
    </div>
  )
}
