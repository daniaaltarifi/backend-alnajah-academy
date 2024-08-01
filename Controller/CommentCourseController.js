const asyncHandler=require('../Middleware/asyncHandler.js');
const db=require('../config.js')

const addCommentCourse = asyncHandler(async (req, res) => {
    const { name, email, comment, rating, course_id } = req.body;
    const defaultAction = 'not approved'; // Replace with your default action value

    const sqlInsert = 'INSERT INTO commentcourse (name, email, comment, rating, course_id, action) VALUES (?, ?, ?, ?, ?, ?)';
    db.query(sqlInsert, [name, email, comment, rating, course_id, defaultAction], (err, result) => {
        if (err) {
            return res.json({ message: err.message });
        }
        res.status(200).json({ message: 'Course Comment added successfully' });
    });
});


const getCommentcourse = asyncHandler(async (req, res) => {
    const sqlSelect = `
        SELECT commentcourse.*, courses.subject_name AS course_name,
        DATE_FORMAT(commentcourse.created_at, '%Y-%m-%d') AS created_date 
        FROM commentcourse
        JOIN courses ON commentcourse.course_id = courses.id
    `;
    db.query(sqlSelect, (err, result) => {
        if (err) {
            return res.status(500).json({ message: err.message });
        }
        res.status(200).json(result);
    });
});




const deleteCommentcourse = asyncHandler(async (req, res) => {
    const {id}=req.params;
    const sqlDelete = 'DELETE FROM commentcourse WHERE id =?';
    db.query(sqlDelete,[id],(err,result)=>{
        if(err){
            return res.json({message:err.message})
        }
        res.status(200).json({message: 'course Comment deleted successfully'})
    })
})
module.exports = {addCommentCourse,getCommentcourse,deleteCommentcourse}