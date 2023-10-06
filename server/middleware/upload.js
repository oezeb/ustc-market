const multer = require('multer');

const storage = multer.memoryStorage();
const uploadImage = multer({
    storage: storage, 
    limits: { 
        fileSize: 1024 * 1024 * 10 // 10 MB
    },
    fileFilter: function (req, file, cb) {
        if (file.mimetype.startsWith('image/')) {
            cb(null, true);
        } else {
            cb(new Error('Only image files are allowed!'), false);
        }
    }
 });

module.exports = { uploadImage };
