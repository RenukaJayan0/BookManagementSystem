"use client"; // Ensure this is at the top for Next.js

import React, { createContext, useContext, useState, ReactNode } from "react";

// Define the structure of a book for the cart item
interface Book {
  _id: string;
  title: string;
  author: string;
  price: number;
}

// Define the structure of an item in the cart
interface CartItem {
  book: Book;
  quantity: number;
}

// Define the structure of the Cart Context value
interface CartContextType {
  cart: CartItem[];
  addToCart: (book: Book) => void;
  clearCart: () => void;
}

// Create the Cart Context with a default value
const CartContext = createContext<CartContextType | undefined>(undefined);

// Create the Cart Provider component
export const CartProvider = ({ children }: { children: ReactNode }) => {
  const [cart, setCart] = useState<CartItem[]>([]);

  const addToCart = async (book: Book) => {
    try {
      const response = await fetch("/api/cart/add", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ bookId: book._id, quantity: 1 }),
      });

      if (response.ok) {
        console.log("Item added to backend cart successfully");
      } else {
        console.error("Failed to add item to backend cart:", response.statusText);
      }
    } catch (error) {
      console.error("Error adding item to cart:", error);
    } // ❌ Removed the incorrect extra bracket here
  };

  const clearCart = () => {
    setCart([]);
  };

  return (
    <CartContext.Provider value={{ cart, addToCart, clearCart }}>
      {children}
    </CartContext.Provider>
  );
};

// Custom hook to consume the Cart Context
export const useCart = () => {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
};