const multer = require('multer');
const path = require('path');
const File = require('../model/file')

const fileLength = async (loginId) => {
    const files = await File.find({ loginId })
    return files.length
}

const storage = multer.diskStorage({

    destination: function (req, file, cb) {
        cb(null, 'uploads/');
    },

    filename: async function (req, file, cb) {
        const teach = req.user

        const number = await fileLength(teach.loginId)
        const uniqueSuffix = teach.loginId + '-' + number.toString();
        const extension = path.extname(file.originalname);
        const fileName = uniqueSuffix + extension;

        cb(null, fileName);
    }
});

const fileFilter = function (req, file, cb) {
    if (!file.originalname.match(/\.(doc|docx|pdf|xlsx|xls|pptx|ppt)$/)) {
        return cb(new Error('Faqat .doc, .docx, .pdf, .xlsx, .xls, .pptx yoki .ppt formatdagi fayllarni yuklashingiz mumkin'));
    }
    cb(null, true);
};

const upload = multer({ 
    storage, 
    fileFilter 
});

module.exports = { upload };
