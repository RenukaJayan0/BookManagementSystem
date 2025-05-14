"use client"

import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import Link from "next/link"
import { Package, User, Settings } from "lucide-react"

export default function OrderHistoryPage() {
  // Sample order history data
  const orderHistory = [
    {
      id: "ORD-123456",
      date: "May 10, 2024",
      total: 89.97,
      status: "Delivered",
      items: [
        { title: "Great Big Beautiful Life", quantity: 1, price: 34.99 },
        { title: "The Let Them Theory", quantity: 1, price: 28.98 },
        { title: "King of Envy", quantity: 1, price: 16.99 },
      ],
    },
    {
      id: "ORD-789012",
      date: "April 22, 2024",
      total: 44.98,
      status: "Delivered",
      items: [
        { title: "Atomic Habits", quantity: 1, price: 19.99 },
        { title: "The Midnight Library", quantity: 1, price: 24.99 },
      ],
    },
    {
      id: "ORD-345678",
      date: "March 15, 2024",
      total: 67.97,
      status: "Delivered",
      items: [
        { title: "The Silent Patient", quantity: 1, price: 24.99 },
        { title: "Great Big Beautiful Life", quantity: 1, price: 34.99 },
        { title: "King of Envy", quantity: 1, price: 16.99 },
      ],
    },
  ]

  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-8">Order History</h1>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
        {/* Account Sidebar */}
        <div className="space-y-4">
          <Card className="p-6">
            <div className="flex flex-col items-center text-center">
              <div className="w-20 h-20 bg-gray-200 rounded-full flex items-center justify-center mb-4">
                <User className="h-10 w-10 text-gray-500" />
              </div>
              <h2 className="font-bold text-xl">Lisa Kim</h2>
              <p className="text-gray-500 text-sm">Member since April 2024</p>
            </div>
          </Card>

          <div className="space-y-2">
            <Link href="/account" className="flex items-center gap-2 p-2 hover:bg-gray-100 rounded-md">
              <User className="h-5 w-5" />
              <span>Account Overview</span>
            </Link>
            <Link href="/account/orders" className="flex items-center gap-2 p-2 bg-gray-100 rounded-md">
              <Package className="h-5 w-5" />
              <span>Order History</span>
            </Link>
            <Link href="/account/settings" className="flex items-center gap-2 p-2 hover:bg-gray-100 rounded-md">
              <Settings className="h-5 w-5" />
              <span>Account Settings</span>
            </Link>
          </div>
        </div>

        {/* Main Content */}
        <div className="md:col-span-3">
          <div className="space-y-6">
            {orderHistory.map((order) => (
              <Card key={order.id} className="p-6">
                <div className="flex justify-between items-center mb-4">
                  <div>
                    <p className="font-bold">{order.id}</p>
                    <p className="text-sm text-gray-500">{order.date}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-bold">${order.total.toFixed(2)}</p>
                    <p className="text-sm text-green-600">{order.status}</p>
                  </div>
                </div>
                <ul className="space-y-2 mb-4">
                  {order.items.map((item, index) => (
                    <li key={index} className="flex justify-between text-sm border-b pb-2">
                      <div className="flex items-center">
                        <div className="w-10 h-12 bg-gray-100 flex items-center justify-center rounded mr-3">
                          <img
                            src={`/open-book-library.png?height=50&width=40&query=book%20${index}`}
                            alt={item.title}
                            className="max-h-full"
                          />
                        </div>
                        <div>
                          <p className="font-medium">{item.title}</p>
                          <p className="text-gray-500">Qty: {item.quantity}</p>
                        </div>
                      </div>
                      <p>${(item.price * item.quantity).toFixed(2)}</p>
                    </li>
                  ))}
                </ul>
                <div className="flex justify-between items-center">
                  <Button variant="outline" size="sm">
                    View Order Details
                  </Button>
                  <Button className="bg-gray-800 hover:bg-gray-700" size="sm">
                    Buy Again
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
