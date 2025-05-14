"use client"

import { useState } from "react"
import Link from "next/link"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { Button } from "@/components/ui/button"
import { BookOpen, BookPlus, Home, LayoutDashboard, Menu, Package, ShoppingCart, User, X } from "lucide-react"

const navLinks = [
  { href: "/", label: "Home", icon: Home },
  { href: "/books", label: "Browse Books", icon: BookOpen },
  { href: "/cart", label: "Shopping Cart", icon: ShoppingCart },
  { href: "/account", label: "My Account", icon: User },
  { href: "/account/orders", label: "Order History", icon: Package },
]

// Admin links
const adminLinks = [
  { href: "/admin/dashboard", label: "Admin Dashboard", icon: LayoutDashboard },
  { href: "/admin/add-book", label: "Add New Book", icon: BookPlus },
]

export default function MobileNav() {
  const [open, setOpen] = useState(false)

  // For demo purposes, we'll assume the user is staff/admin
  const isStaffOrAdmin = true

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" className="md:hidden">
          <Menu className="h-6 w-6" />
          <span className="sr-only">Toggle menu</span>
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="w-[300px] sm:w-[350px]">
        <div className="flex flex-col gap-4 py-4">
          <div className="flex items-center justify-between mb-4">
            <Link href="/" onClick={() => setOpen(false)}>
              <div className="font-bold text-xl">
                <span className="bg-black text-white px-2 py-1">BOOK</span>
                <span className="border border-black px-2 py-1">STORE</span>
              </div>
            </Link>
            <Button variant="ghost" size="icon" onClick={() => setOpen(false)}>
              <X className="h-5 w-5" />
            </Button>
          </div>
          <nav className="flex flex-col gap-1">
            {navLinks.map((link) => {
              const Icon = link.icon
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className="flex items-center gap-3 px-4 py-3 text-gray-700 hover:bg-gray-100 rounded-md"
                  onClick={() => setOpen(false)}
                >
                  <Icon className="h-5 w-5" />
                  <span>{link.label}</span>
                </Link>
              )
            })}

            {/* Admin links for mobile */}
            {isStaffOrAdmin && (
              <>
                <div className="px-4 py-2 mt-2">
                  <h3 className="text-sm font-semibold text-gray-500">Admin</h3>
                </div>
                {adminLinks.map((link) => {
                  const Icon = link.icon
                  return (
                    <Link
                      key={link.href}
                      href={link.href}
                      className="flex items-center gap-3 px-4 py-3 text-gray-700 hover:bg-gray-100 rounded-md"
                      onClick={() => setOpen(false)}
                    >
                      <Icon className="h-5 w-5" />
                      <span>{link.label}</span>
                    </Link>
                  )
                })}
              </>
            )}
          </nav>

          <div className="mt-auto pt-6">
            <div className="px-4 py-3 bg-gray-100 rounded-md">
              <div className="flex items-center gap-3 mb-2">
                <User className="h-5 w-5" />
                <span className="font-medium">Lisa</span>
              </div>
              <div className="flex gap-2">
                <Button
                  className="w-full bg-gray-800 hover:bg-gray-700"
                  onClick={() => {
                    // In a real app, you would clear auth tokens/cookies here
                    window.location.href = "/login"
                    setOpen(false)
                  }}
                >
                  Sign Out
                </Button>
              </div>
            </div>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  )
}
