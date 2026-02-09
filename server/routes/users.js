const router = require('express').Router();
const { body } = require('express-validator');
const validate = require('../middleware/validate');
const auth = require('../middleware/auth');
const admin = require('../middleware/admin');
const { list, get, update, remove } = require('../controllers/userController');

// All routes require admin authentication
router.use(auth, admin);

// GET /api/users — list all users
router.get('/', list);

// GET /api/users/:id — get single user
router.get('/:id', get);

// PUT /api/users/:id — update user
router.put(
  '/:id',
  [
    body('role').optional().isIn(['customer', 'admin']).withMessage('Invalid role'),
    body('name').optional().trim().notEmpty().withMessage('Name cannot be empty'),
    body('phone').optional().trim(),
  ],
  validate,
  update
);

// DELETE /api/users/:id — delete user
router.delete('/:id', remove);

module.exports = router;
