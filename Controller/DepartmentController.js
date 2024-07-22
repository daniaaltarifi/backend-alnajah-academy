const asyncHandler = require("../Middleware/asyncHandler.js");
const db = require("../config.js");

const addDepartment = asyncHandler(async (req, res) => {
  const { title, coupon } = req.body;
  const sqlInsert = "INSERT INTO department (title , coupon) VALUES (? , ?)";
  db.query(sqlInsert, [title, coupon], (err, result) => {
    if (err) {
        console.error('Error inserting data: ' + err.message);
        return res.json({ message: "Error" });
      }
      res
      .status(201)
      .json({ message: "Department added successfully", id: result.insertId });  });
});
const getDepartment = asyncHandler(async (req, res) => {
    const sqlSelect = "SELECT * FROM department";
    db.query(sqlSelect, (err, result) => {
      if (err) {
        console.error('Error selecting data: ' + err.message);
        return res.json({ message: "Error" });
      }
      res.status(201).json(result);
    });
})
const updateDepartment = asyncHandler(async (req, res) => {
    const id=req.params.id;
    const {title, coupon } = req.body;
    const sqlUpdate = "UPDATE department SET title =?, coupon =? WHERE id =?";
    db.query(sqlUpdate, [title, coupon, id], (err, result) => {
      if (err) {
        console.error('Error updating data: ' + err.message);
        return res.json({ message: "Error" });
      }
      res.status(201).json({ message: "Department updated successfully" });
    });
})
const deleteDepartment=asyncHandler(async(req,res)=>{
    const id=req.params.id;
    const sqlDelete = "DELETE FROM department WHERE id =?";
    db.query(sqlDelete, [id], (err, result) => {
      if (err) {
        console.error('Error deleting data: ' + err.message);
        return res.json({ message: "Error" });
      }
      res.status(201).json({ message: "Department deleted successfully" });
    });  });

module.exports ={addDepartment,getDepartment,updateDepartment,deleteDepartment}