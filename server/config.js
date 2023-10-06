const fs = require('fs');
require('dotenv').config({ path: './.env' });

const uploadsDir = './uploads';
const avatarsDir = './uploads/avatars';
const itemImagesDir = './uploads/item-images';
for (const dir of [uploadsDir, avatarsDir, itemImagesDir]) {
    if (!fs.existsSync(dir)) fs.mkdirSync(dir);
}

module.exports = {
    // Environment variables
    MONGODB_URI: process.env.MONGODB_URI,
    PORT: process.env.PORT,
    JWT_SECRET: process.env.JWT_SECRET,
    ENCRYPTION_KEY: process.env.ENCRYPTION_KEY,
    ENCRYPTION_IV: process.env.ENCRYPTION_IV,
    ENCRYPTION_ALGORITHM: process.env.ENCRYPTION_ALGORITHM,

    // Directories
    uploadsDir, avatarsDir, itemImagesDir,
}