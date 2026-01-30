const router = require('express').Router();
const { body } = require('express-validator');
const validate = require('../middleware/validate');
const auth = require('../middleware/auth');
const admin = require('../middleware/admin');
const {
  submit,
  list,
  getById,
  updateStatus,
} = require('../controllers/contactController');

const contactValidation = [
  body('name').trim().notEmpty().withMessage('Name is required'),
  body('email').isEmail().normalizeEmail().withMessage('Valid email is required'),
  body('phone').optional().trim(),
  body('subject').trim().notEmpty().withMessage('Subject is required'),
  body('message').trim().notEmpty().withMessage('Message is required'),
];

// Public
router.post('/', contactValidation, validate, submit);

// Admin
router.get('/', auth, admin, list);
router.get('/:id', auth, admin, getById);
router.put(
  '/:id/status',
  auth,
  admin,
  [
    body('status')
      .isIn(['new', 'read', 'replied', 'archived'])
      .withMessage('Invalid status'),
    body('notes').optional().trim(),
  ],
  validate,
  updateStatus
);

module.exports = router;
