

const multer = require('multer');
const path = require('path');
const uploadMiddleware = (req, res, next) => {
    const storage = multer.diskStorage({
        destination: (req, file, cb) => {
            cb(null, path.join(__dirname, '..', 'public', 'img'));
        },
        filename: (req, file, cb) => {
            cb(null, file.originalname);
        }
    });
    
    const upload = multer({
        storage: storage,
        limits: {
            fileSize: 5 * 1024 * 1024 // 5 Mb
        },
        fileFilter: (req, file, cb) => {
            const filetypes = /jpeg|jpg|png|gif/;
            const mimetype = filetypes.test(file.mimetype);
            if (mimetype) {
                return cb(null, true);
            } else {
                cb(new Error('Seuls les fichiers images sont autorises (jpeg, jpg, png, gif)'));
            }
        }
    });
    return upload;
}
module.exports =uploadMiddleware;