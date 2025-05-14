import Link from "next/link"
import { CheckCircle, Package, ShoppingBag } from "lucide-react"
import { Button } from "@/components/ui/button"

export default function ConfirmationPage() {
  // Generate a random order number
  const orderNumber = `ORD-${Math.floor(Math.random() * 1000000)
    .toString()
    .padStart(6, "0")}`

  return (
    <div className="max-w-md mx-auto text-center py-12">
      <div className="flex justify-center mb-6">
        <div className="bg-green-100 p-4 rounded-full">
          <CheckCircle className="h-16 w-16 text-green-600" />
        </div>
      </div>

      <h1 className="text-3xl font-bold mb-4">Order Confirmed!</h1>
      <p className="text-gray-600 mb-2">Thank you for your purchase.</p>
      <p className="text-gray-600 mb-8">
        Your order number is <span className="font-medium">{orderNumber}</span>
      </p>

      <div className="bg-gray-50 p-6 rounded-lg mb-8">
        <div className="flex items-center gap-3 mb-4">
          <Package className="h-5 w-5 text-gray-600" />
          <h2 className="text-lg font-medium">What's Next?</h2>
        </div>
        <p className="text-sm text-gray-600 mb-4">
          You will receive an email confirmation shortly. We'll notify you when your order ships.
        </p>
        <div className="flex justify-between text-sm">
          <span className="text-gray-600">Estimated delivery:</span>
          <span className="font-medium">
            {new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toLocaleDateString("en-US", {
              month: "short",
              day: "numeric",
              year: "numeric",
            })}
          </span>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row gap-4 justify-center">
        <Link href="/">
          <Button className="bg-gray-800 hover:bg-gray-700 w-full">
            <ShoppingBag className="mr-2 h-4 w-4" />
            Continue Shopping
          </Button>
        </Link>
        <Link href="/account/orders">
          <Button variant="outline" className="w-full">
            View Order History
          </Button>
        </Link>
      </div>
    </div>
  )
}
