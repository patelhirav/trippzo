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

app.listen(8080, () => {
  console.log(`Server running on port http://localhost:8080`);
});