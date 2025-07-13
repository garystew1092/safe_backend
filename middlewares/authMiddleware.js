const jwt = require("jsonwebtoken");
const User = require("../models/user");

const protect = async(req, res, next) => {
    try {
        let token;
        if (
            req.headers.authorization &&
            req.headers.authorization.startsWith("Bearer")
        ) {
            token = req.headers.authorization.split(" ")[1];

            // Verify the token first
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            console.log(decoded)
                // Find user by ID from the verified token
            req.user = await User.findById(decoded.id).select("-password");

            if (!req.user) {
                return res.status(401).json({ message: "User not found" });
            }
            next();
        } else {
            return res.status(401).json({ message: "No token provided" });
        }
    } catch (error) {
        console.error("Auth middleware error:", error);
        if (error.name === 'TokenExpiredError') {
            return res.status(401).json({ message: "Token expired" });
        }
        return res.status(401).json({ message: "Not authorized" });
    }
};

// Middleware for Admin-only access remains the same
const adminOnly = (req, res, next) => {
    if (req.user && req.user.role === "admin") {
        next();
    } else {
        res.status(403).json({ message: "Access denied, admin only" });
    }
};

module.exports = { protect, adminOnly };