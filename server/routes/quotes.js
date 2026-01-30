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
  myQuotes,
} = require('../controllers/quoteController');

const quoteValidation = [
  body('name').trim().notEmpty().withMessage('Name is required'),
  body('email').isEmail().normalizeEmail().withMessage('Valid email is required'),
  body('phone').trim().notEmpty().withMessage('Phone is required'),
  body('product').trim().notEmpty().withMessage('Product is required'),
  body('message').optional().trim(),
];

// Public — submit a quote (optionally attach logged-in user)
router.post('/', quoteValidation, validate, (req, res, next) => {
  // Try to extract user from token if present, but don't require it
  const header = req.headers.authorization;
  if (header && header.startsWith('Bearer ')) {
    const jwt = require('jsonwebtoken');
    try {
      const decoded = jwt.verify(header.split(' ')[1], process.env.JWT_SECRET);
      req.user = { _id: decoded.id };
    } catch {
      // Token invalid — proceed without user
    }
  }
  next();
}, submit);

// Auth — user's own quotes (must be before /:id to avoid conflict)
router.get('/my', auth, myQuotes);

// Admin
router.get('/', auth, admin, list);
router.get('/:id', auth, admin, getById);
router.put(
  '/:id/status',
  auth,
  admin,
  [
    body('status')
      .isIn(['new', 'reviewed', 'contacted', 'quoted', 'closed'])
      .withMessage('Invalid status'),
    body('notes').optional().trim(),
  ],
  validate,
  updateStatus
);

module.exports = router;
