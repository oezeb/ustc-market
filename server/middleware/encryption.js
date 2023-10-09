const crypto = require("crypto");
const config = require("../config");

const algo = config.ENCRYPTION_ALGORITHM;
const keyHash = crypto
    .createHash("sha256")
    .update(String(config.ENCRYPTION_KEY))
    .digest("hex")
    .substr(0, 32);
const ivHash = crypto
    .createHash("sha256")
    .update(String(config.ENCRYPTION_IV))
    .digest("hex")
    .substr(0, 16);

const encrypt = (text) => {
    const cipher = crypto.createCipheriv(algo, keyHash, ivHash);
    let encrypted = cipher.update(text, "utf8", "hex");
    encrypted += cipher.final("hex");
    return Buffer.from(encrypted).toString("base64");
};

const decrypt = (text) => {
    const decipher = crypto.createDecipheriv(algo, keyHash, ivHash);
    text = Buffer.from(text, "base64").toString("utf8");
    let decrypted = decipher.update(text, "hex", "utf8");
    decrypted += decipher.final("utf8");
    return decrypted;
};

module.exports = { encrypt, decrypt };
