const jwt = require('jsonwebtoken');
const User = require('../models/User');

const auth = async (req, res, next) => {
  const header = req.headers.authorization;

  if (!header || !header.startsWith('Bearer ')) {
    return res.status(401).json({
      error: { message: 'No token provided', code: 'AUTH_ERROR' },
    });
  }

  const token = header.split(' ')[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id).select('-password -refreshToken');

    if (!user) {
      return res.status(401).json({
        error: { message: 'User not found', code: 'AUTH_ERROR' },
      });
    }

    req.user = user;
    next();
  } catch (err) {
    return res.status(401).json({
      error: { message: 'Invalid or expired token', code: 'AUTH_ERROR' },
    });
  }
};

module.exports = auth;
