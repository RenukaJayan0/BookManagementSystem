const mongoose = require('mongoose');
const LowStockObserver = require('../observers/LowStockObserver'); // Import the LowStockObserver
//s
const bookSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  author: {
    type: String,
    required: true
  },
  price: {
    type: Number,
    required: true,
    default: 0 // Assuming a default price
  },
  stock: {
    type: Number,
    required: true,
    default: 0 // Assuming a default stock of 0
  },
  observers: {
    type: [mongoose.Schema.Types.ObjectId], // Store user IDs who are observing
    ref: 'User',
    default: []
  }
});

// Post-find hook to attach the LowStockObserver when a book is retrieved
bookSchema.post('find', function(books) {
  books.forEach(book => {
    if (book.stock <= 5) { // Attach observer if stock is low
      const lowStockObserverInstance = new LowStockObserver();
      // In a real application, you would attach this observer to the admin user
      // For now, we'll just simulate the notification logic here
      lowStockObserverInstance.update({ title: book.title, stock: book.stock });
    }
  });
});


// Add methods for the Observer pattern
bookSchema.methods.attach = function(observerId) {
  this.observers.push(observerId);
};

bookSchema.methods.notify = async function() {
  if (this.stock <= 5) { // Define your low stock threshold here
    // In a real application, you would send notifications to the observers here
    console.log(`Low stock alert for book "${this.title}". Stock: ${this.stock}`);
    const lowStockObserverInstance = new LowStockObserver();
    lowStockObserverInstance.update({ title: this.title, stock: this.stock });
  }
  // Notify other observers (users who reserved the book)
};

const Book = mongoose.model('Book', bookSchema);

module.exports = Book;