const fs = require("fs");
require("dotenv").config({ path: "./.env" });

const uploadsDir = "uploads";
if (!fs.existsSync(uploadsDir)) fs.mkdirSync(uploadsDir);

module.exports = {
    // SERVER
    DOMAIN: process.env.DOMAIN, // used for email verification and reset password
    PORT: process.env.PORT,

    // DATABASE
    MONGODB_URI: process.env.MONGODB_URI,
    MONDODB_TEST_URI: process.env.MONDODB_TEST_URI,

    // JWT TOKEN for authentication
    JWT_SECRET: process.env.JWT_SECRET,
    JWT_LIFETIME: Number(process.env.JWT_LIFETIME), // seconds

    // TEXT ENCRYPTION
    ENCRYPTION_KEY: process.env.ENCRYPTION_KEY,
    ENCRYPTION_IV: process.env.ENCRYPTION_IV,
    ENCRYPTION_ALGORITHM: process.env.ENCRYPTION_ALGORITHM,

    // EMAIL
    EMAIL_HOST: process.env.EMAIL_HOST,
    EMAIL_PORT: Number(process.env.EMAIL_PORT),
    EMAIL_SECURE: process.env.EMAIL_SECURE === "true",
    EMAIL_USER: process.env.EMAIL_USER,
    EMAIL_PASSWORD: process.env.EMAIL_PASSWORD,

    // FOLDER
    uploadsDir,
};
