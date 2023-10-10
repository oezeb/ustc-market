const sharp = require("sharp");

/**
 * Resizes an image to a smaller size
 * @param {String} dataURL - The image dataURL
 * @param {Number} targetSize - The target size in bytes (default: 1MB)
 * @returns {String} The resized image dataURL
 */
const resizeImage = async (dataURL, targetSize = 1024 * 1024 * 1) => {
    const buffer = Buffer.from(dataURL.split(",")[1], "base64");
    let quality = 90;
    while (buffer.length > targetSize && quality > 0) {
        buffer = await sharp(buffer).jpeg({ quality: quality }).toBuffer();
        quality -= 10;
    }

    if (quality === 0) throw new Error("File too large");
    return `data:image/jpeg;base64,${buffer.toString("base64")}`;
};

module.exports = { resizeImage };
