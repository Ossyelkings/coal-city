// POST /api/upload
exports.uploadImage = (req, res, next) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        error: { message: 'No image file provided', code: 'VALIDATION_ERROR' },
      });
    }

    res.status(201).json({
      url: `/uploads/${req.file.filename}`,
      filename: req.file.filename,
    });
  } catch (err) {
    next(err);
  }
};
