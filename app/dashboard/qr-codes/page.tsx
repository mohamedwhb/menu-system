import { QrCodeHeader } from "@/components/dashboard/qr-codes/qr-code-header"
import { QrCodeGrid } from "@/components/dashboard/qr-codes/qr-code-grid"
import { QrCodeFilter } from "@/components/dashboard/qr-codes/qr-code-filter"

export default function QrCodesPage() {
  return (
    <div className="space-y-6">
      <QrCodeHeader />

      <div className="rounded-lg border border-[#EAEAEA] bg-white p-6 shadow-sm">
        <QrCodeFilter />
        <QrCodeGrid />
      </div>
    </div>
  )
}
