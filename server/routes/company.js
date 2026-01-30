const router = require('express').Router();
const auth = require('../middleware/auth');
const admin = require('../middleware/admin');
const { get, update } = require('../controllers/companyController');

// Public
router.get('/', get);

// Admin
router.put('/', auth, admin, update);

module.exports = router;
