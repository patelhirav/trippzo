// src/routes/tripRoutes.js
const express = require('express');
const router = express.Router();
const tripController = require('../controllers/addTripController');
const authMiddleware = require('../middleware/authMiddleware');

router.post('/', authMiddleware, tripController.createTrip);

module.exports = router;
