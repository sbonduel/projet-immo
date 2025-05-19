const multer = require('multer');
const path = require('path');
const fs = require('fs');


const imagesDir = path.join(__dirname, '../../frontend-app/public/images');
if (!fs.existsSync(imagesDir)) {
  fs.mkdirSync(imagesDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, imagesDir);
  },
  filename: (req, file, cb) => {
    const uniqueName = `apt_${Date.now()}_${Math.floor(Math.random() * 10000)}${path.extname(file.originalname)}`;
    cb(null, uniqueName);
  }
});

const upload = multer({ storage });

module.exports = upload;
