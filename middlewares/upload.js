const multer = require('multer')
const path = require('path')

const tempUrl = path.join(__dirname, '../', 'tmp')

const multerConfig = multer.diskStorage({
    destination: tempUrl,
    filename: (req, file, cb) => {
        cb(null, file.originalname)

    }
});

const upload = multer({
    storage: multerConfig
})

module.exports = upload;