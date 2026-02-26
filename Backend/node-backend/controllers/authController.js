const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");

const signToken = (user) =>
    jwt.sign(
        { id: user._id, name: user.name, email: user.email, role: user.role },
        process.env.JWT_SECRET,
        { expiresIn: "7d" }
    );

// POST /api/auth/register — customer only
const register = async (req, res) => {
    try {
        const { name, email: rawEmail, password } = req.body;
        const email = rawEmail?.toLowerCase().trim();
        if (!name || !email || !password)
            return res.status(400).json({ message: "All fields are required." });

        const existing = await User.findOne({ email });
        if (existing)
            return res.status(409).json({ message: "Email already in use." });

        const passwordHash = await bcrypt.hash(password, 12);
        const user = await User.create({ name, email, passwordHash, role: "customer" });

        const token = signToken(user);
        res.status(201).json({
            message: "Registration successful.",
            token,
            user: { id: user._id, name: user.name, email: user.email, role: user.role },
        });
    } catch (err) {
        res.status(500).json({ message: "Server error during registration.", error: err.message });
    }
};

// POST /api/auth/login
const login = async (req, res) => {
    try {
        const { email: rawEmail, password } = req.body;
        const email = rawEmail?.toLowerCase().trim();
        if (!email || !password)
            return res.status(400).json({ message: "Email and password are required." });

        const user = await User.findOne({ email });
        if (!user)
            return res.status(401).json({ message: "Invalid credentials." });

        const isMatch = await bcrypt.compare(password, user.passwordHash);
        if (!isMatch)
            return res.status(401).json({ message: "Invalid credentials." });

        const token = signToken(user);
        res.json({
            message: "Login successful.",
            token,
            user: { id: user._id, name: user.name, email: user.email, role: user.role },
        });
    } catch (err) {
        res.status(500).json({ message: "Server error during login.", error: err.message });
    }
};

// POST /api/auth/seed-admin — idempotent: create the one seller if not present
const seedAdmin = async (req, res) => {
    try {
        const existing = await User.findOne({ role: "seller" });
        if (existing)
            return res.status(200).json({ message: "Seller already exists.", email: existing.email });

        const passwordHash = await bcrypt.hash(process.env.ADMIN_PASSWORD, 12);
        const admin = await User.create({
            name: process.env.ADMIN_NAME || "Store Admin",
            email: process.env.ADMIN_EMAIL,
            passwordHash,
            role: "seller",
        });

        res.status(201).json({
            message: "Seller account created successfully.",
            email: admin.email,
        });
    } catch (err) {
        res.status(500).json({ message: "Server error while seeding admin.", error: err.message });
    }
};

module.exports = { register, login, seedAdmin };
