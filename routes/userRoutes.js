const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const authMiddleware = require('../middleware/authMiddleware');

router.post('/', userController.createUser); // <-- for POST /api/users
router.post('/login', userController.loginUser);
router.get('/me', authMiddleware, userController.getCurrentUser);
router.get('/', userController.getUsers);
router.get('/simple', userController.simple);
module.exports = router;
