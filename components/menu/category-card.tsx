"use client"

import type React from "react"

import { useState } from "react"
import { ChevronDown, ChevronUp } from "lucide-react"
import { cn } from "@/lib/utils"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { motion, AnimatePresence } from "framer-motion"

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
  const [isExpanded, setIsExpanded] = useState(featured || true)

  return (
    <Card
      className={cn(
        "transition-all duration-300 overflow-hidden",
        featured && "border-primary/50 bg-primary/5",
        className,
      )}
      {...props}
    >
      <CardHeader
        className="flex flex-row items-center justify-between p-4 cursor-pointer"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <h3 className="font-semibold text-lg">{title}</h3>
            {featured && (
              <Badge variant="outline" className="text-xs bg-primary/10 text-primary border-primary/20">
                Empfohlen
              </Badge>
            )}
            <Badge variant="secondary" className="text-xs">
              {itemCount} {itemCount === 1 ? "Artikel" : "Artikel"}
            </Badge>
          </div>
          {description && <p className="text-sm text-muted-foreground">{description}</p>}
        </div>
        <Button
          variant="ghost"
          size="sm"
          className="h-8 w-8 p-0 rounded-full"
          aria-label={isExpanded ? "Kategorie einklappen" : "Kategorie ausklappen"}
        >
          {isExpanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
        </Button>
      </CardHeader>

      <AnimatePresence initial={false}>
        {isExpanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
          >
            <CardContent className="px-4 pb-4">{children}</CardContent>
          </motion.div>
        )}
      </AnimatePresence>
    </Card>
  )
}
