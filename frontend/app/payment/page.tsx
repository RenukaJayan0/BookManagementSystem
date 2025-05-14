"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { useCart } from "@/components/cart-provider"
import { Separator } from "@/components/ui/separator"
import { ArrowLeft, CreditCard, ShieldCheck } from "lucide-react"
import Link from "next/link"

export default function PaymentPage() {
  const router = useRouter()
  const { cartItems, clearCart, getCartTotal } = useCart()

  const [paymentDetails, setPaymentDetails] = useState({
    cardNumber: "",
    expirationDate: "",
    cvv: "",
    nameOnCard: "",
    saveCard: false,
    billingAddress: {
      address: "",
      city: "",
      state: "",
      zipCode: "",
      country: "United States",
    },
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target

    if (name.includes(".")) {
      const [parent, child] = name.split(".")
      setPaymentDetails((prev) => ({
        ...prev,
        [parent]: {
          ...(prev[parent as keyof typeof prev] as Record<string, string>),
          [child]: value,
        },
      }))
    } else {
      setPaymentDetails((prev) => ({
        ...prev,
        [name]: value,
      }))
    }
  }

  const handleCheckboxChange = (checked: boolean) => {
    setPaymentDetails((prev) => ({
      ...prev,
      saveCard: checked,
    }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Process payment logic would go here

    // Clear cart and redirect to confirmation
    clearCart()
    router.push("/payment/confirmation")
  }

  // Calculate order summary
  const subtotal = getCartTotal()
  const shipping = subtotal > 50 ? 0 : 4.99
  const tax = subtotal * 0.08 // 8% tax
  const total = subtotal + shipping + tax

  return (
    <div className="max-w-6xl mx-auto">
      <Link href="/cart" className="flex items-center text-gray-600 hover:text-gray-900 mb-6">
        <ArrowLeft className="mr-2 h-4 w-4" />
        Back to Cart
      </Link>

      <h1 className="text-3xl font-bold mb-8">Checkout</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Billing Address */}
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <h2 className="text-xl font-semibold mb-4">Billing Address</h2>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="address">Street Address</Label>
                  <Input
                    id="address"
                    name="billingAddress.address"
                    value={paymentDetails.billingAddress.address}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="city">City</Label>
                    <Input
                      id="city"
                      name="billingAddress.city"
                      value={paymentDetails.billingAddress.city}
                      onChange={handleChange}
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="state">State</Label>
                    <Input
                      id="state"
                      name="billingAddress.state"
                      value={paymentDetails.billingAddress.state}
                      onChange={handleChange}
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="zipCode">ZIP Code</Label>
                    <Input
                      id="zipCode"
                      name="billingAddress.zipCode"
                      value={paymentDetails.billingAddress.zipCode}
                      onChange={handleChange}
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="country">Country</Label>
                    <Input
                      id="country"
                      name="billingAddress.country"
                      value={paymentDetails.billingAddress.country}
                      onChange={handleChange}
                      required
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Payment Information */}
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <div className="flex items-center gap-2 mb-4">
                <CreditCard className="h-5 w-5" />
                <h2 className="text-xl font-semibold">Payment Information</h2>
              </div>

              <div className="space-y-4">
                <div>
                  <Label htmlFor="nameOnCard">Name on Card</Label>
                  <Input
                    id="nameOnCard"
                    name="nameOnCard"
                    placeholder="John Doe"
                    value={paymentDetails.nameOnCard}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="cardNumber">Card Number</Label>
                  <Input
                    id="cardNumber"
                    name="cardNumber"
                    placeholder="1234 5678 9012 3456"
                    value={paymentDetails.cardNumber}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="expirationDate">Expiration Date</Label>
                    <Input
                      id="expirationDate"
                      name="expirationDate"
                      placeholder="MM/YY"
                      value={paymentDetails.expirationDate}
                      onChange={handleChange}
                      required
                    />
                  </div>

                  <div>
                    <Label htmlFor="cvv">CVV</Label>
                    <Input
                      id="cvv"
                      name="cvv"
                      placeholder="123"
                      value={paymentDetails.cvv}
                      onChange={handleChange}
                      required
                    />
                  </div>
                </div>

                <div className="flex items-center space-x-2">
                  <Checkbox id="saveCard" checked={paymentDetails.saveCard} onCheckedChange={handleCheckboxChange} />
                  <Label htmlFor="saveCard" className="text-sm font-normal">
                    Save card for future purchases
                  </Label>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2 text-sm text-gray-600 mb-4">
              <ShieldCheck className="h-4 w-4 text-green-600" />
              <p>Your payment information is secure and encrypted</p>
            </div>

            <div className="lg:hidden">
              <OrderSummary subtotal={subtotal} shipping={shipping} tax={tax} total={total} items={cartItems} />
            </div>

            <Button type="submit" className="w-full bg-gray-800 hover:bg-gray-700">
              Complete Order
            </Button>
          </form>
        </div>

        <div className="hidden lg:block">
          <OrderSummary subtotal={subtotal} shipping={shipping} tax={tax} total={total} items={cartItems} />
        </div>
      </div>
    </div>
  )
}

function OrderSummary({
  subtotal,
  shipping,
  tax,
  total,
  items,
}: {
  subtotal: number
  shipping: number
  tax: number
  total: number
  items: any[]
}) {
  return (
    <div className="bg-gray-50 p-6 rounded-lg sticky top-4">
      <h2 className="text-xl font-bold mb-4">Order Summary</h2>

      <div className="space-y-4 mb-4">
        {items.map((item) => (
          <div key={item.id} className="flex justify-between text-sm">
            <span>
              {item.quantity} × {item.title}
            </span>
            <span>${(item.price * item.quantity).toFixed(2)}</span>
          </div>
        ))}
      </div>

      <Separator className="my-4" />

      <div className="space-y-3 text-sm">
        <div className="flex justify-between">
          <span>Subtotal</span>
          <span>${subtotal.toFixed(2)}</span>
        </div>

        <div className="flex justify-between">
          <span>Shipping</span>
          <span>{shipping === 0 ? "Free" : `$${shipping.toFixed(2)}`}</span>
        </div>

        <div className="flex justify-between">
          <span>Tax</span>
          <span>${tax.toFixed(2)}</span>
        </div>

        <Separator className="my-4" />

        <div className="flex justify-between font-bold text-base">
          <span>Total</span>
          <span>${total.toFixed(2)}</span>
        </div>
      </div>
    </div>
  )
}
