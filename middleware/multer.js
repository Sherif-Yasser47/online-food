const multer = require('multer');

const uploadMW = multer({
    limits: {
        fileSize: 5000000
    },
    fileFilter(req, file, cb) {
        if (!file.originalname.match(/\.(jpg|jpeg|png)$/i)) {
            cb(new Error('Invalid file type'))
        }
        cb(undefined, true)
    }
});

module.exports = uploadMW;