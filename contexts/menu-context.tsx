"use client"

import type React from "react"
import { createContext, useContext, useState, useEffect } from "react"
import { menuItems as initialMenuItems } from "@/data/menu-items"
import { allergens as initialAllergens } from "@/data/allergens"
import { categories as initialCategories } from "@/data/categories"

export interface MenuItem {
  id: string
  name: string
  description: string
  price: number
  category: string
  image?: string
  vegetarian?: boolean
  vegan?: boolean
  glutenFree?: boolean
  featured?: boolean
  available?: boolean
  allergens?: string[] // IDs der Allergene
  ingredients?: string[] // Liste der Inhaltsstoffe
}

export interface Allergen {
  id: string
  name: string
  description: string
  icon?: string
  severity: "low" | "medium" | "high"
}

export interface Category {
  id: string
  name: string
  description?: string
  icon?: string
  order: number
  active: boolean
}

interface MenuContextType {
  menuItems: MenuItem[]
  allergens: Allergen[]
  categories: Category[]
  addMenuItem: (item: Omit<MenuItem, "id">) => void
  updateMenuItem: (id: string, item: Partial<MenuItem>) => void
  deleteMenuItem: (id: string) => void
  toggleFeatured: (id: string) => void
  toggleAvailable: (id: string) => void
  getMenuItemsByCategory: (category: string) => MenuItem[]
  getFeaturedItems: () => MenuItem[]
  addAllergen: (allergen: Omit<Allergen, "id">) => void
  updateAllergen: (id: string, allergen: Partial<Allergen>) => void
  deleteAllergen: (id: string) => void
  getAllergenById: (id: string) => Allergen | undefined
  addCategory: (category: Omit<Category, "id">) => void
  updateCategory: (id: string, category: Partial<Category>) => void
  deleteCategory: (id: string) => void
  getCategoryById: (id: string) => Category | undefined
  getActiveCategories: () => Category[]
  getItemCountByCategory: (categoryId: string) => number
  reorderCategories: (newOrder: string[]) => void
}

const MenuContext = createContext<MenuContextType | undefined>(undefined)

