const userController = require('../controllers/userController');
const authMiddleware = require('../middleware/authMiddleware');

const router = require('express').Router();

// Get all users
router.get('/', authMiddleware.verifyToken, userController.getAllUsers);

// Delete user
router.delete('/:id', authMiddleware.verifyTokenAndUserAuthorization, userController.deleteUser);

module.exports = router;