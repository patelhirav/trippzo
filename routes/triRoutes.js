// routes/tripRoutes.js
const express = require("express");
const router = express.Router();
const tripController = require("../controllers/addTripController");

// Create a new trip with initial members
router.post("/create", tripController.createTrip);

// Add more members to an existing trip
router.post("/add-members", tripController.addMembersToTrip);

// Get trip with member details
router.get("/:tripId", tripController.getTripDetails);

module.exports = router;
