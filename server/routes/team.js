const router = require('express').Router();
const { body } = require('express-validator');
const validate = require('../middleware/validate');
const auth = require('../middleware/auth');
const admin = require('../middleware/admin');
const {
  list,
  create,
  update,
  remove,
} = require('../controllers/teamController');

const teamValidation = [
  body('name').trim().notEmpty().withMessage('Name is required'),
  body('role').trim().notEmpty().withMessage('Role is required'),
  body('image').optional().trim(),
  body('bio').optional().trim(),
  body('order').optional().isNumeric().withMessage('Order must be a number'),
];

// Public
router.get('/', list);

// Admin
router.post('/', auth, admin, teamValidation, validate, create);
router.put('/:id', auth, admin, teamValidation, validate, update);
router.delete('/:id', auth, admin, remove);

module.exports = router;
