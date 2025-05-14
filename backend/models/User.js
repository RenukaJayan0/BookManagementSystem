const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

// Mongoose Schema for User

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  role: {
    type: String,
    enum: ['Admin', 'Member'],
  },
  cart: [
    {
      bookId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Book',
      },
      quantity: { type: Number, default: 1 },
    },
  ],
});

// Mongoose pre-save hook to hash the password before saving
userSchema.pre('save', async function (next) {
  // Only hash the password if it has been modified (or is new)
  if (!this.isModified('password')) {
    return next();
  }

  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

const User = mongoose.model('User', userSchema);

class Admin extends User {
  // Admin specific methods/properties can go here
}

class Member extends User {
  // Member specific methods/properties can go here
}

// Factory function to create user instances based on role
User.createUser = (userData) => {
  if (userData.role === 'Admin') {
    return new Admin(userData);
  } else {
    return new Member(userData);
  }
};

module.exports = User;