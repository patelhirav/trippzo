const express = require("express");
const router = express.Router();
const expenseController = require("../controllers/expenceController");

router.post("/add", expenseController.addExpense);
router.get("/:tripId", expenseController.getExpensesByTrip);
router.get("/balance/:tripId", expenseController.getBalance);

module.exports = router;
