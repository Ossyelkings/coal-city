const router = require('express').Router();
const { body } = require('express-validator');
const validate = require('../middleware/validate');
const auth = require('../middleware/auth');
const admin = require('../middleware/admin');
const {
  list,
  getById,
  create,
  update,
  remove,
} = require('../controllers/productController');

const productValidation = [
  body('name').trim().notEmpty().withMessage('Name is required'),
  body('category').notEmpty().withMessage('Category is required'),
  body('description').trim().notEmpty().withMessage('Description is required'),
  body('image').optional().trim(),
  body('price').optional().isNumeric().withMessage('Price must be a number'),
  body('inStock').optional().isBoolean(),
  body('featured').optional().isBoolean(),
];

// Public
router.get('/', list);
router.get('/:id', getById);

// Admin
router.post('/', auth, admin, productValidation, validate, create);
router.put('/:id', auth, admin, productValidation, validate, update);
router.delete('/:id', auth, admin, remove);

module.exports = router;
