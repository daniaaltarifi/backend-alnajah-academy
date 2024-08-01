const express = require('express');
const router = express.Router();
const CoursesController = require('../Controller/CoursesController');
const multer = require('multer');
const path = require('path');

// Multer configuration
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, 'images/'); // Destination folder for uploaded files
    },
    filename: function (req, file, cb) {
      cb(null, file.originalname); // Retain original filename and extension
    }
  });
  
const upload = multer({ storage: storage });
router.post('/add', upload.fields([{ name: 'img', maxCount: 1 },{ name: 'defaultvideo', maxCount: 1 },{ name: 'url', maxCount: 10 }]), CoursesController.addCourse);
router.get('/', CoursesController.getcourses);
router.get('/getbyvideo/:id', CoursesController.getVideoById);
router.get('/teacher/:teacherId/count',CoursesController.getNumberOfCoursesByTeacher);

router.get('/:id', CoursesController.getCourseById);
router.get('/users-counts/:id', CoursesController.getUserCountForCourse);

router.get('/course-counts/:id', CoursesController.getCourseCountByTeacher);
router.get('/lesson-counts/:id', CoursesController.getLessonCountForCourses);


module.exports = router;
