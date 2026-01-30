const admin = (req, res, next) => {
  if (!req.user || req.user.role !== 'admin') {
    return res.status(403).json({
      error: { message: 'Admin access required', code: 'AUTH_ERROR' },
    });
  }
  next();
};

module.exports = admin;
