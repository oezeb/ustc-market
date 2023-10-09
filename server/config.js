const fs = require("fs");
require("dotenv").config({ path: "./.env" });

const uploadsDir = "uploads";
const recycleBinDir = "recycle-bin";
const avatarsDir = "uploads/avatars";
const itemImagesDir = "uploads/item-images";
for (const dir of [uploadsDir, avatarsDir, itemImagesDir, recycleBinDir]) {
    if (!fs.existsSync(dir)) fs.mkdirSync(dir);
}

module.exports = {
    // Environment variables
    MONGODB_URI: process.env.MONGODB_URI,
    MONDODB_TEST_URI: process.env.MONDODB_TEST_URI,
    PORT: process.env.PORT,
    JWT_SECRET: process.env.JWT_SECRET,
    ENCRYPTION_KEY: process.env.ENCRYPTION_KEY,
    ENCRYPTION_IV: process.env.ENCRYPTION_IV,
    ENCRYPTION_ALGORITHM: process.env.ENCRYPTION_ALGORITHM,

    // Directories
    uploadsDir,
    recycleBinDir,
    avatarsDir,
    itemImagesDir,
};
