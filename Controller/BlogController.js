const asyncHandler = require('../Middleware/asyncHandler.js');
const db=require('../config.js')

const addBlog = asyncHandler(async(req,res)=>{
    const {title, author, descr, tag_id,department_id } = req.body;
    if (!title || !author || !descr || !tag_id || !department_id || !req.files || !req.files['img']) {
        return res.status(400).json({ message: "All fields (title, author, descr, tag_id, department_id, img) are required." });
    }
    const img=req.files['img'][0].filename

    const sqlInsert = 'INSERT INTO blog (title, author, descr, img, tag_id, department_id) VALUES (? , ? , ? , ? , ? , ?)';
    db.query(sqlInsert, [title, author, descr, img, tag_id, department_id], (err,result)=>{
        if(err){
            return res.json({message: err.message})
        }
        res.status(200).json({message: 'Blog added successfully'})
    })
})

const getBlogs = asyncHandler(async (req, res) => {
    // Fetch data from blog and department tables to return department name
    const sqlSelect = `
       SELECT blog.*, department.title AS department_name, tag.title AS tag_title,
        DATE_FORMAT(blog.created_at, '%Y-%m-%d') AS created_date 
        FROM blog
        JOIN department ON blog.department_id = department.id
        JOIN tag ON blog.tag_id = tag.id
    `;
    
    db.query(sqlSelect, (err, result) => {
        if (err) {
            return res.status(500).json({ message: err.message });
        }
     
        
        res.status(200).json(result);

    });
});
 

const getLastThreeBlogs = asyncHandler(async (req, res) => {
    const sqlSelect = `
       SELECT * FROM blog ORDER BY created_at DESC LIMIT 3`;
    db.query(sqlSelect, (err, result) => {
        if (err) {
            return res.status(500).json({ message: err.message });
        }
     
        
        res.status(200).json(result);
        
    });
});

const getBlogById = asyncHandler(async (req, res) => {
    const blogId = req.params.id; // Assuming blog id is passed as a parameter
  
    const sqlSelect = `
      SELECT blog.*, department.title AS department_name,
       DATE_FORMAT(blog.created_at, '%Y-%m-%d') AS created_date
      FROM blog
      JOIN department ON blog.department_id = department.id
      WHERE blog.id = ?
    `;
  
    db.query(sqlSelect, [blogId], (err, result) => {
      if (err) {
        return res.status(500).json({ message: err.message });
      }
  
      res.status(200).json(result);
    });
  });
  


const updateBlog = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const { title, author, descr, tag_id, department_id } = req.body;
 // Check if any required fields are missing
 if (!title || !author || !descr || !tag_id || !department_id || !req.files || !req.files['img']) {
    return res.status(400).json({ message: "All fields (title, author, descr, tag_id, department_id, img) are required." });
}
    const img = req.files['img'][0].filename;

    const sqlUpdate = 'UPDATE blog SET title = ?, author = ?, descr = ?, tag_id = ?, department_id = ?, img = ? WHERE id = ?';
    db.query(sqlUpdate, [title, author, descr, tag_id, department_id, img, id], (err, result) => {
        if (err) {
            console.error('Error updating data: ' + err.message);
            return res.status(500).json({ message: err.message });
        }
        res.status(200).json({ message: 'Blog updated successfully' });
    });
});

const deleteBlog = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const sqlDelete = 'DELETE FROM blog WHERE id =?';
    db.query(sqlDelete,[id],(err,result)=>{
        if(err){
            return res.json({message: err.message})
        }
        res.status(200).json({message: 'Blog deleted successfully'})
    })
})
module.exports={addBlog,getBlogs,updateBlog,deleteBlog, getLastThreeBlogs,getBlogById}