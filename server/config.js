require("dotenv").config({ path: "./.env" });

module.exports = {
    MONGODB_URI: process.env.MONGODB_URI,
    MONDODB_TEST_URI: process.env.MONDODB_TEST_URI,
    PORT: process.env.PORT,
    JWT_SECRET: process.env.JWT_SECRET,
    ENCRYPTION_KEY: process.env.ENCRYPTION_KEY,
    ENCRYPTION_IV: process.env.ENCRYPTION_IV,
    ENCRYPTION_ALGORITHM: process.env.ENCRYPTION_ALGORITHM,
};
