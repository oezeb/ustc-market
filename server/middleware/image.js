const multer = require("multer");
const sharp = require("sharp");

/**
 * Multer instance to create middlewares that process images
 * uploaded via multipart/form-data
 *
 * - `upload.single('key')` creates a single file middleware
 * that populates `req.file`
 * - `upload.array('key')` creates a multiple files middleware
 * that populates `req.files`
 */
const uploadImage = multer({
    storage: multer.memoryStorage(),
    limits: {
        fileSize: 1024 * 1024 * 10, // 10 MB
    },
    fileFilter: function (req, file, cb) {
        if (file.mimetype.startsWith("image/")) {
            cb(null, true);
        } else {
            cb(new Error("Only image files are allowed!"), false);
        }
    },
});

/**
 * Middleware that resizes the image to a smaller size
 */
const resizeImage = (req, res, next) => {
    if (!req.file && !req.files) return next();

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

    const files = req.files ? req.files : [req.file];
    const promises = files.map((file) => resize(file.buffer));
    Promise.all(promises)
        .then((results) => {
            if (req.files) {
                req.files = results.map((buffer, index) => {
                    return {
                        ...files[index],
                        buffer: buffer,
                    };
                });
            } else {
                req.file.buffer = results[0];
            }

            next();
        })
        .catch((err) => res.status(400).json({ error: err.message }));
};

module.exports = { uploadImage, resizeImage };
