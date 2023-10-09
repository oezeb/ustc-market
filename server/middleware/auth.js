const jwt = require("jsonwebtoken");
const config = require("../config");

module.exports = (req, res, next) => {
    const token = req.cookies.token;
    if (!token) {
        return res
            .status(401)
            .json({ error: "Unauthorized: No token provided" });
    }

    jwt.verify(token, config.JWT_SECRET, (err, decoded) => {
        if (err) {
            return res
                .status(401)
                .json({ error: "Unauthorized: Invalid token" });
        }

        req.userId = decoded._id;
        next();
    });
};
