const jwt = require("jsonwebtoken");

const config = require("../config");

/**
 * Middleware to verify that a user is logged in
 *
 * Set req.user._id if successful otherwise return 401
 */
module.exports = (req, res, next) => {
    const token = req.cookies.token;
    if (!token) return res.status(401).json({ error: "No token provided" });

    jwt.verify(token, config.JWT_SECRET, (err, decoded) => {
        if (err) return res.status(401).json({ error: "Invalid token" });

        req.user = { _id: decoded._id };
        next();
    });
};
