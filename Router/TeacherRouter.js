const express = require('express');
const router= express.Router();
const TeacherController = require('../Controller/TeacherController.js');
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
})
router.post('/add', upload.fields([ { name: 'img', maxCount: 1 }]),TeacherController.addTeacherAndcourses);
router.get('/', TeacherController.getTeacher);
router.get('/:id', TeacherController.getTeacherById);
router.put('/update/:id',upload.fields([ { name: 'img', maxCount: 1 }]), TeacherController.updateTeacher);
router.delete('/delete/:id', TeacherController.deleteTeacher);
router.get('/student-counts/:id',TeacherController.getStudentCountForTeacher);


module.exports=router