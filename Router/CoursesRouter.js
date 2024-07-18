const express = require('express');
const router= express.Router()
const CoursesController = require('../Controller/CoursesController.js')
const multer = require("multer");
const path = require("path");
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'images')
    },
    filename: (req, file, cb) => {
        cb(null, file.fieldname + "_" + Date.now() + path.extname(file.originalname))
    }
})
const upload = multer({
    storage: storage
});
router.post('/video',upload.fields([ { name: 'url', maxCount: 1 }]), CoursesController.addVideo);
router.post('/addcourse',upload.fields([ { name: 'videos', maxCount: 1 }]),CoursesController.addCourse);

module.exports =router
