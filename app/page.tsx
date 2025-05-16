import Link from "next/link"
import { InfoIcon as InfoCircle } from "lucide-react"

export default function Home() {
  // Array of table numbers
  const tables = [1, 2, 3, 4, 5, 6]

  return (
    <main className="container mx-auto px-4 py-8 max-w-6xl">
      {/* Info Banner */}
      <div className="bg-blue-50 border border-blue-100 rounded-lg p-4 mb-8 flex items-center">
        <InfoCircle className="h-5 w-5 text-blue-500 mr-2 flex-shrink-0" />
        <p className="text-blue-700 text-sm">Simulieren Sie einen Scan durch Klick auf einen Tisch</p>
      </div>

      {/* Page Title */}
      <h1 className="text-2xl md:text-3xl font-semibold text-center mb-10">
        Willkommen – Bitte wählen Sie Ihren Tisch
      </h1>

      {/* QR Code Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {tables.map((tableNumber) => (
          <Link
            href={`/menu-example?tisch=${tableNumber}`}
            key={tableNumber}
            className="block bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 p-6 text-center border border-gray-100 hover:border-blue-100"
          >
            {/* QR Code Simulation */}
            <div className="mx-auto w-48 h-48 bg-white border border-gray-200 rounded-md p-3 mb-4">
              <div className="w-full h-full grid grid-cols-10 grid-rows-10 gap-1">
                {/* QR Code Pattern - Creating a simple pattern of dots */}
                {Array.from({ length: 100 }).map((_, index) => {
                  // Create a pattern that looks somewhat like a QR code
                  const isCornerSquare =
                    // Top-left corner pattern
                    (index < 30 && index % 10 < 3) ||
                    // Top-right corner pattern
                    (index < 30 && index % 10 > 6) ||
                    // Bottom-left corner pattern
                    (index > 69 && index % 10 < 3)

                  // Random dots for the middle part
                  const isRandomDot = !isCornerSquare && Math.random() > 0.65

                  return (
                    <div
                      key={index}
                      className={`${isCornerSquare || isRandomDot ? "bg-gray-800" : "bg-transparent"}`}
                    />
                  )
                })}
              </div>
            </div>

            {/* Table Label */}
            <h2 className="text-xl font-medium text-gray-800">Tisch {tableNumber}</h2>
            <p className="text-sm text-gray-500 mt-2">Klicken zum Bestellen</p>
          </Link>
        ))}
      </div>
    </main>
  )
}
