"use client"

import { useState } from "react"
import { Download, Edit, MoreHorizontal, Printer, Share2, ToggleLeft, ToggleRight, Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { EditQrCodeDialog } from "@/components/dashboard/qr-codes/edit-qr-code-dialog"
import { qrCodes } from "@/data/qr-codes"
import { QRCode } from "react-qr-code"

export function QrCodeGrid() {
  const [codes, setCodes] = useState(qrCodes)
  const [editingCode, setEditingCode] = useState<(typeof qrCodes)[0] | null>(null)

  const toggleActive = (id: string) => {
    setCodes(codes.map((code) => (code.id === id ? { ...code, active: !code.active } : code)))
  }

  const handlePrint = (code: (typeof qrCodes)[0]) => {
    const printWindow = window.open("", "_blank")
    if (printWindow) {
      printWindow.document.write(`
        <html>
          <head>
            <title>QR Code - ${code.tableName || `Tisch ${code.tableNumber}`}</title>
            <style>
              body { font-family: Arial, sans-serif; text-align: center; padding: 20px; }
              .qr-container { margin: 0 auto; max-width: 300px; }
              h2 { margin-bottom: 10px; }
              p { color: #6B7280; margin-bottom: 20px; }
            </style>
          </head>
          <body>
            <div class="qr-container">
              <h2>${code.tableName || `Tisch ${code.tableNumber}`}</h2>
              <p>Scannen Sie den QR-Code, um unser Menü zu sehen</p>
              <div id="qrcode" style="width: 256px; height: 256px; margin: 0 auto;"></div>
            </div>
            <script src="https://cdn.jsdelivr.net/npm/qrcode@1.5.1/build/qrcode.min.js"></script>
            <script>
              QRCode.toCanvas(document.getElementById('qrcode'), "${code.url}", function (error) {
                if (error) console.error(error);
                window.print();
              });
            </script>
          </body>
        </html>
      `)
      printWindow.document.close()
    }
  }

  return (
    <>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {codes.map((code) => (
          <div
            key={code.id}
            className="border border-[#EAEAEA] rounded-lg overflow-hidden bg-white hover:shadow-md transition-shadow"
          >
            <div className="p-6 flex flex-col items-center">
              <div className="relative mb-4">
                <div className="p-3 bg-white border border-[#EAEAEA] rounded-lg">
                  <QRCode value={code.url} size={150} />
                </div>
                {!code.active && (
                  <Badge variant="outline" className="absolute top-0 right-0 bg-red-50 text-red-500 border-red-100">
                    Inaktiv
                  </Badge>
                )}
              </div>

              <h3 className="text-lg font-medium text-center">{code.tableName || `Tisch ${code.tableNumber}`}</h3>
              <p className="text-sm text-[#6B7280] text-center mt-1 mb-4">
                {code.description || "Scannen für digitales Menü"}
              </p>

              <div className="flex flex-wrap justify-center gap-2 w-full">
                <Button variant="outline" size="sm" className="border-[#EAEAEA]" onClick={() => handlePrint(code)}>
                  <Printer className="h-4 w-4 mr-1" />
                  Drucken
                </Button>
                <Button variant="outline" size="sm" className="border-[#EAEAEA]">
                  <Download className="h-4 w-4 mr-1" />
                  PDF
                </Button>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" size="sm" className="border-[#EAEAEA]">
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-[200px] bg-white border-[#EAEAEA]">
                    <DropdownMenuItem onClick={() => setEditingCode(code)}>
                      <Edit className="mr-2 h-4 w-4" />
                      Bearbeiten
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => toggleActive(code.id)}>
                      {code.active ? (
                        <>
                          <ToggleLeft className="mr-2 h-4 w-4" />
                          Deaktivieren
                        </>
                      ) : (
                        <>
                          <ToggleRight className="mr-2 h-4 w-4" />
                          Aktivieren
                        </>
                      )}
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                      <Share2 className="mr-2 h-4 w-4" />
                      Teilen
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem className="text-red-500">
                      <Trash2 className="mr-2 h-4 w-4" />
                      Löschen
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>
          </div>
        ))}
      </div>

      {editingCode && (
        <EditQrCodeDialog
          qrCode={editingCode}
          open={!!editingCode}
          onOpenChange={(open) => !open && setEditingCode(null)}
        />
      )}
    </>
  )
}
