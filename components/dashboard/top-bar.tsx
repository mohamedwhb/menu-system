"use client"

import { useState } from "react"
import { Bell, LogOut, Menu, User, Settings, CreditCard } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuGroup,
} from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

export function TopBar() {
  const [showMobileSidebar, setShowMobileSidebar] = useState(false)

  return (
    <header className="sticky top-0 z-30 flex h-16 items-center bg-white border-b border-[#EAEAEA] px-4 md:px-6">
      <Button
        variant="ghost"
        size="icon"
        className="md:hidden mr-2 text-[#1F1F1F]"
        onClick={() => setShowMobileSidebar(!showMobileSidebar)}
      >
        <Menu className="h-5 w-5" />
        <span className="sr-only">Toggle menu</span>
      </Button>

      <div className="ml-auto flex items-center gap-4">
        <Button variant="ghost" size="icon" className="relative text-[#1F1F1F]">
          <Bell className="h-5 w-5" />
          <span className="absolute top-1 right-1 h-2 w-2 rounded-full bg-[#006AFF]"></span>
          <span className="sr-only">Notifications</span>
        </Button>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="relative h-10 w-10 rounded-full">
              <Avatar className="h-9 w-9">
                <AvatarImage src="/placeholder.svg" alt="Avatar" />
                <AvatarFallback className="bg-[#006AFF] text-white">MM</AvatarFallback>
              </Avatar>
              <span className="sr-only">Mein Account</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-56" align="end" forceMount>
            <DropdownMenuLabel className="font-normal">
              <div className="flex flex-col space-y-1">
                <p className="text-sm font-medium leading-none">Max Mustermann</p>
                <p className="text-xs leading-none text-muted-foreground">max@example.com</p>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuGroup>
              <DropdownMenuItem className="cursor-pointer flex items-center">
                <User className="mr-2 h-4 w-4" />
                <span>Profil</span>
              </DropdownMenuItem>
              <DropdownMenuItem className="cursor-pointer flex items-center">
                <Settings className="mr-2 h-4 w-4" />
                <span>Einstellungen</span>
              </DropdownMenuItem>
              <DropdownMenuItem className="cursor-pointer flex items-center">
                <CreditCard className="mr-2 h-4 w-4" />
                <span>Abrechnung</span>
              </DropdownMenuItem>
            </DropdownMenuGroup>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="cursor-pointer flex items-center text-red-600 focus:text-red-600 focus:bg-red-100">
              <LogOut className="mr-2 h-4 w-4" />
              <span>Abmelden</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  )
}
