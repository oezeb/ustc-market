const multer = require("multer");
const sharp = require("sharp");

const storage = multer.memoryStorage();
const upload = multer({
    storage: storage,
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

// Given image Buffer resize image to target size (default 1 MB)
const resize = async (buffer, targetSize = 1024 * 1024 * 1) => {
    let quality = 90;
    while (buffer.length > targetSize && quality > 0) {
        buffer = await sharp(buffer).jpeg({ quality: quality }).toBuffer();

        quality -= 10;
    }

    if (quality === 0) {
        throw new Error("File too large");
    }

    return buffer;
};

// middleware to resize image to 1 MB
const resizeImage = (req, res, next) => {
    if (!req.file && !req.files) return next();

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

module.exports = { upload, resizeImage };
