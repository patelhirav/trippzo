// src/routes/balanceRoutes.js
const express = require('express');
const router = express.Router();
const balanceController = require('../controllers/balanceController');
const auth = require('../middleware/authMiddleware');

// Calculate balances
router.get('/:tripId', auth, balanceController.getTripBalances);

// Settle up a debt
router.post('/settle', auth, balanceController.settleDebt);

// View history
router.get('/history/:tripId', auth, balanceController.getBalanceHistory);

module.exports = router;
