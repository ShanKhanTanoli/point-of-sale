const express = require('express');
const router = express.Router();
const userController = require('../controllers/UserController');

router.get('/', userController.home);
router.get('/profile', userController.profile);

module.exports = router;
