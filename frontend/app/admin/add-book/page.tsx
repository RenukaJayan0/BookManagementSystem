"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import { ArrowLeft } from "lucide-react"
import Link from "next/link"
import { useToast } from "@/hooks/use-toast"

export default function AddBookPage() {
  const { toast } = useToast()

  const [bookDetails, setBookDetails] = useState({
    title: "The Mademoiselle Alliance",
    author: "Natasha Lester",
    price: "34.99",
    description: "Inspired by a true story. A remarkable Australian talent and master storyteller.",
    category: "Fiction",
    isbn: "978-1234567890",
    pages: "384",
    publisher: "Hachette Australia",
    publicationDate: "2024-05-01",
    coverImage: "/mademoiselle-alliance.jpg",
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setBookDetails((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleSelectChange = (name: string, value: string) => {
    setBookDetails((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Save book logic would go here
    toast({
      title: "Book added successfully!",
      description: `"${bookDetails.title}" has been added to the catalog.`,
    })
  }

  return (
    <div className="max-w-4xl mx-auto">
      <Link href="/admin/dashboard" className="flex items-center text-gray-600 hover:text-gray-900 mb-6">
        <ArrowLeft className="mr-2 h-4 w-4" />
        Back to Dashboard
      </Link>

      <h1 className="text-3xl font-bold text-center mb-8">Add New Book</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="flex justify-center items-center">
          <div className="relative w-full max-w-[300px] aspect-[3/4]">
            <img
              src="/mademoiselle-alliance.jpg"
              alt="Book Cover"
              className="w-full h-auto object-contain border shadow-md"
            />
          </div>
        </div>

        <div>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="title">Title</Label>
              <Input id="title" name="title" value={bookDetails.title} onChange={handleChange} className="w-full" />
            </div>

            <div className="space-y-2">
              <Label htmlFor="author">Author</Label>
              <Input id="author" name="author" value={bookDetails.author} onChange={handleChange} className="w-full" />
            </div>

            <div className="space-y-2">
              <Label htmlFor="price">Price</Label>
              <Input
                id="price"
                name="price"
                value={bookDetails.price}
                onChange={handleChange}
                className="w-full"
                prefix="$"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="category">Category</Label>
              <Select value={bookDetails.category} onValueChange={(value) => handleSelectChange("category", value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select a category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Fiction">Fiction</SelectItem>
                  <SelectItem value="Non-Fiction">Non-Fiction</SelectItem>
                  <SelectItem value="Romance">Romance</SelectItem>
                  <SelectItem value="Thriller">Thriller</SelectItem>
                  <SelectItem value="Self-Help">Self-Help</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                name="description"
                value={bookDetails.description}
                onChange={handleChange}
                className="w-full min-h-[100px]"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="isbn">ISBN</Label>
                <Input id="isbn" name="isbn" value={bookDetails.isbn} onChange={handleChange} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="pages">Pages</Label>
                <Input id="pages" name="pages" value={bookDetails.pages} onChange={handleChange} />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="publisher">Publisher</Label>
                <Input id="publisher" name="publisher" value={bookDetails.publisher} onChange={handleChange} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="publicationDate">Publication Date</Label>
                <Input
                  id="publicationDate"
                  name="publicationDate"
                  type="date"
                  value={bookDetails.publicationDate}
                  onChange={handleChange}
                />
              </div>
            </div>

            <div className="flex justify-end space-x-4 pt-4">
              <Button variant="outline" type="button">
                Cancel
              </Button>
              <Button type="submit" className="bg-gray-800 hover:bg-gray-700">
                Save Book
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}
