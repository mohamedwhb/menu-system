"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Copy } from "lucide-react"
import { toast } from "@/hooks/use-toast"

export function VerificationCodeHelper() {
  const [tableId, setTableId] = useState("")
  const [generatedCode, setGeneratedCode] = useState("")
  const [recentCodes, setRecentCodes] = useState<Array<{ tableId: string; code: string }>>([])

  // Generate a verification code based on table ID
  const generateCode = (id: string) => {
    if (!id.trim()) return ""
    return `RT${id.split("").reverse().join("")}`
  }

  const handleGenerate = () => {
    if (!tableId.trim()) return

    const code = generateCode(tableId)
    setGeneratedCode(code)

    // Add to recent codes (avoid duplicates)
    setRecentCodes((prev) => {
      const exists = prev.some((item) => item.tableId === tableId)
      if (exists) {
        return prev.map((item) => (item.tableId === tableId ? { ...item, code } : item))
      }
      return [{ tableId, code }, ...prev.slice(0, 9)] // Keep last 10 codes
    })
  }

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
    toast({
      title: "In die Zwischenablage kopiert",
      description: `"${text}" wurde in die Zwischenablage kopiert.`,
      duration: 2000,
    })
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Tischcode-Generator</CardTitle>
        <CardDescription>Generieren Sie Verifizierungscodes für Tische, um sie zu testen.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="table-id">Tischnummer eingeben</Label>
          <div className="flex gap-2">
            <Input id="table-id" value={tableId} onChange={(e) => setTableId(e.target.value)} placeholder="z.B. T42" />
            <Button onClick={handleGenerate} disabled={!tableId.trim()}>
              Generieren
            </Button>
          </div>
        </div>

        {generatedCode && (
          <div className="p-4 border rounded-md bg-muted/30">
            <div className="flex justify-between items-center">
              <div>
                <p className="text-sm font-medium">Tischnummer: {tableId}</p>
                <p className="text-lg font-bold mt-1">Code: {generatedCode}</p>
              </div>
              <Button
                variant="outline"
                size="icon"
                onClick={() => copyToClipboard(generatedCode)}
                title="In die Zwischenablage kopieren"
              >
                <Copy className="h-4 w-4" />
              </Button>
            </div>
          </div>
        )}

        {recentCodes.length > 0 && (
          <div className="mt-6">
            <h3 className="text-sm font-medium mb-2">Zuletzt generierte Codes</h3>
            <div className="border rounded-md overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Tischnummer</TableHead>
                    <TableHead>Code</TableHead>
                    <TableHead className="w-[50px]"></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {recentCodes.map((item, index) => (
                    <TableRow key={index}>
                      <TableCell>{item.tableId}</TableCell>
                      <TableCell className="font-medium">{item.code}</TableCell>
                      <TableCell>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => copyToClipboard(item.code)}
                          title="In die Zwischenablage kopieren"
                        >
                          <Copy className="h-4 w-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </div>
        )}
      </CardContent>
      <CardFooter className="flex justify-between">
        <p className="text-xs text-muted-foreground">
          Hinweis: Die Codes werden durch Umkehrung der Tischnummer und Hinzufügen des Präfixes "RT" generiert.
        </p>
      </CardFooter>
    </Card>
  )
}
