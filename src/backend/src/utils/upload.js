const multer = require('multer');
const path = require("path");
const fs = require("fs");

const storage = multer.diskStorage({
    destination: function (req, file, cb) {

        const { employee_no, docType } = req.body;

        // Create path: uploads/employee_no/docType/
        const folderPath = path.join('uploads', employee_no, docType);

        // Create folders if they don't exist (handles both conditions)
        fs.mkdirSync(folderPath, { recursive: true });

        // Check if files exist in this folder
        const filesInFolder = fs.readdirSync(folderPath);

        if (filesInFolder.length > 0) {
            // Delete old files before uploading new one
            filesInFolder.forEach(file => {
                const filePath = path.join(folderPath, file);
                fs.unlinkSync(filePath);
            });
        }

        cb(null, folderPath);
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + '-' + file.originalname);
    }
});;
const upload = multer({ storage: storage });

module.exports = upload;