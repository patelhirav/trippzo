// src/controllers/balanceController.js
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// Calculate balances for a trip
exports.getTripBalances = async (req, res) => {
  try {
    const { tripId } = req.params;

    // Get all expenses + splits
    const expenses = await prisma.expense.findMany({
      where: { tripId },
      include: { splits: true, addedByUser: true }
    });

    const balances = {}; // { [userId]: netAmount }

    expenses.forEach(exp => {
      const total = exp.amount;
      const payerId = exp.addedBy;

      // Initialize payer
      if (!balances[payerId]) balances[payerId] = 0;

      // Add total to payer
      balances[payerId] += total;

      // Subtract split share from each user
      exp.splits.forEach(split => {
        if (!balances[split.userId]) balances[split.userId] = 0;
        balances[split.userId] -= split.amount;
      });
    });

    // Generate pair-wise settlements
    const netUsers = Object.entries(balances).map(([userId, balance]) => ({
      userId,
      balance
    }));

    const debtPairs = [];

    const creditors = netUsers.filter(u => u.balance > 0).sort((a, b) => b.balance - a.balance);
    const debtors = netUsers.filter(u => u.balance < 0).sort((a, b) => a.balance - b.balance);

    let i = 0, j = 0;

    while (i < creditors.length && j < debtors.length) {
      const credit = creditors[i];
      const debt = debtors[j];
      const amount = Math.min(credit.balance, -debt.balance);

      debtPairs.push({
        from: debt.userId,
        to: credit.userId,
        amount: parseFloat(amount.toFixed(2)),
        settled: false
      });

      credit.balance -= amount;
      debt.balance += amount;

      if (credit.balance < 0.01) i++;
      if (-debt.balance < 0.01) j++;
    }

    res.status(200).json({ debts: debtPairs });
  } catch (err) {
    res.status(500).json({ message: 'Failed to calculate balances', error: err.message });
  }
};

// Settle a debt
exports.settleDebt = async (req, res) => {
  try {
    const { tripId, payerId, receiverId, amount } = req.body;

    const balance = await prisma.balance.create({
      data: {
        tripId,
        payerId,
        receiverId,
        amount: parseFloat(amount),
        settled: true,
        settledAt: new Date()
      }
    });

    res.status(201).json({ message: 'Debt settled', balance });
  } catch (err) {
    res.status(500).json({ message: 'Failed to settle debt', error: err.message });
  }
};

// Get settlement history
exports.getBalanceHistory = async (req, res) => {
  try {
    const { tripId } = req.params;

    const records = await prisma.balance.findMany({
      where: { tripId },
      include: {
        payer: true,
        receiver: true
      },
      orderBy: { settledAt: 'desc' }
    });

    res.status(200).json({ history: records });
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch history', error: err.message });
  }
};
