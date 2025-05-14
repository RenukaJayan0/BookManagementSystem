class LowStockObserver {
  update(book) {
    console.log(`Low stock alert for book: ${book.title}. Current stock: ${book.stock}`);
    // In a real application, you would send an email or trigger a more sophisticated alert here.
  }
}

module.exports = LowStockObserver;