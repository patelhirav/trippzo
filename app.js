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

app.get("/", (req, res) => {
  res.send(`
    <h1>Trippzo API</h1>
    <p>This is a backend service for OTP authentication and trip planning.</p>
    
    <h3>Auth Routes</h3>
    <ul>
      <li>Signup - <a href="https://trippzo.onrender.com/api/auth/signup">/api/auth/signup</a></li>
      <li>Login - <a href="https://trippzo.onrender.com/api/auth/login">/api/auth/login</a></li>
    </ul>

    <h3>OTP Routes</h3>
    <ul>
      <li>Send OTP - <a href="https://trippzo.onrender.com/api/otp/send-otp">/api/otp/send-otp</a></li>
      <li>Verify OTP - <a href="https://trippzo.onrender.com/api/otp/verify-otp">/api/otp/verify-otp</a></li>
      <li>Reset Password - <a href="https://trippzo.onrender.com/api/otp/reset-password">/api/otp/reset-password</a></li>
    </ul>

    <h3>Trip Routes</h3>
    <ul>
      <li>Create Trip - <code>POST /api/trips/create</code></li>
      <li>Add Members to Trip - <code>POST /api/trips/add-members</code></li>
      <li>Get Trip Details - <code>GET /api/trips/:tripId</code></li>
    </ul>

    <p>Check <a href="/api-docs">API Documentation</a> for full specs.</p>
  `);
});

app.listen(8080, () => {
  console.log(`Server running on port http://localhost:8080`);
});
