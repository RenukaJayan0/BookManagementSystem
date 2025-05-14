const express = require('express');
const router = express.Router();
const Book = require('../models/Book'); // Assuming your Book model is in ../models/Book.js
const auth = require('../middleware/auth'); // Assuming you have an auth middleware

// Route to add a new book (Admin only)
router.post('/books', auth, async (req, res) => {
    // In a real application, you would also validate the input data
    const { title, author, isbn, price, quantity, description, imageUrl } = req.body;
//ntc
    try {
        // Basic validation (you should add more comprehensive validation)
        if (!title || !author || !isbn || !price || !quantity) {
            return res.status(400).json({ msg: 'Please enter all required fields' });
        }

        // Create a new book instance
        const newBook = new Book({
            title,
            author,
            isbn,
            price,
            quantity,
            description,
            imageUrl
        });

        // Save the book to the database
        const book = await newBook.save();

        // In a real application, you would trigger a notification here (Observer pattern)
        // For example: notificationService.notify('bookAdded', book);

        res.json(book); // Return the saved book object
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// Route to edit a book by ID (Admin only)
router.put('/books/:id', auth, async (req, res) => {
    // In a real application, you would also validate the input data
    const { title, author, isbn, price, quantity, description, imageUrl } = req.body;
    const bookFields = {};
    if (title) bookFields.title = title;
    if (author) bookFields.author = author;
    if (isbn) bookFields.isbn = isbn;
    if (price) bookFields.price = price;
    if (quantity) bookFields.quantity = quantity;
    if (description) bookFields.description = description;
    if (imageUrl) bookFields.imageUrl = imageUrl;

    try {
        let book = await Book.findById(req.params.id);

        if (!book) {
            return res.status(404).json({ msg: 'Book not found' });
        }

        // Check if user is admin (you should implement proper role checking in auth middleware or here)
        // if (req.user.role !== 'Admin') {
        //     return res.status(403).json({ msg: 'Not authorized' });
        // }

        book = await Book.findByIdAndUpdate(
            req.params.id,
            { $set: bookFields },
            { new: true }
        );

        // In a real application, you would trigger a notification here (Observer pattern)
        // For example: notificationService.notify('bookUpdated', book);

        res.json(book);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// Route to delete a book by ID (Admin only)
router.delete('/books/:id', auth, async (req, res) => {
    try {
        const book = await Book.findById(req.params.id);

        if (!book) {
            return res.status(404).json({ msg: 'Book not found' });
        }

        // Check if user is admin (you should implement proper role checking in auth middleware or here)
        // if (req.user.role !== 'Admin') {
        //     return res.status(403).json({ msg: 'Not authorized' });
        // }

        await Book.findByIdAndRemove(req.params.id);

        // In a real application, you would trigger a notification here (Observer pattern)
        // For example: notificationService.notify('bookDeleted', book);

        res.json({ msg: 'Book removed' });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

module.exports = router;