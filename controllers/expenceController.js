// src/controllers/expenseController.js
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// Add an expense with optional splits
exports.addExpense = async (req, res) => {
  try {
    const { tripId, title, amount, category, date, location, photoUrl, splitType, splits } = req.body;
    const userId = req.userId;

    const expense = await prisma.expense.create({
      data: {
        tripId,
        addedBy: userId,
        title,
        amount: parseFloat(amount),
        category,
        date: date ? new Date(date) : new Date(),
        location,
        photoUrl,
        splitType,
        splits: {
          create: splits.map(split => ({
            userId: split.userId,
            amount: parseFloat(split.amount),
            paid: split.paid || false
          }))
        }
      },
      include: {
        splits: true
      }
    });

    res.status(201).json({ expense });
  } catch (err) {
    res.status(500).json({ message: 'Failed to add expense', error: err.message });
  }
};

// Get all expenses for a trip
exports.getTripExpenses = async (req, res) => {
  try {
    const { tripId } = req.params;

    const expenses = await prisma.expense.findMany({
      where: { tripId },
      include: {
        splits: true,
        addedByUser: true
      }
    });

    res.status(200).json({ expenses });
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch expenses', error: err.message });
  }
};

// Update an expense
exports.updateExpense = async (req, res) => {
  try {
    const { expenseId } = req.params;
    const { title, amount, category, date, location, photoUrl, splits } = req.body;

    const updated = await prisma.expense.update({
      where: { id: expenseId },
      data: {
        title,
        amount: parseFloat(amount),
        category,
        date: date ? new Date(date) : new Date(),
        location,
        photoUrl,
        splits: {
          deleteMany: {}, // Delete existing splits first
          create: splits.map(split => ({
            userId: split.userId,
            amount: parseFloat(split.amount),
            paid: split.paid || false
          }))
        }
      },
      include: { splits: true }
    });

    res.status(200).json({ updated });
  } catch (err) {
    res.status(500).json({ message: 'Failed to update expense', error: err.message });
  }
};

// Delete an expense
exports.deleteExpense = async (req, res) => {
  try {
    const { expenseId } = req.params;

    await prisma.expense.delete({ where: { id: expenseId } });
    res.status(204).send();
  } catch (err) {
    res.status(500).json({ message: 'Failed to delete expense', error: err.message });
  }
};
