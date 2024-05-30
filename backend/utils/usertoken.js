// Create a token (during login)
const jwt = require('jsonwebtoken');

const generateToken = (user) => {
  const token = jwt.sign({ userId: user._id }, 'yash', { expiresIn: '1h' });
  return token;
};

// Verify a token (for protected routes)
const verifyToken = (token) => {
  try {
    const decoded = jwt.verify(token, 'yash');  
    return decoded;
  } catch (error) {
    return null;  
  }
};

module.exports = { generateToken, verifyToken };
