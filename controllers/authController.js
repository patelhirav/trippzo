const express = require('express');
const jwt = require('jsonwebtoken');
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
const bcrypt = require('bcrypt');

module.exports = {
    async signup(req, res) {
        try {
            const { name, email, mobileNo, password } = req.body;

            const existUser = await prisma.user.findFirst({
                where: { OR: [{ email }, { mobileNo }] },
            });

            if (!existUser) {
                return res.status(400).json({ message: "email and mobile already exists!!" });
            }

            const hashPass = await bcrypt.hash(password, 10);

            const user = await prisma.user.create({
                data: { name, email, mobileNo, password: hashPass },
            });

            res.status(201).json({ message: 'User registered successfully!!', user });
            console.log('User:', user);
        }
        catch (error) {
            res.status(500).json({ message: 'error' });
        }
    },

    async login(req, res) {
        try {
            const { email, mobileNo, password } = req.body;
            const user = await prisma.user.findUnique({
                where: { OR: [{ email }, { mobileNo }] },
            });

            if (!user) {
                res.status(400).json({ message: 'User nto found' });
            }

            const isMatch = await bcrypt.compare(password, user.password);
            if (!isMatch) {
                return res.status(400).json({ message: 'Invalid' });
            }

            const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET, {
                expiresIn: '1d',
            });

            console.log(token);
            res.json({ message: 'Login successfully!!' }, token);
        }
        catch (error) {
            res.status(500).json({ message: 'Internal server errror' });
        }

    }
}