const asyncHandler = require("../Middleware/asyncHandler.js");
const fs = require('fs');
const db = require("../config.js");

const addCourse = asyncHandler(async (req, res) => {
  const {
    subject_name,
    department_id,
    before_offer,
    after_offer,
    coupon,
    descr,
    std_num,
    rating,
    teacher_id,
  } = req.body;

  const img = req.files["img"][0].filename;
  const defaultvideo = req.files["defaultvideo"][0].filename;

  if (!subject_name) {
    return res.status(400).send({
      error: "Failed to add course",
      message: "Subject name cannot be null or empty",
    });
  }

  const courseSql =
    "INSERT INTO Courses (subject_name, department_id, before_offer, after_offer, coupon, descr, std_num, rating, teacher_id, img, defaultvideo) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";

  db.query(
    courseSql,
    [
      subject_name,
      department_id,
      before_offer,
      after_offer,
      coupon,
      descr,
      std_num,
      rating,
      teacher_id,
      img,
      defaultvideo,
    ],
    (err, result) => {
      if (err) {
        console.error("Failed to add course:", err);
        return res.status(500).send({
          error: "Failed to add course",
          message: err.message,
        });
      }

      const courseId = result.insertId;

      // Handle videos
      const titles = req.body["title"] || [];
      const videos = req.files["url"] || [];

      if (videos.length > 0) {
        // Ensure at least one title if there are videos
        const videoValues = videos.map((video, index) => [
          courseId,
          titles[index] || "Untitled", // Provide default title if missing
          video.filename,
        ]);

        const videoSql = "INSERT INTO videos (course_id, title, url) VALUES ?";
        db.query(videoSql, [videoValues], (err, result) => {
          if (err) {
            console.error("Failed to add videos:", err);
            return res.status(500).send({
              error: "Failed to add videos",
              message: err.message,
            });
          }

          res.send({
            message: "Course and videos added successfully",
          });
        });
      } else {
        // If no videos are provided, still add the course
        res.send({
          message: "Course added successfully, but no videos provided",
        });
      }
      
    }
  );
});

const getcourses = asyncHandler(async (req, res) => {
  // SQL query to select all columns from courses, department title as department_name, and all columns from teacher
  const sqlSelect = `
       SELECT courses.*, 
              department.title AS department_name, 
              teacher.teacher_name AS teacher_name,
               teacher.descr AS teacher_descr,
               teacher.img AS teacher_img,
               DATE_FORMAT(courses.created_at, '%Y-%m-%d') AS created_date 
       FROM courses
       JOIN department ON courses.department_id = department.id
       JOIN teacher ON courses.teacher_id = teacher.id
    `;

  db.query(sqlSelect, (err, result) => {
    if (err) {
      return res.status(500).json({ message: err.message });
    }

    res.status(200).json(result);
  });
});






const getCourseById=asyncHandler(async(req,res)=>{
  const { id } = req.params;
  const sqlSelect = `
  SELECT courses.*,  
         department.title AS department_name,
         teacher.teacher_name AS teacher_name,
         teacher.descr AS teacher_descr,
         teacher.img AS teacher_img
  FROM courses
  LEFT JOIN department ON courses.department_id = department.id
  LEFT JOIN teacher ON courses.teacher_id = teacher.id
  WHERE courses.id = ?`;
  
  db.query(sqlSelect,[id],(err,result)=>{
      if(err){
          console.error('Error fetching course data: '+err.message);
          return res.status(500).json({message:"Error fetching course data"});
      }
      res.status(200).json(result);
  });
})

const getcoursesCount = asyncHandler(async (req, res) => {
  const sqlSelect = `
  SELECT 
    courses.*, 
    department.title AS department_name, 
    teacher.teacher_name AS teacher_name,
    teacher.descr AS teacher_descr,
    teacher.img AS teacher_img,
    DATE_FORMAT(courses.created_at, '%Y-%m-%d') AS created_date,
    (SELECT COUNT(*) FROM courses c WHERE c.teacher_id = teacher.id) AS course_count
  FROM 
    courses
  JOIN 
    department ON courses.department_id = department.id
  JOIN 
    teacher ON courses.teacher_id = teacher.id
`;

db.query(sqlSelect, (err, result) => {
  if (err) {
    return res.status(500).json({ message: err.message });
  }

  res.status(200).json(result);
});
});



