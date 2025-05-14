// backend/middleware/auth.js

const jwt = require('jsonwebtoken');

const authenticateJWT = (req, res, next) => {
  // Get token from headers (e.g., Authorization: Bearer <token>)
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (token == null) {
    return res.status(401).json({ message: 'Access token missing' }); // If no token, return unauthorized
  }

  jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({ message: 'Invalid or expired token' }); // If verification fails
    }
    req.user = user; // Attach user payload to request
    next(); // Proceed to the next middleware or route handler
  });
};

module.exports = authenticateJWT;