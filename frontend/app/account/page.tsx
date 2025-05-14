"use client"

import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useCart } from "@/components/cart-provider"
import Link from "next/link"
import { Package, Settings, ShoppingBag, User } from "lucide-react"

export default function AccountPage() {
  const { cartItems } = useCart()

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
  ]

  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-8">My Account</h1>

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
            <Link href="/account" className="flex items-center gap-2 p-2 bg-gray-100 rounded-md">
              <User className="h-5 w-5" />
              <span>Account Overview</span>
            </Link>
            <Link href="/account/orders" className="flex items-center gap-2 p-2 hover:bg-gray-100 rounded-md">
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
          <Tabs defaultValue="overview">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="overview">Account Overview</TabsTrigger>
              <TabsTrigger value="orders">Recent Orders</TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="mt-6">
              <Card className="p-6">
                <h2 className="text-xl font-bold mb-4">Account Information</h2>
                <div className="space-y-4">
                  <div>
                    <p className="text-sm text-gray-500">Name</p>
                    <p>Lisa Kim</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Email</p>
                    <p>Lisa1234@gmail.com</p>
                  </div>
                </div>

                <div className="mt-6">
                  <Link href="/account/settings">
                    <Button variant="outline">Edit Account Information</Button>
                  </Link>
                </div>
              </Card>

              <div className="mt-6">
                <h2 className="text-xl font-bold mb-4">Current Cart</h2>
                {cartItems.length === 0 ? (
                  <Card className="p-6 text-center">
                    <ShoppingBag className="h-12 w-12 mx-auto text-gray-400 mb-4" />
                    <p className="mb-4">Your cart is empty</p>
                    <Link href="/books">
                      <Button className="bg-gray-800 hover:bg-gray-700">Browse Books</Button>
                    </Link>
                  </Card>
                ) : (
                  <Card className="p-6">
                    <ul className="space-y-4">
                      {cartItems.map((item) => (
                        <li key={item.id} className="flex justify-between">
                          <div>
                            <p className="font-medium">{item.title}</p>
                            <p className="text-sm text-gray-500">Qty: {item.quantity}</p>
                          </div>
                          <p>${(item.price * item.quantity).toFixed(2)}</p>
                        </li>
                      ))}
                    </ul>
                    <div className="mt-4 flex justify-end">
                      <Link href="/cart">
                        <Button className="bg-gray-800 hover:bg-gray-700">View Cart</Button>
                      </Link>
                    </div>
                  </Card>
                )}
              </div>
            </TabsContent>

            <TabsContent value="orders" className="mt-6">
              <h2 className="text-xl font-bold mb-4">Order History</h2>
              {orderHistory.map((order) => (
                <Card key={order.id} className="p-6 mb-4">
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
                  <ul className="space-y-2">
                    {order.items.map((item, index) => (
                      <li key={index} className="flex justify-between text-sm">
                        <p>
                          {item.quantity} x {item.title}
                        </p>
                        <p>${(item.price * item.quantity).toFixed(2)}</p>
                      </li>
                    ))}
                  </ul>
                  <div className="mt-4">
                    <Button variant="outline" size="sm">
                      View Order Details
                    </Button>
                  </div>
                </Card>
              ))}
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  )
}
