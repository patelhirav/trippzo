const express = require("express");
const cors = require("cors");
require("dotenv").config();


const authRoutes = require("./routes/authRoutes");
const otpRoutes = require("./routes/otpRoutes");
const tripRoutes = require("./routes/triRoutes"); 


const app = express();

// CORS Configuration (Optional)
const corsOptions = {
  origin: "*", // This allows requests from any origin, you can restrict this as needed.
  methods: ["GET", "POST", "PUT", "DELETE"],
  allowedHeaders: ["Content-Type", "Authorization"],
};
app.use(cors(corsOptions));

app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api/otp", otpRoutes);
app.use("/api/trips", tripRoutes); 

const express = require("express");
const cors = require("cors");
require("dotenv").config();

app.get("/", (req, res) => {
  res.send(`
    <h1>Trippzo API</h1>
    <p>This is the backend service for trip planning, group expenses, and OTP-based authentication.</p>
    <h1>Base URL: https://trippzo.onrender.com </h1>
    <h2>Auth Routes</h2>
    <ul>
      <li><code>POST /api/auth/signup</code> – Register a new user</li>
      <li><code>POST /api/auth/login</code> – Login with email or mobile</li>
    </ul>

    <h2>OTP Routes</h2>
    <ul>
      <li><code>POST /api/otp/send-otp</code> – Send OTP to email</li>
      <li><code>POST /api/otp/verify-otp</code> – Verify OTP</li>
      <li><code>POST /api/otp/reset-password</code> – Reset password with verified OTP</li>
    </ul>

    <h2>Trip Routes</h2>
    <ul>
      <li><code>POST /api/trips/create</code> – Create a new trip with members</li>
      <li><code>POST /api/trips/add-members</code> – Add members to an existing trip</li>
      <li><code>GET /api/trips/:tripId</code> – Get trip details including members</li>
    </ul>

    <h2>Expense Routes</h2>
    <ul>
      <li><code>POST /api/expenses/add</code> – Add an expense and split it among users</li>
      <li><code>GET /api/expenses/:tripId</code> – Get all expenses in a trip</li>
      <li><code>GET /api/expenses/balance/:tripId</code> – Get balance summary (who owes whom)</li>
    </ul>
  `);
});

app.listen(8080, () => {
  console.log(`Server running on port http://localhost:8080`);
});
