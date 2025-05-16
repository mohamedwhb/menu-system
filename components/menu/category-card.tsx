"use client"

import type React from "react"

import { useState } from "react"
import { ChevronDown, ChevronUp } from "lucide-react"
import { cn } from "@/lib/utils"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader } from "@/components/ui/card"

interface CategoryCardProps {
  title: string
  description?: string
  itemCount: number
  featured?: boolean
  className?: string
  children: React.ReactNode
}

export function CategoryCard({
  title,
  description,
  itemCount,
  featured = false,
  className,
  children,
  ...props
}: CategoryCardProps) {
  const [isExpanded, setIsExpanded] = useState(featured)

  return (
    <Card
      className={cn("transition-all duration-300", featured && "border-primary/50 bg-primary/5", className)}
      {...props}
    >
      <CardHeader className="flex flex-row items-center justify-between p-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <h3 className="font-semibold text-lg">{title}</h3>
            {featured && (
              <Badge variant="outline" className="text-xs">
                Empfohlen
              </Badge>
            )}
          </div>
          {description && <p className="text-sm text-muted-foreground">{description}</p>}
        </div>
        <Button
          variant="ghost"
          size="sm"
          className="h-8 w-8 p-0"
          onClick={() => setIsExpanded(!isExpanded)}
          aria-label={isExpanded ? "Kategorie einklappen" : "Kategorie ausklappen"}
        >
          {isExpanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
        </Button>
      </CardHeader>
      <CardContent
        className={cn(
          "grid transition-all duration-300 overflow-hidden",
          isExpanded ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0",
        )}
      >
        <div className="overflow-hidden">
          <div className="flex items-center justify-between text-sm text-muted-foreground mb-4">
            <span>
              {itemCount} {itemCount === 1 ? "Artikel" : "Artikel"}
            </span>
          </div>
          <div className="space-y-3">{children}</div>
        </div>
      </CardContent>
    </Card>
  )
}
