const sharp = require("sharp");

/**
 * Middleware that resizes images(HTTP DataURLs) to a smaller size
 */
const resizeImages = (req, res, next) => {
    if (!req.body.images) return next();

    const resize = async (buffer) => {
        const targetSize = 1024 * 1024 * 1; // 1 MB
        let quality = 90;
        while (buffer.length > targetSize && quality > 0) {
            buffer = await sharp(buffer).jpeg({ quality: quality }).toBuffer();
            quality -= 10;
        }

        if (quality === 0) throw new Error("File too large");
        return buffer;
    };

    const promises = req.body.images.map((image) => {
        const base64 = image.split(",")[1];
        const buffer = Buffer.from(base64, "base64");
        return resize(buffer);
    });

    Promise.all(promises)
        .then((results) => {
            req.body.images = results.map((buffer) => {
                return `data:image/jpeg;base64,${buffer.toString("base64")}`;
            });

            next();
        })
        .catch((err) => res.status(400).json({ error: err.message }));
};

module.exports = { resizeImages };
