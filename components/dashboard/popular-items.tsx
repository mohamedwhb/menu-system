"use client"

import { Progress } from "@/components/ui/progress"

export function PopularItems() {
  // In einer echten Anwendung würden diese Daten von einer API kommen
  const popularItems = [
    {
      name: "Pizza Margherita",
      category: "Hauptgerichte",
      count: 48,
      percentage: 100,
    },
    {
      name: "Pasta Carbonara",
      category: "Hauptgerichte",
      count: 42,
      percentage: 87.5,
    },
    {
      name: "Tiramisu",
      category: "Desserts",
      count: 36,
      percentage: 75,
    },
    {
      name: "Caesar Salad",
      category: "Vorspeisen",
      count: 30,
      percentage: 62.5,
    },
    {
      name: "Espresso",
      category: "Getränke",
      count: 24,
      percentage: 50,
    },
  ]

  return (
    <div className="space-y-4">
      {popularItems.map((item) => (
        <div key={item.name} className="space-y-2">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium leading-none">{item.name}</p>
              <p className="text-xs text-muted-foreground">{item.category}</p>
            </div>
            <div className="text-sm font-medium">{item.count}x</div>
          </div>
          <Progress value={item.percentage} className="h-2" />
        </div>
      ))}
    </div>
  )
}
