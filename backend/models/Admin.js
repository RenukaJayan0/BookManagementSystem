const User = require('./User');

class Admin extends User {
  constructor(email, password) {
    super(email, password);
    // Additional admin-specific properties can be added here later
  }

  // Additional admin-specific methods can be added here later
}

module.exports = Admin;