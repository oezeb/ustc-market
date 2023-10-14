const fs = require("fs");
require("dotenv").config({ path: "./.env" });

const uploadsDir = "uploads";
if (!fs.existsSync(uploadsDir)) fs.mkdirSync(uploadsDir);

module.exports = {
    MONGODB_URI: process.env.MONGODB_URI,
    MONDODB_TEST_URI: process.env.MONDODB_TEST_URI,
    PORT: process.env.PORT,
    JWT_SECRET: process.env.JWT_SECRET,
    JWT_LIFETIME: Number(process.env.JWT_LIFETIME), // seconds
    ENCRYPTION_KEY: process.env.ENCRYPTION_KEY,
    ENCRYPTION_IV: process.env.ENCRYPTION_IV,
    ENCRYPTION_ALGORITHM: process.env.ENCRYPTION_ALGORITHM,

    uploadsDir,
};
