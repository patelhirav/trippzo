const express = require('express');
const { signup, login } = require('../controllers/authController');

const router = express.Router();

router.post('/singup', signup);
router.post('/login', login);

module.exports = router;