const router = require('express').Router();
const authController = require('../controllers/authController');
const authMiddleware = require('../middleware/authMiddleware');

router.post('/register', authController.registerUser);
router.post('/login', authController.loginUser);
router.post('/refreshToken', authController.requestRefreshToken);
router.post('/logout', authMiddleware.verifyToken, authController.logoutUser);

module.exports = router;