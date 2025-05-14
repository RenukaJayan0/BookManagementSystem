const User = require('./User');

class Member extends User {
  constructor(email, password) {
    super(email, password);
    // Add any member-specific properties here later if needed
  }

  // Add any member-specific methods here later if needed
}

module.exports = Member;