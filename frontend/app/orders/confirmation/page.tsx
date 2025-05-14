'use client';

import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';

export default function OrderConfirmationPage() {
  const searchParams = useSearchParams();
  const orderId = searchParams.get('orderId'); // Example: access an orderId query parameter

  return (
    <div className="container mx-auto p-4 text-center">
      <h1 className="text-3xl font-bold mb-4">Order Confirmed!</h1>
      <p className="text-lg">Thank you for your order!</p>
      {orderId && (
        <p className="text-md mt-2">Your Order ID is: <span className="font-semibold">{orderId}</span></p>
      )}
      <p className="text-md mt-4">We are processing your order and will notify you when it ships.</p>
      {/* Add a link back to the home page or order history */}
      <a href="/" className="mt-6 inline-block text-blue-600 hover:underline">
        Continue Shopping
      </a>
    </div>
  );
}