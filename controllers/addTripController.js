// src/controllers/tripController.js
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

exports.createTrip = async (req, res) => {
  try {
    const { name, destination, startDate, endDate, budget, members } = req.body;
    const userId = req.userId;

    const trip = await prisma.trip.create({
      data: {
        name,
        destination,
        startDate: new Date(startDate),
        endDate: new Date(endDate),
        budget: parseFloat(budget),
        createdBy: userId,
        members: {
          create: members.map(member => ({
            name: member.name,
            email: member.email,
            userId: member.userId || null,
            invited: !member.userId,
            joined: !!member.userId
          }))
        }
      },
      include: { members: true }
    });

    res.status(201).json({ trip });
  } catch (err) {
    res.status(500).json({ message: 'Failed to create trip', error: err.message });
  }
};
