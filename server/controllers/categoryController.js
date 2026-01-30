const Category = require('../models/Category');

// GET /api/categories
exports.list = async (req, res, next) => {
  try {
    const categories = await Category.find().sort({ order: 1 });
    res.json(categories);
  } catch (err) {
    next(err);
  }
};

// GET /api/categories/:id
exports.getById = async (req, res, next) => {
  try {
    // Support lookup by ObjectId or slug
    const { id } = req.params;
    const category = id.match(/^[0-9a-fA-F]{24}$/)
      ? await Category.findById(id)
      : await Category.findOne({ slug: id });

    if (!category) {
      return res.status(404).json({
        error: { message: 'Category not found', code: 'NOT_FOUND' },
      });
    }
    res.json(category);
  } catch (err) {
    next(err);
  }
};

// POST /api/categories
exports.create = async (req, res, next) => {
  try {
    const category = await Category.create(req.body);
    res.status(201).json(category);
  } catch (err) {
    next(err);
  }
};

// PUT /api/categories/:id
exports.update = async (req, res, next) => {
  try {
    const category = await Category.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!category) {
      return res.status(404).json({
        error: { message: 'Category not found', code: 'NOT_FOUND' },
      });
    }
    res.json(category);
  } catch (err) {
    next(err);
  }
};

// DELETE /api/categories/:id
exports.remove = async (req, res, next) => {
  try {
    const category = await Category.findByIdAndDelete(req.params.id);
    if (!category) {
      return res.status(404).json({
        error: { message: 'Category not found', code: 'NOT_FOUND' },
      });
    }
    res.json({ message: 'Category deleted' });
  } catch (err) {
    next(err);
  }
};
