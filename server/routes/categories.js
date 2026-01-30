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
} = require('../controllers/categoryController');

const categoryValidation = [
  body('name').trim().notEmpty().withMessage('Name is required'),
  body('description').optional().trim(),
  body('image').optional().trim(),
  body('icon').optional().trim(),
  body('order').optional().isNumeric().withMessage('Order must be a number'),
];

// Public
router.get('/', list);
router.get('/:id', getById);

// Admin
router.post('/', auth, admin, categoryValidation, validate, create);
router.put('/:id', auth, admin, categoryValidation, validate, update);
router.delete('/:id', auth, admin, remove);

module.exports = router;
