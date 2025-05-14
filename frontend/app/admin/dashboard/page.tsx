"use client"

import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import Link from "next/link"
import { BookPlus, ChevronRight } from "lucide-react"

// Sample data for the dashboard
const booksData = [
  {
    id: "1",
    title: "The Mademoiselle Alliance",
    author: "Natasha Lester",
    price: 34.99,
  },
  {
    id: "2",
    title: "Great Big Beautiful Life",
    author: "Emily Henry",
    price: 34.99,
  },
  {
    id: "3",
    title: "Silverthorn: The Mystery of Margan Crow",
    author: "Suzanne Collins",
    price: 34.99,
  },
]

const usersData = [
  {
    id: "1",
    name: "Alice Johnson",
    email: "alice@gmail.com",
    role: "Admin",
  },
  {
    id: "2",
    name: "JR Smith",
    email: "jr@gmail.com",
    role: "Staff",
  },
  {
    id: "3",
    name: "Charlie Brown",
    email: "charlie@gmail.com",
    role: "Staff",
  },
]

export default function AdminDashboardPage() {
  return (
    <div className="max-w-6xl mx-auto">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Admin Dashboard</h1>
        <Link href="/admin/add-book">
          <Button className="bg-gray-800 hover:bg-gray-700 flex items-center gap-2">
            <BookPlus className="h-4 w-4" />
            Add New Book
          </Button>
        </Link>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
        <Card className="p-6 border rounded-md overflow-hidden relative group hover:shadow-md transition-all">
          <div className="absolute inset-0 bg-gradient-to-r from-gray-100 to-transparent opacity-50"></div>
          <div className="relative">
            <h2 className="text-lg font-medium text-gray-600">Total Books</h2>
            <p className="text-3xl font-bold mt-2">1,234</p>
            <div className="mt-4 text-sm text-gray-500 flex items-center">
              <span className="text-green-500 font-medium">+12</span>
              <span className="ml-1">this week</span>
            </div>
          </div>
        </Card>

        <Card className="p-6 border rounded-md overflow-hidden relative group hover:shadow-md transition-all">
          <div className="absolute inset-0 bg-gradient-to-r from-gray-100 to-transparent opacity-50"></div>
          <div className="relative">
            <h2 className="text-lg font-medium text-gray-600">Active Users</h2>
            <p className="text-3xl font-bold mt-2">4</p>
            <div className="mt-4 text-sm text-gray-500 flex items-center">
              <span className="text-green-500 font-medium">+1</span>
              <span className="ml-1">this week</span>
            </div>
          </div>
        </Card>

        <Card className="p-6 border rounded-md overflow-hidden relative group hover:shadow-md transition-all">
          <div className="absolute inset-0 bg-gradient-to-r from-gray-100 to-transparent opacity-50"></div>
          <div className="relative">
            <h2 className="text-lg font-medium text-gray-600">Notifications</h2>
            <p className="text-3xl font-bold mt-2">8</p>
            <div className="mt-4 text-sm text-gray-500 flex items-center">
              <span className="text-red-500 font-medium">+3</span>
              <span className="ml-1">new</span>
            </div>
          </div>
        </Card>
      </div>

      {/* Manage Books Section */}
      <div className="mb-12">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold">Manage Books</h2>
          <Link href="/admin/books" className="text-gray-600 hover:text-gray-900 flex items-center text-sm">
            View All <ChevronRight className="h-4 w-4 ml-1" />
          </Link>
        </div>
        <div className="bg-white rounded-lg border shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-gray-50">
                  <th className="text-left py-3 px-4 font-medium text-gray-600">Title</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-600">Author</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-600">Price</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-600">Actions</th>
                </tr>
              </thead>
              <tbody>
                {booksData.map((book, index) => (
                  <tr key={book.id} className={index !== booksData.length - 1 ? "border-b" : ""}>
                    <td className="py-3 px-4">{book.title}</td>
                    <td className="py-3 px-4">{book.author}</td>
                    <td className="py-3 px-4">${book.price.toFixed(2)}</td>
                    <td className="py-3 px-4">
                      <Button variant="secondary" className="bg-gray-800 text-white hover:bg-gray-700 text-xs py-1 h-8">
                        Edit
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Manage Users Section */}
      <div>
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold">Manage Users</h2>
          <Link href="/admin/users" className="text-gray-600 hover:text-gray-900 flex items-center text-sm">
            View All <ChevronRight className="h-4 w-4 ml-1" />
          </Link>
        </div>
        <div className="bg-white rounded-lg border shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-gray-50">
                  <th className="text-left py-3 px-4 font-medium text-gray-600">Name</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-600">Email</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-600">Role</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-600">Actions</th>
                </tr>
              </thead>
              <tbody>
                {usersData.map((user, index) => (
                  <tr key={user.id} className={index !== usersData.length - 1 ? "border-b" : ""}>
                    <td className="py-3 px-4">{user.name}</td>
                    <td className="py-3 px-4">{user.email}</td>
                    <td className="py-3 px-4">
                      <span
                        className={`px-2 py-1 rounded-full text-xs ${user.role === "Admin" ? "bg-blue-100 text-blue-800" : "bg-gray-100 text-gray-800"}`}
                      >
                        {user.role}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <Button variant="destructive" size="sm" className="text-xs py-1 h-8">
                        Delete
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  )
}
