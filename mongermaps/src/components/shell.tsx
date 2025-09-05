"use client"

import type React from "react"
import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Bird, LayoutDashboard, MapPin, Database, Globe, User, Search, Copy, Menu, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command"
import { cn } from "@/lib/utils"

const navigation = [
  { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { name: "Interactive Map", href: "/map/pattaya", icon: MapPin },
  { name: "Intel Database", href: "/intel-database", icon: Database },
  { name: "Global Rankings", href: "/global-rankings", icon: Globe },
  { name: "My Dossier", href: "/profile", icon: User },
]

export function Shell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const [searchOpen, setSearchOpen] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  return (
    <div className="flex h-screen bg-background">
      <aside
        className={cn(
          "w-64 fixed left-0 top-0 h-full bg-card border-r border-border flex flex-col z-50 transition-transform duration-200 ease-in-out",
          "md:translate-x-0", // Always visible on desktop
          mobileMenuOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0", // Hidden on mobile unless menu open
        )}
      >
        {/* Logo */}
        <div className="p-6 border-b border-border">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Bird className="h-8 w-8 text-foreground" />
              <span className="text-lg font-bold text-foreground">MongerMaps</span>
            </div>
            <Button variant="ghost" size="sm" className="md:hidden" onClick={() => setMobileMenuOpen(false)}>
              <X className="h-5 w-5" />
            </Button>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4">
          <ul className="space-y-2">
            {navigation.map((item) => {
              const Icon = item.icon
              const isActive = pathname === item.href
              return (
                <li key={item.name}>
                  <Link
                    href={item.href}
                    onClick={() => setMobileMenuOpen(false)}
                    className={cn(
                      "flex items-center space-x-3 px-3 py-2 rounded-md text-sm font-medium transition-colors",
                      isActive
                        ? "bg-accent text-accent-foreground"
                        : "text-muted-foreground hover:text-foreground hover:bg-accent",
                    )}
                  >
                    <Icon className="h-5 w-5" />
                    <span>{item.name}</span>
                  </Link>
                </li>
              )
            })}
          </ul>
        </nav>

        <div className="p-4">
          <Card className="border-border/50">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm">My Referral Code</CardTitle>
            </CardHeader>
            <CardContent className="pb-3">
              <Button variant="default" size="sm" className="w-full">
                <Copy className="h-4 w-4 mr-2" />
                Copy Link
              </Button>
            </CardContent>
            <CardFooter className="pt-0">
              <p className="text-xs text-muted-foreground">4 Referrals = 1 Year Free</p>
            </CardFooter>
          </Card>
        </div>
      </aside>

      {mobileMenuOpen && (
        <div className="fixed inset-0 bg-black/50 z-40 md:hidden" onClick={() => setMobileMenuOpen(false)} />
      )}

      <div className="flex-1 md:ml-64 flex flex-col min-w-0">
        {/* Top Header */}
        <header className="h-16 bg-card border-b border-border flex items-center justify-between px-4 md:px-6">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="sm" className="md:hidden" onClick={() => setMobileMenuOpen(true)}>
              <Menu className="h-5 w-5" />
            </Button>

            <div className="flex-1 max-w-md">
              <Button
                variant="outline"
                className="w-full justify-start text-muted-foreground bg-transparent"
                onClick={() => setSearchOpen(true)}
              >
                <Search className="h-4 w-4 mr-2" />
                <span className="hidden sm:inline">Search venues, reports, kinks...</span>
                <span className="sm:hidden">Search...</span>
              </Button>
            </div>
          </div>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="relative h-8 w-auto px-2 rounded-full">
                <div className="flex items-center space-x-2">
                  <Avatar className="h-8 w-8">
                    <AvatarFallback>
                      <User className="h-4 w-4" />
                    </AvatarFallback>
                  </Avatar>
                  <span className="text-sm font-medium hidden sm:inline">Veteran_77</span>
                </div>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56" align="end" forceMount>
              <DropdownMenuItem>
                <User className="mr-2 h-4 w-4" />
                <span>Profile</span>
              </DropdownMenuItem>
              <DropdownMenuItem>
                <span>Settings</span>
              </DropdownMenuItem>
              <DropdownMenuItem>
                <span>Logout</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </header>

        <main className="flex-1 overflow-auto min-w-0">{children}</main>
      </div>

      <CommandDialog open={searchOpen} onOpenChange={setSearchOpen}>
        <CommandInput placeholder="Search venues, reports, kinks..." />
        <CommandList>
          <CommandEmpty>No results found.</CommandEmpty>
          <CommandGroup heading="Venues">
            <CommandItem>Kinnaree</CommandItem>
            <CommandItem>Sapphire A Go Go</CommandItem>
            <CommandItem>Insomnia (FL)</CommandItem>
          </CommandGroup>
          <CommandGroup heading="Reports">
            <CommandItem>Recent Pattaya Updates</CommandItem>
            <CommandItem>Scam Alert: Walking Street</CommandItem>
          </CommandGroup>
        </CommandList>
      </CommandDialog>
    </div>
  )
}
