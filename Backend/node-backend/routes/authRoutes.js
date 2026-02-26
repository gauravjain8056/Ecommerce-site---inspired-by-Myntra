const express = require("express");
const router = express.Router();
const { register, login, seedAdmin } = require("../controllers/authController");

// POST /api/auth/register — creates customer
router.post("/register", register);

// POST /api/auth/login
router.post("/login", login);

// POST /api/auth/seed-admin — call once to create the seller account
router.post("/seed-admin", seedAdmin);

module.exports = router;
