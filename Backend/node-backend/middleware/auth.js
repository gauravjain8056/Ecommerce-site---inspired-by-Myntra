const jwt = require("jsonwebtoken");

/**
 * verifyToken — validates "Authorization: Bearer <token>"
 * Attaches the decoded payload to req.user
 */
const verifyToken = (req, res, next) => {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
        return res.status(401).json({ message: "No token provided. Please login." });
    }

    const token = authHeader.split(" ")[1];
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded; // { id, name, email, role }
        next();
    } catch (err) {
        return res.status(401).json({ message: "Token is invalid or expired." });
    }
};

/**
 * requireRole(...roles) — factory that returns a middleware
 * Rejects with 403 if req.user.role is not in the allowed list
 * Must be used AFTER verifyToken
 */
const requireRole = (...roles) => {
    return (req, res, next) => {
        if (!req.user || !roles.includes(req.user.role)) {
            return res
                .status(403)
                .json({ message: `Access denied. Required role: ${roles.join(" or ")}` });
        }
        next();
    };
};

module.exports = { verifyToken, requireRole };
