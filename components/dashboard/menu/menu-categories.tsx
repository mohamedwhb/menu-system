"use client"

import { useState } from "react"
import { PlusCircle, Edit } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"

// Sample categories data
const initialCategories = [
  { id: "all", name: "Alle Gerichte", count: 24 },
  { id: "starters", name: "Vorspeisen", count: 6 },
  { id: "mains", name: "Hauptgerichte", count: 8 },
  { id: "desserts", name: "Desserts", count: 5 },
  { id: "drinks", name: "Getränke", count: 5 },
]

export function MenuCategories() {
  const [categories, setCategories] = useState(initialCategories)
  const [selectedCategory, setSelectedCategory] = useState("all")
  const [isEditing, setIsEditing] = useState(false)
  const [newCategoryName, setNewCategoryName] = useState("")

  const handleAddCategory = () => {
    if (newCategoryName.trim()) {
      const newId = newCategoryName.toLowerCase().replace(/\s+/g, "-")
      setCategories([...categories, { id: newId, name: newCategoryName, count: 0 }])
      setNewCategoryName("")
    }
  }

  return (
    <div className="rounded-lg border border-[#EAEAEA] bg-white p-6 shadow-sm">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-medium">Kategorien</h3>
        <Button variant="ghost" size="sm" onClick={() => setIsEditing(!isEditing)}>
          <Edit className="h-4 w-4" />
          <span className="sr-only">Kategorien bearbeiten</span>
        </Button>
      </div>

      <div className="space-y-1">
        {categories.map((category) => (
          <button
            key={category.id}
            className={cn(
              "flex items-center justify-between w-full px-3 py-2 text-sm rounded-md transition-colors",
              selectedCategory === category.id ? "bg-[#F0F7FF] text-[#006AFF]" : "text-[#1F1F1F] hover:bg-[#F7F7F7]",
            )}
            onClick={() => setSelectedCategory(category.id)}
          >
            <span>{category.name}</span>
            <Badge variant="outline" className="ml-auto">
              {category.count}
            </Badge>
          </button>
        ))}
      </div>

      {isEditing && (
        <div className="mt-4 pt-4 border-t border-[#EAEAEA]">
          <h4 className="text-sm font-medium mb-2">Neue Kategorie</h4>
          <div className="flex gap-2">
            <Input
              value={newCategoryName}
              onChange={(e) => setNewCategoryName(e.target.value)}
              placeholder="Kategoriename"
              className="h-9"
            />
            <Button size="sm" onClick={handleAddCategory} disabled={!newCategoryName.trim()}>
              <PlusCircle className="h-4 w-4" />
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}
