"use client"

import { Button } from "@/components/ui/button"; // Assuming you use shadcn/ui buttons
import { ShoppingBag, Trash2, Plus, Minus } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react"
import { useRouter } from 'next/navigation'; // Import useRouter

interface CartItem {
  _id: string;
  book: {
    _id: string;
    title: string;
    author: string;
    price: number;
  };
  quantity: number;
}

export default function CartPage() {
  const router = useRouter(); // Initialize router

  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(true); // Add loading state
  const [submittingOrder, setSubmittingOrder] = useState(false); // Loading state for checkout
  const [checkoutError, setCheckoutError] = useState<string | null>(null); // Error for checkout
  const [fetchError, setFetchError] = useState<string | null>(null); // Error for initial fetch

  useEffect(() => {
    const fetchCart = async () => {
      const token = localStorage.getItem('jwtToken');
      if (!token) {
        setLoading(false); // Ensure loading is false if not authenticated
        router.push('/login'); // Redirect unauthenticated users
      }

      try {
        const response = await fetch('/api/cart', {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          const errorData = response.status === 401 || response.status === 403 ? { message: 'Authentication failed. Please log in again.' } : await response.json();
          throw new Error(errorData.message || 'Failed to fetch cart');
        }

        const data = await response.json();
        setCartItems(data); // Assuming the backend returns the cart array directly
      } catch (err: any) {
        console.error('Error fetching cart:', err);
        setFetchError(err.message || 'Error fetching cart.');
      } finally {
        setLoading(false);
      }
    };

    fetchCart();
  }, []); // Empty dependency array means this effect runs once on mount

  // Function to handle changes in the input field (manual typing)
  const handleInputChange = (bookId: string, value: string) => {
      const newQuantity = parseInt(value, 10);
      // Optimistically update UI immediately as user types
      setCartItems(prevItems =>
        prevItems.map(item =>
          item.book._id === bookId && !isNaN(newQuantity) ? { ...item, quantity: newQuantity } : item
        )
      );
      // The actual API call is triggered on blur or button click
  };

  const handleUpdateQuantity = async (bookId: string, newQuantity: number) => {
     // Optimistically update UI
    setCartItems(prevItems =>
      prevItems.map(item =>
        item.book._id === bookId ? { ...item, quantity: newQuantity } : item
      )
    );

    const token = localStorage.getItem('jwtToken');
    if (!token) return; // Or handle login redirection

    try {
        // Basic validation before sending
        if (newQuantity < 0 || isNaN(newQuantity)) {
            console.error("Invalid quantity:", newQuantity);
             // Revert UI update if validation fails (optional)
             setCartItems(prevItems =>
                prevItems.map(item =>
                  item.book._id === bookId ? { ...item, quantity: item.quantity } : item // Revert to previous quantity
                )
            );
            alert('Invalid quantity entered.');
            return;
        }

      const response = await fetch('/api/cart/update-quantity', { // Ensure this matches your backend route
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json', // Important for PUT/POST with body
        },
        body: JSON.stringify({ bookId, newQuantity }),
      });

      if (!response.ok) {
         const errorData = await response.json();
         console.error('Failed to update quantity:', errorData);
         alert('Failed to update quantity: ' + (errorData.message || 'Unknown error'));

         // Revert UI update if backend call fails
         // Find the item with the potentially incorrect quantity from the current state
        setCartItems(prevItems =>
          prevItems.map(item =>
            item.book._id === bookId ? { ...item, quantity: prevItems.find(p => p.book._id === bookId)?.quantity || item.quantity } : item // Revert to the quantity before the failed update
          )
         );
      }
       // If response.ok, optimistic update is already done.
    } catch (err: any) {
      console.error('Error updating quantity:', err);
      alert('Failed to update quantity: ' + (err.message || 'Unknown error'));
        // Revert UI update if fetch fails
        setCartItems(prevItems =>
            prevItems.map(item =>
              item.book._id === bookId ? { ...item, quantity: prevItems.find(p => p.book._id === bookId)?.quantity || item.quantity } : item // Revert to the quantity before the failed update
            )
           );
    }
  };

  const handleRemoveItem = async (bookId: string) => {
    const token = localStorage.getItem('jwtToken');
    if (!token) return; // Or handle login redirection
    
    try {
      const response = await fetch(`/api/cart/remove/${bookId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
           'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        // Update the frontend cart state after successful removal
        setCartItems(prevItems => prevItems.filter(item => item.book._id !== bookId));
      } else {
         const errorData = await response.json();
         alert('Failed to remove item: ' + (errorData.message || 'Unknown error'));
      }

    } catch (err: any) {
      console.error('Error removing item from cart:', err);
      alert('Failed to remove item: ' + (err.message || 'Unknown error'));
    }
  };

  const handleCheckout = async () => {
     // Clear any previous checkout errors
     setCheckoutError(null);

    const token = localStorage.getItem('jwtToken');
    if (!token) {
      setCheckoutError('Please log in to place an order.');
      return;
    }

    if (cartItems.length === 0) {
        setCheckoutError('Your cart is empty.');
        return;
    }

    setSubmittingOrder(true);
    setCheckoutError(null);

    try {
      const response = await fetch('/api/orders/checkout', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
         // No body needed for this checkout endpoint as it uses the user's stored cart
      });

      if (response.ok) { // Assuming 201 Created or 200 OK on success
         // const orderData = await response.json(); // Get response data if needed (e.g., order ID)
        setCartItems([]); // Clear local cart state
        // TODO: Optionally redirect to an order confirmation page
      } else {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to place order');
      }
    } catch (err: any) {
      console.error('Error during checkout:', err);
      setCheckoutError(err.message || 'Error placing order.');
    } finally {
      setSubmittingOrder(false);
    }
  };

  const calculateTotal = () => {
    return cartItems.reduce((total, item) => {
     // Ensure item.book and item.book.price exist before multiplying
      const itemPrice = item.book?.price || 0;
      return total + itemPrice * item.quantity;
    }, 0);
  };

   // Combine potential errors for display
   const displayError = loading ? null : fetchError || checkoutError;

  if (loading) return <div className="p-4 max-w-4xl mx-auto text-center">Loading cart...</div>;
 
  if (displayError) return <div className="p-4 max-w-4xl mx-auto text-red-500 text-center">Error: {displayError}</div>;

  return (
    <div className="p-4 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold text-center mb-8">Shopping Cart</h1>

      {cartItems.length === 0 ? (
        <div className="text-center py-12 bg-gray-50 rounded-lg">
          <ShoppingBag className="h-12 w-12 mx-auto text-gray-400 mb-4" />
          <p className="text-lg mb-4">Your cart is empty</p>
          <Link href="/books">
            <Button className="bg-gray-800 hover:bg-gray-700">Browse Books</Button>
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="col-span-2 space-y-6"> {/* Corrected col-span */}
            {cartItems.map((item) => ( // Added key prop here
              <div key={item._id} className="bg-white p-4 rounded-lg shadow-sm flex gap-4">
                <div className="w-20 h-24 bg-gray-100 flex items-center justify-center rounded overflow-hidden">
                  <img
                    src={`/open-book-library.png?height=100&width=80&query=book%20${item.book._id}`} // Placeholder image
                    alt={item.book.title}
                    className="max-h-full max-w-full object-contain"
                  />
                </div>
                <div className="flex-1 flex flex-col justify-between">
                  <div>
                    <Link href={`/books/${item.book._id}`} className="font-medium hover:underline text-lg">
                      {item.book?.title || 'Unknown Title'}
                    </Link>
                    <p className="text-gray-600 text-sm">{item.book?.author || 'Unknown Author'}</p>
                  </div>
                  <div className="flex justify-between items-center mt-2">
                    <div className="flex items-center gap-2">
                      {/* Quantity Decrement Button */}
                      <Button
                        variant="outline"
                        size="icon"
                        disabled={item.quantity <= 1 || submittingOrder} // Disable during checkout
                        className="h-8 w-8 rounded-full"
                        onClick={() => handleUpdateQuantity(item.book._id, item.quantity - 1)}
                      >
                        <Minus className="h-3 w-3" />
                      </Button>
                      <input
                        type="number"
                        min="1"
                        value={item.quantity} // Bind value to state
                        disabled={submittingOrder} // Disable during checkout
                        onChange={(e) => {
                            const value = parseInt(e.target.value, 10);
                            // Handle input changes directly for immediate UI feedback
                            if (!isNaN(value) && value >= 0) {
                                handleInputChange(item.book._id, e.target.value); // Use the raw string for the input value state
                            }
                        }}
                        onBlur={(e) => { // Trigger API call on blur
                             handleUpdateQuantity(item.book._id, parseInt(e.target.value, 10));
                        }}
                        className="w-14 text-center border rounded-md px-1 py-0.5 text-sm" // Adjusted width slightly
                      />
                      <Button
                        variant="outline"
                        size="icon"
                        className="h-8 w-8 rounded-full"
                        onClick={() => handleUpdateQuantity(item.book._id, item.quantity + 1)}
                        disabled={submittingOrder} // Disable during checkout
                      >
                        <Plus className="h-3 w-3" />
                      </Button>
                      <p className="font-medium text-lg">${(item.book.price * item.quantity).toFixed(2)}</p>
                    </div> {/* Close the quantity and price flex div */}
                    {/* Remove Button */}
                    <Button
                      variant="ghost"
                      size="icon" // Add size="icon" if it's a small button
                      className="text-gray-500 hover:text-red-600"
                      onClick={() => handleRemoveItem(item.book._id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
            </div>
          </div> {/* Close the flex container */}
            ))}
          </div> {/* Close col-span-2 */}

          <div className="col-span-1 bg-gray-50 p-6 rounded-lg h-fit">
            <h2 className="text-2xl font-bold mb-4">Order Summary</h2> {/* Adjusted size */}
            <div className="space-y-3 text-sm">
              <div className="flex justify-between font-bold text-base">
                <span>Subtotal ({cartItems.reduce((sum, item) => sum + item.quantity, 0)} items)</span>
                <span>${calculateTotal().toFixed(2)}</span>
              </div>
            </div>

             {/* Display checkout error here */}
             {checkoutError && <p className="text-red-500 text-sm mt-4 text-center">{checkoutError}</p>}

             {/* Checkout button */}
            <Button
              className="w-full bg-gray-800 hover:bg-gray-700 mt-6"
              onClick={handleCheckout}
              disabled={cartItems.length === 0 || submittingOrder}
            >
              {submittingOrder ? 'Processing...' : 'Place Order'}
            </Button>

          <div className="mt-8 text-center">
            <Link href="/books">
              <Button variant="outline" className="w-full md:w-auto">
                Continue Shopping
              </Button>
            </Link>
          </div> {/* Corrected div closing */}

            <p className="text-xs text-gray-500 mt-4 text-center">Free shipping on orders over $50</p>
          </div>
        </div>
      )}
    </div>
  )
}
