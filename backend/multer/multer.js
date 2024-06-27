const multer = require('multer');
const path = require('path')
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, `public/uploads/`);
    },
    filename: (req, file, cb) => {

        cb(null, `${file.originalname}`);
    },
});

const fileFilter = (req, file, cb) => {
   
    const allowedExtensions = ['.jpg', '.jpeg', '.png']; // Add your allowed extensions

    const fileExtension = path.extname(file.originalname).toLowerCase();

    if (allowedExtensions.includes(fileExtension)) {
        
        cb(null,true); // Accept the file
    } else {
        
        cb(null,false); // Reject the file
    }
};



const upload = multer({ storage, fileFilter });


module.exports= upload