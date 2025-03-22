const express = require("express");
const cors = require("cors");
require("dotenv").config();

const authRoutes = require("./routes/authRoutes");
const otpRoutes = require("./routes/otpRoutes")

const app = express();
app.use(express.json());
app.use(cors());

app.use("/api/auth", authRoutes);
app.use('/api/otp', otpRoutes);

app.get("/", (req, res) => {
  res.send(`
      <h1>Trippzo API</h1>
      <p>This is a backend service for OTP authentication.</p>
      <p>Check <a href="/api-docs">API Documentation</a> for available endpoints.</p>
      <p>Singup - https://trippzo.onrender.com/api/auth/signup </p>
      <p>Login - https://trippzo.onrender.com/api/auth/login </p>
      <p>Send-otp - https://trippzo.onrender.com/api/otp/send-otp </p>
      <p>Verify-otp - https://trippzo.onrender.com/api/otp/verify-otp </p>
      <p>Reset-Password - https://trippzo.onrender.com/api/otp/reset-password </p>
  `);
});


app.listen(8080, () => {
  console.log(`Server running on port http://localhost:8080`);
});