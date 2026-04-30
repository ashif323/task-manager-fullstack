const router = require('express').Router();
const auth = require('../middleware/auth');
const { getAllUsers, getMe } = require('../controllers/userController');

router.get('/',   auth, getAllUsers);
router.get('/me', auth, getMe);

module.exports = router;