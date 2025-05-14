"use client"

import React, { useState, useEffect, useContext } from "react"
import { useParams, notFound } from "next/navigation"
import { Button } from "@/components/ui/button"
import { ArrowLeft, Minus, Plus, ShoppingCart } from "lucide-react"
import Link from "next/link"
import { Book } from "@/backend/models/Book" // Assuming Book model structure is available for typing
import { useCart } from "@/components/cart-provider"

export default function BookDetailPage() {
  const params = useParams()
  const id = params.id as string; // Ensure id is treated as a string
  const { addToCart } = useCart()
  const [quantity, setQuantity] = useState(1)
  const [book, setBook] = useState<Book | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchBook = async () => {
      try {
        const response = await fetch(`/api/books/${id}`);
        if (!response.ok) {
          if (response.status === 404) {
            notFound(); // Use Next.js notFound for 404
          }
          throw new Error(`Error fetching book: ${response.statusText}`);
        }
        const data = await response.json();
        setBook(data);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchBook();
    }
  }, [id]); // Re-fetch if the id changes

  const handleAddToCart = () => {
    if (!book) return; // Don't add if book data is not loaded    
    const bookItem: BookItem = {
      id: book._id, // Use book._id from fetched data
      title: book.title,
      author: book.author,
      price: book.price,
      quantity: quantity,
    }    addToCart(bookItem)
  }

  if (loading) {
    return <div className="container mx-auto px-4 py-8">Loading book details...</div>;
  }

  if (error) {
    return <div className="container mx-auto px-4 py-8 text-red-500">Error: {error}</div>;
  }

  if (!book) return null; // Handle case where book is null after loading/error
  return (
    <div className="container mx-auto px-4 py-8">
      <Link href="/books" className="flex items-center text-gray-600 hover:text-gray-900 mb-6">
        <ArrowLeft className="mr-2 h-4 w-4" />
        Back to Books
      </Link>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Book Image */}
        <div className="bg-gray-100 flex items-center justify-center p-4 rounded-lg">
          <img src={book.image || "/placeholder.svg"} alt={book.title} className="max-h-[400px] object-contain" />
        </div>
        {/* Book Details */}
        <div>
          <h1 className="text-3xl font-bold mb-2">{book.title}</h1>
          <p className="text-xl text-gray-600 mb-4">by {book.author}</p>
          {/* Ensure book.price exists before calling toFixed */}
          {book.price !== undefined && <p className="text-2xl font-bold mb-6">${book.price.toFixed(2)}</p>}
          <div className="mb-6">
            {/* Ensure book.description exists */}
            {book.description && <p className="text-gray-700">{book.description}</p>}
          </div>
          <div className="grid grid-cols-2 gap-4 mb-6">
            <div>
              <p className="text-sm text-gray-500">Category</p>
              <p>{book.category}</p>
            </div>
            {book.pages !== undefined && <div>
              <p className="text-sm text-gray-500">Pages</p>
              <p>{book.pages}</p>
            </div>}
            <div>
              <p className="text-sm text-gray-500">Publisher</p>
              {book.publisher && <p>{book.publisher}</p>}
            </div>
            {book.publicationDate && <div>
              <p className="text-sm text-gray-500">Publication Date</p>
              {book.publicationDate && <p>{book.publicationDate}</p>}
            </div>}
            <div className="col-span-2">
              <p className="text-sm text-gray-500">ISBN</p>
              {book.isbn && <p>{book.isbn}</p>}
            </div>
          </div>
          {/* Quantity Selector */}
          <div className="flex items-center mb-6">
            <span className="mr-4">Quantity:</span>
            <div className="flex items-center border rounded-md">
              <Button variant="ghost" size="icon" onClick={decrementQuantity} disabled={quantity <= 1}>
                <Minus className="h-4 w-4" />
              </Button>
              <span className="w-8 text-center">{quantity}</span>
              <Button variant="ghost" size="icon" onClick={incrementQuantity}>
                <Plus className="h-4 w-4" />
              </Button>
            </div>
          </div>
          {/* Add to Cart Button */}
          {/* Check if book is in stock or has quantity before showing Add to Cart button */}
          {book.quantity === undefined || book.quantity > 0 ? (
          <Button onClick={() => handleAddToCart(book)} className="w-full bg-gray-800 hover:bg-gray-700">
            <ShoppingCart className="mr-2 h-5 w-5" />
            Add to Cart
          </Button>
          ) : (
            <Button disabled className="w-full bg-gray-400">Out of Stock</Button>
          )}
        </div>
      </div>
    </div>
  )
}
