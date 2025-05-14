"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card } from "@/components/ui/card"

export default function UserSettingsPage() {
  const [userDetails, setUserDetails] = useState({
    name: "Lisa",
    surname: "Kim",
    email: "Lisa1234@gmail.com",
    password: "************",
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setUserDetails((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Save user details logic would go here
    alert("User details updated successfully!")
  }

  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold text-center mb-8">User settings</h1>

      <Card className="max-w-md mx-auto p-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <label htmlFor="name" className="block text-sm font-medium">
              Name
            </label>
            <Input id="name" name="name" value={userDetails.name} onChange={handleChange} className="w-full" />
          </div>

          <div className="space-y-2">
            <label htmlFor="surname" className="block text-sm font-medium">
              Surname
            </label>
            <Input id="surname" name="surname" value={userDetails.surname} onChange={handleChange} className="w-full" />
          </div>

          <div className="space-y-2">
            <label htmlFor="email" className="block text-sm font-medium">
              Email
            </label>
            <Input
              id="email"
              name="email"
              type="email"
              value={userDetails.email}
              onChange={handleChange}
              className="w-full"
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="password" className="block text-sm font-medium">
              Change password
            </label>
            <Input
              id="password"
              name="password"
              type="password"
              value={userDetails.password}
              onChange={handleChange}
              className="w-full"
            />
          </div>

          <div className="flex justify-end">
            <Button type="submit" className="bg-gray-800 hover:bg-gray-700">
              Save Changes
            </Button>
          </div>
        </form>
      </Card>
    </div>
  )
}
