const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User'); // Assuming User model is in ../models/User.js
const { generateAuthToken } = require('../middleware/auth'); // Corrected import path for generateAuthToken

router.post('/login', async (req, res) => {
    const { email, password } = req.body;

    try {
        // Find the user by email
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }

        // Compare the provided password with the stored hashed password
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }

        // Use the factory method to create an instance of the specific user type
        const userInstance = User.createUser(user.toObject()); // Pass a plain object to the factory

        // Generate a JWT token
        const token = generateAuthToken(userInstance._id);

        res.json({ token, user: { id: userInstance._id, role: userInstance.role } });

    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

module.exports = router;