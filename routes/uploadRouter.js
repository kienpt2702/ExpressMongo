const express = require("express");
const bodyParser = require('body-parser');
const multer = require('multer');
const {verifyUser, verifyAdmin} = require("../authenticate");

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'public/images');
    },

    filename: (req, file, cb) => {
        cb(null, file.originalname);
    },
});

const imageFileFilter = (req, file, cb) => {
    if(!file.originalname.match(/\.(jpg|jpeg|png|gif)$/)) {
        return cb(new Error('Only image files'));
    }
    cb(null, true);
}

const upload = multer({
   storage,
   fileFilter: imageFileFilter,
});

const uploadRouter = express.Router();

uploadRouter.use(bodyParser.json());

uploadRouter.post('/', verifyUser, verifyAdmin, upload.single('imageFile'), (req, res) => {
    res.status(200).json(req.file);
});

module.exports = uploadRouter;
