'use client';

import './globals.css';
import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import Header from "@/components/header"
import { CartProvider } from "../context/CartContext"
import { Toaster } from "@/components/ui/toaster"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Book Store",
  description: "Your favorite online bookstore",
  generator: "v0.dev",
}



export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <CartProvider>
          <Header />
          <main className="min-h-[calc(100vh-80px)] bg-gray-50">
            <div className="container mx-auto px-4 py-8">{children}</div>
          </main>
          <footer className="bg-gray-900 text-white py-12">
            <div className="container mx-auto px-4">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                <div>
                  <h3 className="font-bold text-lg mb-4">Book Store</h3>
                  <p className="text-gray-400 text-sm">
                    Your destination for the best books across all genres. Discover, read, and enjoy!
                  </p>
                </div>
                <div>
                  <h4 className="font-medium mb-4">Shop</h4>
                  <ul className="space-y-2 text-sm text-gray-400">
                    <li>
                      <a href="/books" className="hover:text-white">
                        All Books
                      </a>
                    </li>
                    <li>
                      <a href="/books?category=Fiction" className="hover:text-white">
                        Fiction
                      </a>
                    </li>
                    <li>
                      <a href="/books?category=Non-Fiction" className="hover:text-white">
                        Non-Fiction
                      </a>
                    </li>
                    <li>
                      <a href="/books?category=New" className="hover:text-white">
                        New Releases
                      </a>
                    </li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-medium mb-4">Account</h4>
                  <ul className="space-y-2 text-sm text-gray-400">
                    <li>
                      <a href="/account" className="hover:text-white">
                        My Account
                      </a>
                    </li>
                    <li>
                      <a href="/account/orders" className="hover:text-white">
                        Orders
                      </a>
                    </li>
                    <li>
                      <a href="/cart" className="hover:text-white">
                        Cart
                      </a>
                    </li>
                    <li>
                      <a href="/wishlist" className="hover:text-white">
                        Wishlist
                      </a>
                    </li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-medium mb-4">About</h4>
                  <ul className="space-y-2 text-sm text-gray-400">
                    <li>
                      <a href="/about" className="hover:text-white">
                        About Us
                      </a>
                    </li>
                    <li>
                      <a href="/contact" className="hover:text-white">
                        Contact
                      </a>
                    </li>
                    <li>
                      <a href="/faq" className="hover:text-white">
                        FAQ
                      </a>
                    </li>
                    <li>
                      <a href="/privacy" className="hover:text-white">
                        Privacy Policy
                      </a>
                    </li>
                  </ul>
                </div>
              </div>
              <div className="border-t border-gray-800 mt-8 pt-8 text-sm text-gray-400 text-center">
                <p>© {new Date().getFullYear()} Book Store. All rights reserved.</p>
              </div>
            </div>
          </footer>
          <Toaster />
        </CartProvider>
      </body>
    </html>
  )
}
