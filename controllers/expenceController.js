const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

module.exports = {
  // Add Expense and auto-split evenly
  async addExpense(req, res) {
    try {
      const {
        tripId,
        paidBy,
        amount,
        category,
        date,
        note,
        location,
        splitBetween, // [userId1, userId2, ...]
        photoUrl
      } = req.body;

      const expense = await prisma.expense.create({
        data: {
          tripId,
          paidBy,
          amount,
          category,
          date: new Date(date),
          note,
          location,
          photoUrl,
        },
      });

      const shareAmount = parseFloat((amount / splitBetween.length).toFixed(2));

      const shares = splitBetween.map((userId) => ({
        expenseId: expense.id,
        userId,
        owedAmount: shareAmount,
      }));

      await prisma.expenseShare.createMany({ data: shares });

      res.status(201).json({ message: "Expense added", expense });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  // Get all expenses in a trip
  async getExpensesByTrip(req, res) {
    try {
      const { tripId } = req.params;

      const expenses = await prisma.expense.findMany({
        where: { tripId },
        include: {
          shares: true,
        },
        orderBy: { date: "desc" },
      });

      res.status(200).json(expenses);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  // Get balance summary (who owes whom)
  async getBalance(req, res) {
    try {
      const { tripId } = req.params;

      const expenses = await prisma.expense.findMany({
        where: { tripId },
        include: { shares: true },
      });

      const userBalances = {};

      for (const expense of expenses) {
        const payer = expense.paidBy;
        userBalances[payer] = (userBalances[payer] || 0) + expense.amount;

        for (const share of expense.shares) {
          userBalances[share.userId] = (userBalances[share.userId] || 0) - share.owedAmount;
        }
      }

      res.status(200).json({ balances: userBalances });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },
};
