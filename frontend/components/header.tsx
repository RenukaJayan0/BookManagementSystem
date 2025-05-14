"use client"

import type React from "react"

import { useState } from "react"
import Link from "next/link"
import { Search, ShoppingCart, BookPlus, LayoutDashboard } from "lucide-react"
import { useCart } from "@/components/cart-provider"
import MobileNav from "@/components/mobile-nav"
import { Button } from "@/components/ui/button"
import { useRouter } from "next/navigation"

export default function Header() {
  const [searchQuery, setSearchQuery] = useState("")
  const { cartItems } = useCart()
  const router = useRouter()

  const cartItemCount = cartItems.reduce((total, item) => total + item.quantity, 0)

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      router.push(`/books?search=${encodeURIComponent(searchQuery)}`)
    }
  }

  // For demo purposes, we'll assume the user is staff/admin
  const isStaffOrAdmin = true

  return (
    <header className="border-b sticky top-0 bg-white z-40">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        <div className="flex items-center">
          <MobileNav />

          <Link href="/" className="flex-shrink-0">
            <div className="font-bold text-xl md:text-2xl">
              <span className="bg-black text-white px-2 py-1">BOOK</span>
              <span className="border border-black px-2 py-1">STORE</span>
            </div>
          </Link>

          <nav className="hidden md:flex ml-8 space-x-6">
            <Link href="/" className="text-gray-600 hover:text-gray-900">
              Home
            </Link>
            <Link href="/books" className="text-gray-600 hover:text-gray-900">
              Books
            </Link>
            <Link href="/cart" className="text-gray-600 hover:text-gray-900">
              Cart
            </Link>

            {/* Admin/Staff Shortcuts */}
            {isStaffOrAdmin && (
              <div className="relative group">
                <button className="text-gray-600 hover:text-gray-900 flex items-center gap-1 group-hover:text-gray-900">
                  Admin <span className="text-xs">▼</span>
                </button>
                <div className="absolute left-0 mt-2 w-48 bg-white rounded-md shadow-lg border border-gray-200 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
                  <div className="py-1">
                    <Link
                      href="/admin/dashboard"
                      className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    >
                      <LayoutDashboard className="h-4 w-4" />
                      <span>Dashboard</span>
                    </Link>
                    <Link
                      href="/admin/add-book"
                      className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    >
                      <BookPlus className="h-4 w-4" />
                      <span>Add New Book</span>
                    </Link>
                  </div>
                </div>
              </div>
            )}
          </nav>
        </div>

        <div className="flex-1 max-w-xl mx-4 hidden md:block">
          <form onSubmit={handleSearch} className="relative flex items-center">
            <input
              type="text"
              placeholder="Search for books, authors, or genres..."
              className="w-full bg-white border-2 border-gray-200 rounded-full px-5 py-2.5 pr-12 text-sm transition-all focus:outline-none focus:ring-2 focus:ring-gray-800 focus:border-transparent shadow-sm hover:shadow"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <Button
              type="submit"
              variant="ghost"
              size="icon"
              className="absolute right-1 rounded-full h-8 w-8 hover:bg-gray-100"
            >
              <Search className="h-4 w-4 text-gray-600" />
            </Button>
          </form>
        </div>

        <div className="flex items-center gap-4">
          {/* Admin Quick Actions */}
          {isStaffOrAdmin && (
            <div className="hidden sm:flex">
              <Link href="/admin/add-book">
                <Button variant="outline" size="sm" className="flex items-center gap-1">
                  <BookPlus className="h-4 w-4" />
                  <span className="hidden md:inline">Add Book</span>
                </Button>
              </Link>
            </div>
          )}

          <Link href="/cart" className="relative">
            <ShoppingCart className="h-6 w-6" />
            {cartItemCount > 0 && (
              <span className="absolute -top-2 -right-2 bg-red-600 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                {cartItemCount}
              </span>
            )}
          </Link>

          <div className="hidden md:flex items-center gap-2">
            <div className="flex flex-col items-end">
              <span className="text-sm text-gray-600">welcome back</span>
              <span className="text-sm font-medium">Lisa</span>
            </div>
            <img src="/abstract-geometric-shapes.png" alt="User" className="w-8 h-8 rounded-full" />
          </div>

          <Button
            variant="secondary"
            className="bg-gray-800 text-white hover:bg-gray-700"
            onClick={() => {
              // In a real app, you would clear auth tokens/cookies here
              router.push("/login")
            }}
          >
            LogOut
          </Button>
        </div>
      </div>

      {/* Mobile search bar */}
      <div className="md:hidden px-4 pb-4">
        <form onSubmit={handleSearch} className="relative flex items-center">
          <input
            type="text"
            placeholder="Search for books, authors, or genres..."
            className="w-full bg-white border-2 border-gray-200 rounded-full px-5 py-2.5 pr-12 text-sm transition-all focus:outline-none focus:ring-2 focus:ring-gray-800 focus:border-transparent shadow-sm hover:shadow"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <Button
            type="submit"
            variant="ghost"
            size="icon"
            className="absolute right-1 rounded-full h-8 w-8 hover:bg-gray-100"
          >
            <Search className="h-4 w-4 text-gray-600" />
          </Button>
        </form>
      </div>
    </header>
  )
}
