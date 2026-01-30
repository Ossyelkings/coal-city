const errorHandler = (err, req, res, next) => {
  console.error(err.stack);

  // Multer file size error
  if (err.code === 'LIMIT_FILE_SIZE') {
    return res.status(400).json({
      error: { message: 'File too large. Maximum size is 5MB.', code: 'VALIDATION_ERROR' },
    });
  }

  // Multer file type error
  if (err.message && err.message.includes('Only JPEG')) {
    return res.status(400).json({
      error: { message: err.message, code: 'VALIDATION_ERROR' },
    });
  }

  // Mongoose validation error
  if (err.name === 'ValidationError') {
    const details = Object.values(err.errors).map((e) => ({
      field: e.path,
      message: e.message,
    }));
    return res.status(422).json({
      error: { message: 'Validation failed', code: 'VALIDATION_ERROR', details },
    });
  }

  // Mongoose duplicate key
  if (err.code === 11000) {
    const field = Object.keys(err.keyValue)[0];
    return res.status(409).json({
      error: { message: `Duplicate value for ${field}`, code: 'VALIDATION_ERROR' },
    });
  }

  // Mongoose cast error (invalid ObjectId)
  if (err.name === 'CastError') {
    return res.status(400).json({
      error: { message: 'Invalid ID format', code: 'VALIDATION_ERROR' },
    });
  }

  const statusCode = err.statusCode || 500;
  res.status(statusCode).json({
    error: {
      message: statusCode === 500 ? 'Internal server error' : err.message,
      code: 'SERVER_ERROR',
    },
  });
};

module.exports = errorHandler;
