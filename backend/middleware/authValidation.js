// backend/middleware/authValidation.js

const validateLoginInput = (req, res, next) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: 'Email and password are required' });
  }

  next();
};

const validateEmailFormat = (req, res, next) => {
  const { email } = req.body;
  const emailRegex = /\S+@\S+\.\S+/;

  if (!emailRegex.test(email)) {
    return res.status(400).json({ message: 'Invalid email format' });
  }

  next();
};

const validateGmailDomain = (req, res, next) => {
  const { email } = req.body;

  if (!email.endsWith('@gmail.com')) {
    return res.status(400).json({ message: 'Email must end with @gmail.com' });
  }

  next();
};

module.exports = {
  validateLoginInput,
  validateEmailFormat,
  validateGmailDomain,
};