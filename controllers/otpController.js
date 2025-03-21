const { PrismaClient } = require("@prisma/client");
const nodemailer = require("nodemailer");
const crypto = require("crypto");
const bcrypt = require("bcryptjs");

const prisma = new PrismaClient();
const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: "patelhirav2212@gmail.com",
        pass: "oqzb aajk mamu yhyf",
    }
});

const generateOtp = () => crypto.randomInt(1000, 9999).toString();

module.exports = {
    async sendOTP(req, res) {
        const { email } = req.body;
        if (!email) return res.status(400).json({ message: "Email required" });

        try {
            const otp = generateOtp();
            const expire_at = new Date(Date.now() + 10 * 60 * 1000);

            await prisma.oTP.create({ data: { email, otp, expire_at } });

            await transporter.sendMail({
                from: "patelhirav2212@gmail.com",
                to: email,
                subject: "Your OTP",
                text: `Your OTP is: ${otp}. It expires in 10 minutes.`
            });

            res.json({ message: "OTP Sent Successfully!!" });
        } catch (error) {
            res.status(500).json({ message: "Error sending email", error: error.message });
        }
    },

    async verifyOTP(req, res) {
        const { email, otp } = req.body;
        if (!email || !otp) return res.status(400).json({ message: "Email and OTP are required" });

        try {
            const otpRecord = await prisma.oTP.findFirst({ where: { email, otp } });
            if (!otpRecord || new Date() > new Date(otpRecord.expire_at)) {
                return res.status(400).json({ message: "Invalid or expired OTP" });
            }

            await prisma.oTP.deleteMany({ where: { email } });
            res.json({ message: "OTP verified successfully" });
        } catch (error) {
            res.status(500).json({ message: "Error verifying OTP", error: error.message });
        }
    },

    async resetPassword(req, res) {
        const { email, newPassword } = req.body;
        if (!email || !newPassword) return res.status(400).json({ message: "Email and password required" });

        try {
            const hashPass = await bcrypt.hash(newPassword, 10);
            await prisma.user.update({ where: { email }, data: { password: hashPass } });
            res.json({ message: "Password reset successfully" });
        } catch (error) {
            res.status(500).json({ message: "Error resetting password", error: error.message });
        }
    },
}
