"use client"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Search } from "lucide-react"

export function AllergensHeader() {
  return (
    <div className="border-b">
      <div className="flex h-16 items-center px-4 gap-4">
        <h1 className="text-lg font-semibold">Allergene & Inhaltsstoffe</h1>
        <div className="ml-auto flex items-center gap-4">
          <div className="relative">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input type="search" placeholder="Allergene suchen..." className="w-[200px] pl-8 md:w-[300px] bg-white" />
          </div>
          <Button variant="outline">Hilfe</Button>
        </div>
      </div>
    </div>
  )
}
