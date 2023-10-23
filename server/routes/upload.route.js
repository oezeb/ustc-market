const router = require("express").Router();
const uuid = require("uuid");
const sharp = require("sharp");

const config = require("../config");
const upload = require("../middlewares/upload.middleware");
const auth = require("../middlewares/auth.middleware");

const { uploadImage, resizeImage } = upload;
router.use(auth);

// POST /api/upload/images
// Uploads images to the server
router
    .route("/images")
    .post(uploadImage.array("image"), resizeImage, async (req, res) => {
        if (!req.files)
            return res.status(400).json({ error: "No files uploaded" });

        const saveFile = async (file) => {
            const filename = `${config.uploadsDir}/${uuid.v4()}.jpg`;
            await sharp(file.buffer).toFile(filename);
            return filename;
        };

        const files = req.files.map((file) => saveFile(file));
        Promise.all(files)
            .then((filenames) => res.status(201).json(filenames))
            .catch((err) => res.status(400).json({ error: err.message }));
    });

module.exports = router;
