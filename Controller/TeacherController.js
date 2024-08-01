// const asyncHandler = require("../Middleware/asyncHandler.js");
const db = require("../config.js");
const asyncHandler = require("../Middleware/asyncHandler.js");


const addTeacherAndcourses = async (req, res) => {
    const { teacher_name, descr, subject_name,department_id } = req.body; // Corrected variable name
  const img=req.files["img"][0].filename; 
    // Insert the teacher's data into the teacher table
    const sqlInsertTeacher = "INSERT INTO teacher (teacher_name, descr, img, department_id) VALUES (?, ?, ?, ?)";
    db.query(sqlInsertTeacher, [teacher_name, descr, img, department_id], (err, teacherResult) => {
      if (err) {
        console.error('Error inserting teacher data: ' + err.message);
        return res.status(500).json({ message: "Error adding teacher" });
      }
  
      const teacherId = teacherResult.insertId; // Get the ID of the newly inserted teacher record
  
      // Insert the courses for the newly inserted teacher into the courses table
      const sqlInsertcourses = "INSERT INTO courses (teacher_id, subject_name) VALUES (?, ?)";
      db.query(sqlInsertcourses, [teacherId, subject_name], (err, coursesResult) => {
        if (err) {
          console.error('Error inserting courses data: ' + err.message);
          return res.status(500).json({ message: "Error adding courses" });
        }
        
        // Both inserts were successful
        return res.status(201).json({ 
          message: "Teacher and courses added successfully",
          teacher_id: teacherId,
          courses_id: coursesResult.insertId
        });
      });
    });
  };
  const getTeacherById=asyncHandler(async(req,res)=>{
    const {id}=req.params;
    const sql="SELECT * FROM teacher WHERE id = ?";
    db.query(sql,[id],(err,result)=>{
      if(err){
        console.error('Error fetching teacher data: '+err.message);
        return res.status(500).json({message:"Error fetching teacher data"});
      }
      if(result.length===0){
        return res.status(404).json({message:"Teacher not found"});
      }
      return res.json(result[0]);
    })
  })

  const getTeacher = asyncHandler(async (req, res) => {
    const sql = `
      SELECT t.id, t.teacher_name, t.descr, t.img, t.department_id, d.title AS department_name
      FROM teacher t
      LEFT JOIN department d ON t.department_id =d.id
    `;
  
    db.query(sql, (err, results) => {
      if (err) {
        console.error('Error fetching teacher data: ' + err.message);
        return res.status(500).json({ message: "Error fetching teacher data" });
      }
      
      return res.json(results);
    });
  });

  //update ****************
  const updateTeacher = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const { teacher_name, descr, department_id } = req.body;

    let img;

    // Check if the 'img' file exists in the request
    if (req.files && req.files.img && req.files.img[0]) {
        img = req.files.img[0].filename; 
    }

    // Fetch the current values of img
    const checkSql = 'SELECT img FROM teacher WHERE id = ?';
    db.query(checkSql, [id], (checkErr, checkResult) => {
        if (checkErr) {
            console.log(checkErr);
            return res.json({ error: 'Error checking data' });
        }
        if (checkResult.length === 0) {
            return res.json({ error: 'No data found for the specified ID' });
        }

        const currentimg = checkResult[0].img;

        // Determine which image to update
        const updatedimg = img ? img : currentimg; // Use the new image if uploaded, otherwise retain the current one

        // Update only the text fields and respective image
        const sqlUpdateText = 'UPDATE teacher SET teacher_name = ?, descr = ?, department_id = ?, img = ? WHERE id = ?';
        db.query(sqlUpdateText, [teacher_name, descr, department_id, updatedimg, id], (updateErr, updateResult) => {
            if (updateErr) {
                console.log(updateErr);
                return res.json({ error: 'Error updating data' });
            }
            console.log(updateResult);
            // Now, img is defined and can be safely used here
            res.json({ id, teacher_name, descr, department_id, img: updatedimg });
        });
    });
});

// delete****************************
const deleteTeacher = asyncHandler(async (req, res) => {
    const { id } = req.params;

    // Delete related records in the courses table
    const deletecoursessSql = 'DELETE FROM courses WHERE teacher_id = ?';
    db.query(deletecoursessSql, [id], (deleteErr, deleteResult) => {
        if (deleteErr) {
            console.error('Error deleting related coursess: ' + deleteErr.message);
            return res.status(500).json({ message: "Error deleting related coursess" });
        }

        // After deleting related coursess, delete the teacher record
        const deleteTeacherSql = 'DELETE FROM teacher WHERE id = ?';
        db.query(deleteTeacherSql, [id], (err, result) => {
            if (err) {
                console.error('Error deleting teacher data: ' + err.message);
                return res.status(500).json({ message: "Error deleting teacher data" });
            }

            if (result.affectedRows === 0) {
                return res.status(404).json({ message: "Teacher not found" });
            }

            return res.json({ message: "Teacher deleted successfully" });
        });
    });
});





const getStudentCountForTeacher = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const sqlSelect = `
     SELECT t.id,  COUNT(ts.student_id) AS student_count
    FROM teacher t
    JOIN teacher_students ts ON t.id = ts.teacher_id
    WHERE t.id = ?
    GROUP BY t.id;
  `;

  db.query(sqlSelect, [id], (err, result) => {
    if (err) {
      console.error('Failed to fetch student count for teacher:', err);
      return res.status(500).send({
        error: 'Failed to fetch student count for teacher',
        message: err.message,
      });
    }

    console.log('Query result:', result); // Log the result

    if (result.length === 0) {
      return res.status(404).send({
        message: 'No students found for this teacher',
      });
    }

    res.status(200).json(result[0]); // Return the first result object
  });
});
module.exports = {addTeacherAndcourses,getTeacher,getTeacherById,updateTeacher,deleteTeacher ,getStudentCountForTeacher};
