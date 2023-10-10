const { resizeImage } = require("../image");

/**
 * Middleware that resizes user's avatar to a smaller size
 */
const resizeAvatar = (req, res, next) => {
    if (!req.body.avatar) return next();

    resizeImage(req.body.avatar)
        .then((result) => {
            req.body.avatar = result;
            next();
        })
        .catch((err) => res.status(400).json({ error: err.message }));
};

module.exports = { resizeAvatar };
