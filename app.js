const express = require("express");
const cors = require("cors");
require("dotenv").config();

const authRoutes = require("./routes/authRoutes");
const otpRoutes = require("./routes/otpRoutes");

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

app.get("/", (req, res) => {
  res.send(`
    <h1>Trippzo API</h1>
    <p>This is a backend service for OTP authentication.</p>
    <p>Check <a href="/api-docs">API Documentation</a> for available endpoints.</p>

    <h3>API Routes</h3>
    <table border="1" cellpadding="5" cellspacing="0" style="width: 100%; text-align: left;">
      <thead>
        <tr>
          <th>Route</th>
          <th>Method</th>
          <th>Description</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td><a href="/api/auth/signup">/api/auth/signup</a></td>
          <td>POST</td>
          <td>User registration endpoint.</td>
        </tr>
        <tr>
          <td><a href="/api/auth/login">/api/auth/login</a></td>
          <td>POST</td>
          <td>User login endpoint.</td>
        </tr>
        <tr>
          <td><a href="/api/otp/send-otp">/api/otp/send-otp</a></td>
          <td>POST</td>
          <td>Send OTP to a user for authentication.</td>
        </tr>
        <tr>
          <td><a href="/api/otp/verify-otp">/api/otp/verify-otp</a></td>
          <td>POST</td>
          <td>Verify OTP entered by the user.</td>
        </tr>
        <tr>
          <td><a href="/api/otp/reset-password">/api/otp/reset-password</a></td>
          <td>POST</td>
          <td>Reset password using OTP.</td>
        </tr>
      </tbody>
    </table>
  `);
});

app.listen(8080, () => {
  console.log(`Server running on port http://localhost:8080`);
});
