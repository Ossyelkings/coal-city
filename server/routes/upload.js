const router = require('express').Router();
const auth = require('../middleware/auth');
const admin = require('../middleware/admin');
const upload = require('../middleware/upload');
const { uploadImage } = require('../controllers/uploadController');

// Admin
router.post('/', auth, admin, upload.single('image'), uploadImage);

module.exports = router;
