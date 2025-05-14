"use client"

import { useState } from "react"
import Link from "next/link"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { useCart, type BookItem } from "@/components/cart-provider"

// Sample book data
const booksData = [
  {
    id: "1",
    title: "Great Big Beautiful Life",
    author: "Emily Henry",
    price: 34.99,
    image: "/abstract-book-cover.png",
    description: "A heartwarming novel about finding joy in unexpected places.",
    category: "Fiction",
  },
  {
    id: "2",
    title: "The Let Them Theory",
    author: "Mel Robbins",
    price: 28.98,
    image: "/self-help-book.png",
    description: "A groundbreaking approach to personal development and growth.",
    category: "Self-Help",
  },
  {
    id: "3",
    title: "King of Envy",
    author: "Ana Huang",
    price: 16.99,
    image: "/placeholder.svg?key=ap1f3",
    description: "A passionate romance that will keep you turning pages.",
    category: "Romance",
  },
  {
    id: "4",
    title: "The Silent Patient",
    author: "Alex Michaelides",
    price: 24.99,
    image: "/placeholder.svg?key=8mf3i",
    description: "A psychological thriller that will keep you guessing until the end.",
    category: "Thriller",
  },
  {
    id: "5",
    title: "Atomic Habits",
    author: "James Clear",
    price: 19.99,
    image: "/placeholder.svg?key=ggpqe",
    description: "Tiny changes, remarkable results. A proven framework for improving every day.",
    category: "Self-Help",
  },
  {
    id: "6",
    title: "The Midnight Library",
    author: "Matt Haig",
    price: 22.99,
    image: "/fantasy-book.png",
    description: "Between life and death there is a library. Would you choose a different life?",
    category: "Fiction",
  },
]

// Categories for filtering
const categories = ["All", "Fiction", "Self-Help", "Romance", "Thriller"]

export default function BooksPage() {
  const { addToCart } = useCart()
  const [selectedCategory, setSelectedCategory] = useState("All")

  // Filter books by category
  const filteredBooks =
    selectedCategory === "All" ? booksData : booksData.filter((book) => book.category === selectedCategory)

  const handleAddToCart = (book: any) => {
    const bookItem: BookItem = {
      id: book.id,
      title: book.title,
      author: book.author,
      price: book.price,
      quantity: 1,
    }
    addToCart(bookItem)
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Browse Books</h1>

      {/* Category filters */}
      <div className="flex flex-wrap gap-2 mb-8">
        {categories.map((category) => (
          <Button
            key={category}
            variant={selectedCategory === category ? "default" : "outline"}
            onClick={() => setSelectedCategory(category)}
            className={selectedCategory === category ? "bg-gray-800" : ""}
          >
            {category}
          </Button>
        ))}
      </div>

      {/* Books grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredBooks.map((book) => (
          <Card key={book.id} className="overflow-hidden">
            <div className="aspect-[3/4] relative bg-gray-100 flex items-center justify-center">
              <img src={book.image || "/placeholder.svg"} alt={book.title} className="object-cover" />
            </div>
            <CardContent className="p-4">
              <Link href={`/books/${book.id}`} className="hover:underline">
                <h3 className="font-bold text-lg mb-1">{book.title}</h3>
              </Link>
              <p className="text-gray-600 mb-2">{book.author}</p>
              <p className="font-medium mb-4">${book.price.toFixed(2)}</p>
              <Button onClick={() => handleAddToCart(book)} className="w-full bg-gray-800 hover:bg-gray-700">
                Add to Cart
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
