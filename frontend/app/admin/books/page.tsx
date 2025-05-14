"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import jwtDecode from 'jwt-decode';

interface Book {
  _id: string;
  title: string;
  author: string;
  price: number;
}

export default function AdminBooksPage() {
  const [formData, setFormData] = useState({
    title: '',
    author: '',
    price: '',
    image: '',
    description: '',
    category: ''
  });
  const [message, setMessage] = useState('');
  const [existingBooks, setExistingBooks] = useState<Book[]>([]);
  const [editingBookId, setEditingBookId] = useState<string | null>(null); // State to track which book is being edited
  const router = useRouter();

  useEffect(() => {
    // JWT and Role Protection
    const token = localStorage.getItem('jwtToken');
    if (!token) {
      router.push('/admin/login');
      return;
    }

    try {
      const decoded: any = jwtDecode(token); // Use 'any' or define a proper interface for decoded token

      // Optional: check token expiration
      const now = Date.now() / 1000;
      if (decoded.exp < now) {
        console.warn('Token expired');
        localStorage.removeItem('jwtToken');
        router.push('/admin/login');
        return;
      }

      // Check for admin role
      if (decoded.role !== 'admin') {
        alert('Access denied: Admins only');
        router.push('/');
        return;
      }
    } catch (err) {
      console.error('Invalid token:', err);
      localStorage.removeItem('jwtToken');
      router.push('/admin/login');
      return; // Stop further execution if token is invalid
    }

    // Fetch Books (moved inside the protected area)
    const fetchBooks = async () => {
      try {
        const response = await fetch('/api/books'); // Or your specific admin endpoint
        if (!response.ok) {
          throw new Error('Failed to fetch books');
        }
        const data = await response.json();
        setExistingBooks(data);
      } catch (error: any) {
        console.error('Error fetching books:', error.message);
        // Display an error message to the user
        setMessage(`Error fetching books: ${error.message}`);
      }
    };
    fetchBooks();
  }, [router]); // Add router to dependency array

  const handleDelete = async (id: string) => {
    setMessage(''); // Clear previous messages
    if (window.confirm('Are you sure you want to delete this book?')) {
        const token = localStorage.getItem('jwtToken'); // Get token from local storage
        const response = await fetch(`/api/admin/books/${id}`, {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${token}`, // Include the token in the header
          },
        });

        if (response.ok) {
          setMessage('Book deleted successfully!');
          setExistingBooks(existingBooks.filter((book: any) => book._id !== id)); // Update state
        } else if (response.status === 401 || response.status === 403) {
           setMessage('Error: Unauthorized to delete book. Please log in again.');
           router.push('/admin/login'); // Redirect if unauthorized
        } else {
          const error = await response.json();
          throw new Error('Failed to delete book');
        }
    } catch (error: any) {
        setMessage(`Error deleting book: ${error.message}`);
        console.error('Error deleting book:', error);
    }
  };

  const handleEditClick = (book: Book) => {
    setEditingBookId(book._id);
    // Populate the form with the book details
    setFormData({
      title: book.title,
      author: book.author,
      price: book.price.toString(), // Convert number to string for input
      image: '', // Assuming image is not always needed for edit
      description: '', // Assuming description is not always needed for edit
      category: '' // Assuming category is not always needed for edit
    });
  };

  const handleCancelEdit = () => {
    setEditingBookId(null);
    // Clear or reset the form data as needed
    setFormData({
      title: '',
      author: '',
      price: '',
      image: '',
      description: '',
      category: ''
    });
  };

  const handleEditSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setMessage('');

    if (!editingBookId) return; // Should not happen if form is visible

    try {
        const token = localStorage.getItem('jwtToken');
        const response = await fetch(`/api/admin/books/${editingBookId}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`, // Include JWT
            },
            body: JSON.stringify({
                ...formData,
                price: parseFloat(formData.price) // Ensure price is a number
            })
        });

        if (response.ok) {
            const updatedBook = await response.json();
            setMessage('Book updated successfully!');
            // Update the existingBooks state with the updated book
            setExistingBooks(existingBooks.map(book =>
                book._id === updatedBook._id ? updatedBook : book
            ));
            setEditingBookId(null); // Exit edit mode
            setFormData({ // Clear form
                title: '', author: '', price: '', image: '', description: '', category: ''
            });
        } else if (response.status === 401 || response.status === 403) {
           setMessage('Error: Unauthorized to update book. Please log in again.');
           router.push('/admin/login'); // Redirect if unauthorized
        } else {
            const error = await response.json();
            throw new Error(error.message || 'Failed to update book');
        }
    } catch (error: any) {
        setMessage(`Error updating book: ${error.message}`);
        console.error('Error updating book:', error);
    }
  }, []); // Empty dependency array to run only once on mount

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setMessage('');
    setEditingBookId(null); // Ensure we're not in edit mode when adding

    try {
      const token = localStorage.getItem('jwtToken'); // Get JWT from local storage
      const response = await fetch('/api/admin/books', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`, // Include JWT in the header
        },
        body: JSON.stringify({
          ...formData,
          price: parseFloat(formData.price) // Convert price to number
        }),
      });

      if (response.ok) {
        const result = await response.json();
        setMessage('Book added successfully!');
        setFormData({ // Clear form
          title: '',
          author: '',
          price: '',
          image: '',
          description: '',
          category: ''
        });
        console.log('Book added:', result);
      } else {
        // Assuming backend sends error as JSON { message: "..." }
        const error = await response.json();
        setMessage(`Error adding book: ${error.message || response.statusText}`);
        console.error('Error adding book:', error);
      }
    } catch (error: any) {
      setMessage(`An error occurred: ${error.message}`);
      console.error('Fetch error:', error);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Admin - Manage Books</h1>
       {message && <div className={`p-3 mb-4 rounded ${message.startsWith('Error') || message.startsWith('An error') ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'}`}>{message}</div>}

      {editingBookId ? (
        // Edit Form
        <div className="mb-8">
          <h2 className="text-xl font-semibold mb-4">Edit Book</h2>
           <form onSubmit={handleEditSubmit} className="space-y-4">
            <div>
              <label htmlFor="edit-title" className="block text-sm font-medium text-gray-700">Title</label>
              <input
                type="text"
                id="edit-title"
                name="title"
                value={formData.title}
                onChange={handleInputChange}
                required
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2 border"
              />
            </div>
            <div>
              <label htmlFor="edit-author" className="block text-sm font-medium text-gray-700">Author</label>
              <input
                type="text"
                id="edit-author"
                name="author"
                value={formData.author}
                onChange={handleInputChange}
                required
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2 border"
              />
            </div>
            <div>
              <label htmlFor="edit-price" className="block text-sm font-medium text-gray-700">Price</label>
              <input
                type="number"
                id="edit-price"
                name="price"
                value={formData.price}
                onChange={handleInputChange}
                required
                min="0"
                step="0.01"
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2 border"
              />
            </div>
             {/* Add other fields for edit as needed */}
            <div className="flex space-x-4">
                 <button
                  type="submit"
                  className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                >
                  Save Changes
                </button>
                 <button
                  type="button" // Use type="button" to prevent form submission
                  onClick={handleCancelEdit}
                  className="inline-flex justify-center py-2 px-4 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                  Cancel
                </button>
            </div>
          </form>
        </div>
      ) : (
        // Add New Book Form
        <div className="mb-8">
          <h2 className="text-xl font-semibold mb-4">Add New Book</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Form fields for adding a new book - same as before */}
             <div>
              <label htmlFor="title" className="block text-sm font-medium text-gray-700">Title</label>
              <input type="text" id="title" name="title" value={formData.title} onChange={handleInputChange} required className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2 border"/>
            </div>
            <div>
              <label htmlFor="author" className="block text-sm font-medium text-gray-700">Author</label>
              <input type="text" id="author" name="author" value={formData.author} onChange={handleInputChange} required className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2 border"/>
            </div>
            <div>
              <label htmlFor="price" className="block text-sm font-medium text-gray-700">Price</label>
              <input type="number" id="price" name="price" value={formData.price} onChange={handleInputChange} required min="0" step="0.01" className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2 border"/>
            </div>
            <div>
              <label htmlFor="image" className="block text-sm font-medium text-gray-700">Image URL</label>
              <input type="text" id="image" name="image" value={formData.image} onChange={handleInputChange} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2 border"/>
            </div>
            <div>
              <label htmlFor="description" className="block text-sm font-medium text-gray-700">Description</label>
              <textarea id="description" name="description" value={formData.description} onChange={handleInputChange} rows={3} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2 border"></textarea>
            </div>
            <div>
              <label htmlFor="category" className="block text-sm font-medium text-gray-700">Category</label>
              <input type="text" id="category" name="category" value={formData.category} onChange={handleInputChange} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2 border"/>
            </div>
            <button
              type="submit"
              className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Add Book
            </button>
          </form>
        </div>
      )}


      {/* Placeholder for displaying existing books */}
      <div className="mt-10">
        <h2 className="text-xl font-semibold mb-4">Existing Books</h2>        
        <ul>
          {existingBooks.map((book: any) => (
            <li key={book._id} className="border-b py-2 flex justify-between items-center"> {/* Assuming your book objects have an _id */}
              {book.title} by {book.author} (${book.price ? book.price.toFixed(2) : 'N/A'})
              <div>
                <button onClick={() => handleEditClick(book)} className="ml-4 text-blue-600 hover:underline">Edit</button>
                <button onClick={() => handleDelete(book._id)} className="ml-2 text-red-600 hover:underline">Delete</button>
              </div>
            </li>
          ))}
        </ul>

      </div>
    </div>
  );
}