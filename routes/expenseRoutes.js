// src/routes/expenseRoutes.js
const express = require('express');
const router = express.Router();
const expenseController = require('../controllers/expenceController');
const auth = require('../middleware/authMiddleware');

router.post('/', auth, expenseController.addExpense);
router.get('/:tripId', auth, expenseController.getTripExpenses);
router.put('/:expenseId', auth, expenseController.updateExpense);
router.delete('/:expenseId', auth, expenseController.deleteExpense);

module.exports = router;