export function MenuProvider({ children }: { children: React.ReactNode }) {
  const [menuItems, setMenuItems] = useState<MenuItem[]>(initialMenuItems)
  const [allergens, setAllergens] = useState<Allergen[]>(initialAllergens)
  const [categories, setCategories] = useState<Category[]>(initialCategories)

  // Load data from localStorage on mount (client-side only)
  useEffect(() => {
    try {
      const savedMenu = localStorage.getItem("menuItems")
      if (savedMenu) {
        setMenuItems(JSON.parse(savedMenu))
      }

      const savedAllergens = localStorage.getItem("allergens")
      if (savedAllergens) {
        setAllergens(JSON.parse(savedAllergens))
      }

      const savedCategories = localStorage.getItem("categories")
      if (savedCategories) {
        setCategories(JSON.parse(savedCategories))
      }
    } catch (error) {
      console.error("Failed to load data from localStorage:", error)
    }
  }, [])

  // Save data to localStorage when they change
  useEffect(() => {
    try {
      localStorage.setItem("menuItems", JSON.stringify(menuItems))
    } catch (error) {
      console.error("Failed to save menu to localStorage:", error)
    }
  }, [menuItems])

  useEffect(() => {
    try {
      localStorage.setItem("allergens", JSON.stringify(allergens))
    } catch (error) {
      console.error("Failed to save allergens to localStorage:", error)
    }
  }, [allergens])

  useEffect(() => {
    try {
      localStorage.setItem("categories", JSON.stringify(categories))
    } catch (error) {
      console.error("Failed to save categories to localStorage:", error)
    }
  }, [categories])

  // Menüelement-Funktionen
  const addMenuItem = (item: Omit<MenuItem, "id">) => {
    const id = item.name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "")

    setMenuItems((prev) => [...prev, { ...item, id }])
  }

  const updateMenuItem = (id: string, item: Partial<MenuItem>) => {
    setMenuItems((prev) => prev.map((menuItem) => (menuItem.id === id ? { ...menuItem, ...item } : menuItem)))
  }

  const deleteMenuItem = (id: string) => {
    setMenuItems((prev) => prev.filter((item) => item.id !== id))
  }

  const toggleFeatured = (id: string) => {
    setMenuItems((prev) => prev.map((item) => (item.id === id ? { ...item, featured: !item.featured } : item)))
  }

  const toggleAvailable = (id: string) => {
    setMenuItems((prev) => prev.map((item) => (item.id === id ? { ...item, available: !item.available } : item)))
  }

  const getMenuItemsByCategory = (category: string) => {
    return menuItems.filter((item) => item.category === category && item.available !== false)
  }

  const getFeaturedItems = () => {
    return menuItems.filter((item) => item.featured && item.available !== false)
  }

  // Allergene-Funktionen
  const addAllergen = (allergen: Omit<Allergen, "id">) => {
    const id = allergen.name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "")

    setAllergens((prev) => [...prev, { ...allergen, id }])
  }

  const updateAllergen = (id: string, allergen: Partial<Allergen>) => {
    setAllergens((prev) => prev.map((item) => (item.id === id ? { ...item, ...allergen } : item)))
  }

  const deleteAllergen = (id: string) => {
    // Entferne das Allergen aus der Liste
    setAllergens((prev) => prev.filter((item) => item.id !== id))

    // Entferne das Allergen auch aus allen Menüelementen
    setMenuItems((prev) =>
      prev.map((item) => {
        if (item.allergens?.includes(id)) {
          return {
            ...item,
            allergens: item.allergens.filter((allergenId) => allergenId !== id),
          }
        }
        return item
      }),
    )
  }

  const getAllergenById = (id: string) => {
    return allergens.find((allergen) => allergen.id === id)
  }

  // Kategorie-Funktionen
  const addCategory = (category: Omit<Category, "id">) => {
    const id = category.name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "")

    // Finde die höchste Reihenfolge und füge die neue Kategorie am Ende hinzu
    const maxOrder = categories.reduce((max, cat) => (cat.order > max ? cat.order : max), 0)

    setCategories((prev) => [...prev, { ...category, id, order: category.order || maxOrder + 1 }])
  }

  const updateCategory = (id: string, category: Partial<Category>) => {
    setCategories((prev) => prev.map((item) => (item.id === id ? { ...item, ...category } : item)))
  }

  const deleteCategory = (id: string) => {
    // Entferne die Kategorie aus der Liste
    setCategories((prev) => prev.filter((item) => item.id !== id))

    // Setze die Kategorie aller betroffenen Menüelemente auf "uncategorized"
    setMenuItems((prev) =>
      prev.map((item) => {
        if (item.category === id) {
          return {
            ...item,
            category: "uncategorized",
          }
        }
        return item
      }),
    )
  }

  const getCategoryById = (id: string) => {
    return categories.find((category) => category.id === id)
  }

  const getActiveCategories = () => {
    return categories.filter((category) => category.active).sort((a, b) => a.order - b.order)
  }

  const getItemCountByCategory = (categoryId: string) => {
    return menuItems.filter((item) => item.category === categoryId && item.available !== false).length
  }

  const reorderCategories = (newOrder: string[]) => {
    // Aktualisiere die Reihenfolge der Kategorien basierend auf der neuen Reihenfolge der IDs
    const updatedCategories = [...categories]
    newOrder.forEach((id, index) => {
      const categoryIndex = updatedCategories.findIndex((cat) => cat.id === id)
      if (categoryIndex !== -1) {
        updatedCategories[categoryIndex] = { ...updatedCategories[categoryIndex], order: index }
      }
    })
    setCategories(updatedCategories)
  }

  return (
    <MenuContext.Provider
      value={{
        menuItems,
        allergens,
        categories,
        addMenuItem,
        updateMenuItem,
        deleteMenuItem,
        toggleFeatured,
        toggleAvailable,
        getMenuItemsByCategory,
        getFeaturedItems,
        addAllergen,
        updateAllergen,
        deleteAllergen,
        getAllergenById,
        addCategory,
        updateCategory,
        deleteCategory,
        getCategoryById,
        getActiveCategories,
        getItemCountByCategory,
        reorderCategories,
      }}
    >
      {children}
    </MenuContext.Provider>
  )
}

export function useMenu() {
  const context = useContext(MenuContext)
  if (context === undefined) {
    throw new Error("useMenu must be used within a MenuProvider")
  }
  return context
}
