// tripController.js
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

module.exports = {
  async createTrip(req, res) {
    try {
      const { destination, departDate, returnDate, budget, groupName, userIds } = req.body;

      const trip = await prisma.trip.create({
        data: {
          destination,
          departDate: new Date(departDate),
          returnDate: new Date(returnDate),
          budget,
          groupName,
        },
      });

      // Add members to the TripMember join table
      const members = userIds.map(userId => ({
        userId,
        tripId: trip.id,
      }));

      await prisma.tripMember.createMany({
        data: members,
      });

      res.status(201).json({ message: "Trip created successfully", trip });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  async addMembersToTrip(req, res) {
    try {
      const { tripId, userIds } = req.body;

      const members = userIds.map(userId => ({
        userId,
        tripId,
      }));

      await prisma.tripMember.createMany({
        data: members,
        skipDuplicates: true, // prevents adding the same user-trip combination twice
      });

      res.status(200).json({ message: "Members added successfully" });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  async getTripDetails(req, res) {
    try {
      const { tripId } = req.params;

      const trip = await prisma.trip.findUnique({
        where: { id: tripId },
        include: {
          memberships: {
            include: {
              user: true,
            },
          },
        },
      });

      res.status(200).json(trip);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },
};