const getCourseCountByTeacher = asyncHandler(async (req, res) => {
  const { id } = req.params; // Get the teacher id from the request parameters
  const sqlSelect = `
    SELECT 
      COUNT(courses.id) AS course_count
    FROM 
      teacher
    LEFT JOIN 
      courses ON teacher.id = courses.teacher_id
    WHERE 
      teacher.id = ?
    GROUP BY 
      teacher.id, teacher.teacher_name
  `;


  db.query(sqlSelect, [id], (err, result) => {
    if (err) {
      console.error('Failed to fetch teacher course counts:', err);
      return res.status(500).send({
        error: 'Failed to fetch teacher course counts',
        message: err.message,
      });
    }

    console.log('Query result:', result); // Log the result

    res.status(200).json(result);
  });
});






  const getUserCountForCourse = asyncHandler(async (req, res) => {
    const { id} = req.params; 

    if (!id) {
      return res.status(400).send({
        error: 'Course ID is required',
      });
    }
  
    console.log('Received course_id:',id); // Log the received course_id
  
  
    const sqlSelect = `
      SELECT c.id, COUNT(cu.user_id) AS student_count
      FROM course_users cu
      JOIN courses c ON cu.course_id = c.id
      WHERE c.id = ?
      GROUP BY c.id;
    `;
  
  
  db.query(sqlSelect, [id], (err, result) => {
    if (err) {
      console.error('Failed to fetch user count for course:', err);
      return res.status(500).send({
        error: 'Failed to fetch user count for course',
        message: err.message,
      });
    }

    console.log('Query result:', result); // Log the result

    res.status(200).json(result[0]); // Return the first result object
  });
});

const getVideoDuration = (videoUrl) => {
  return new Promise((resolve, reject) => {
    ffmpeg.ffprobe(videoUrl, (err, metadata) => {
      if (err) {
        return reject(err);
      }
      const duration = metadata.format.duration;
      resolve(duration);
    });
  });
};
const getVideoById = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const sqlSelect = `
    SELECT videos.*, 
           courses.subject_name AS subject_name,
           department.title AS department_name,
           courses.before_offer AS before_offer,
           courses.after_offer AS after_offer,
           courses.coupon AS coupon,
           courses.descr AS description_course,
           courses.std_num AS student_num,
           courses.rating AS rating,
           courses.img AS img,
           teacher.teacher_name AS teacher_name,
           courses.defaultvideo AS defaultvideo
    FROM videos
    JOIN courses ON videos.course_id = courses.id
    JOIN department ON courses.department_id = department.id
    JOIN teacher ON courses.teacher_id = teacher.id
    WHERE videos.course_id = ?`;

    // Assuming you are using a database client library like mysql2 or similar
    db.query(sqlSelect, [id], (err, result) => {
        if (err) {
            console.error("Error fetching data:", err);
            return res.status(500).json({ message: "Failed to fetch video data", error: err.message });
        }

        res.status(200).json(result);
    });
});



const getLessonCountForCourses = asyncHandler(async (req, res) => {
  const { id} = req.params; 

  if (!id) {
    return res.status(400).send({
      error: 'Course ID is required',
    });
  }

  console.log('Received course_id:',id); // Log the received course_id

  const sqlSelect = `
    SELECT course_id, COUNT(title) AS lesson_count
    FROM videos
     WHERE 
      course_id = ?
    GROUP BY course_id;
  `;

  db.query(sqlSelect, [id], (err, result) => {
    if (err) {
      console.error('Failed to fetch lesson count for courses:', err);
      return res.status(500).send({
        error: 'Failed to fetch lesson count for courses',
        message: err.message,
      });
    }

    console.log('Query result:', result); // Log the result

    if (result.length === 0) {
      console.warn('No lessons found');
      return res.status(404).send({
        message: 'No lessons found',
      });
    }

    res.status(200).json(result); // Return the result

const getCourseById=asyncHandler(async(req,res)=>{
    const { id } = req.params;
    const sqlSelect = `
    SELECT courses.*,  
           department.title AS department_name,
           teacher.teacher_name AS teacher_name,
           teacher.descr AS teacher_descr,
           teacher.img AS teacher_img
    FROM courses
    LEFT JOIN department ON courses.department_id = department.id
    LEFT JOIN teacher ON courses.teacher_id = teacher.id
    WHERE courses.id = ?`;
    
    db.query(sqlSelect,[id],(err,result)=>{
        if(err){
            console.error('Error fetching course data: '+err.message);
            return res.status(500).json({message:"Error fetching course data"});
        }
        res.status(200).json(result);
    });
})
const getNumberOfCoursesByTeacher = asyncHandler(async (req, res) => {
  const { teacherId } = req.params;

  const sqlSelect = `
    SELECT COUNT(*) AS course_count
    FROM courses
    WHERE teacher_id = ?`;

  db.query(sqlSelect, [teacherId], (err, result) => {
    if (err) {
      console.error('Error fetching number of courses: ' + err.message);
      return res.status(500).json({ message: "Error fetching number of courses" });
    }

    // Assuming the result contains a single row with the count
    const courseCount = result[0].course_count;
    res.status(200).json({ courseCount });
  });
});



module.exports = { addCourse, getcourses ,getVideoById,getCourseById ,getCourseCountByTeacher ,getcoursesCount ,getUserCountForCourse ,getLessonCountForCourses};
