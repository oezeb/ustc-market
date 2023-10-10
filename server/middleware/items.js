const { resizeImage } = require("../image");

/**
 * Middleware that resizes images(HTTP DataURLs) to a smaller size
 */
const resizeImages = (req, res, next) => {
    if (!req.body.images) return next();

    Promise.all(req.body.images.map((image) => resizeImage(image)))
        .then((results) => {
            req.body.images = results;
            next();
        })
        .catch((err) => res.status(400).json({ error: err.message }));
};

module.exports = { resizeImages };
