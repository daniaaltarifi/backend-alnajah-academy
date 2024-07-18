// yourVideoCourseModule.js

const db = require('../config'); // Import your database configuration

// Function to insert a new video
const addVideo = async (req, res) => {
    try {
        const { subject_name } = req.body;
        const url = req.files['url'][0].filename; // Assuming 'url' is the field name from multer config

        const sqlInsert = "INSERT INTO videos (subject_name, url) VALUES (?, ?)";
        db.query(sqlInsert, [subject_name, url], (err, result) => {
            if (err) {
                console.error('Error inserting video data:', err.message);
                return res.status(500).json({ message: "Error inserting video" });
            }
            res.status(201).json({ message: "Video added successfully", id: result.insertId });
        });
    } catch (error) {
        console.error('Error adding video:', error.message);
        res.status(500).json({ message: "Error adding video" });
    }
};






// Function to add a course and associate it with a video
// const addCourse = async (req, res) => {
//     const { subject_name, videos } = req.body;

//     // Insert course first
//     db.query('INSERT INTO courses (subject_name) VALUES (?)', [subject_name], (err, result) => {
//         if (err) {
//             console.error('Error inserting course: ' + err.stack);
//             return res.status(500).json({ error: 'Failed to add course' });
//         }

//         const courseId = result.insertId;

//         // Insert videos for the course
//         const videoValues =courseId
//         db.query('INSERT INTO videos (course_id, subject_name, url) VALUES ?', [videoValues], (err, result) => {
//             if (err) {
//                 console.error('Error inserting videos: ' + err.stack);
//                 return res.status(500).json({ error: 'Failed to add videos' });
//             }

//             console.log('Course and videos added successfully');
//             res.json({ message: 'Course and videos added successfully' });
//         });
//     });
// };
// Assuming you have already set up db connection and required modules

// Function to add a new course with videos
const addCourse = async (req, res) => {
    const { subject_name } = req.body;


};


// Function to retrieve videos for a course
function getVideosForCourse(courseId, callback) {
    db.query('SELECT * FROM videos WHERE course_id = ?', [courseId], (err, results) => {
        if (err) {
            console.error('Error retrieving videos:', err);
            return;
        }
        callback(results);
    });
}

// Example usage:


// Retrieve videos for a specific course
const courseIdToRetrieve = 1; // Replace with the actual course ID
getVideosForCourse(courseIdToRetrieve, (videos) => {
    console.log(`Videos for course ID ${courseIdToRetrieve}:`, videos);
});

module.exports = { addVideo, addCourse };
