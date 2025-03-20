const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

module.exports = {
    async signup(req, res) {
        try {
            const { name, email, mobileNo, password } = req.body;

            const existingUser = await prisma.user.findFirst({
                where: { OR: [{ email }, { mobileNo }] },
            });

            if (existingUser) {
                return res.status(400).json({ message: "email or mobile already exists" });
            }

            const hashedPassword = await bcrypt.hash(password, 10);

            const user = await prisma.user.create({
                data: { name, email, mobileNo, password: hashedPassword },
            });

            res.status(201).json({ message: "user resgitration successfully!!", user });
        } catch (err) {
            res.status(500).json({ error: err.message });
        }
    },

    async login(req, res) {
        try {
            const { email, mobileNo, password } = req.body;

            const user = await prisma.user.findFirst({
                where: { OR: [{ email }, { mobileNo }] },
            });

            if (!user) {
                return res.status(400).json({ message: "User not found" });
            }

            const isMatch = await bcrypt.compare(password, user.password);
            if (!isMatch) {
                return res.status(400).json({ message: "Invalid credentials" });
            }

            const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET, {
                expiresIn: "1d",
            });

            res.json({ message: "Login successful", token, user });
        } catch (err) {
            res.status(500).json({ error: err.message });
        }
    }
}