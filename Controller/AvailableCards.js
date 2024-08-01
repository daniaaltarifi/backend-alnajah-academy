const db = require("../config.js");

const asyncHandler = require("../Middleware/asyncHandler.js");

const getavailableCards = (req, res) => {
  const { governorate_id } = req.params; // Get the governorate_id from the query parameters
  if (!governorate_id) {
    return res.status(400).send('Governorate parameter is required');
  }

  const sql = 'SELECT * FROM  availablecards WHERE governorate_id = ?';
  db.query(sql, [governorate_id], (err, result) => {
    if (err) {
      console.error('Error fetching data:', err.sqlMessage); // Logging the SQL error message
      res.status(500).send('Server error');
      return;
    }
    res.json(result);
  });
};



const getgovernorate = asyncHandler(async (req, res) => {
  const sqlSelect = "SELECT * FROM governorate";
  db.query(sqlSelect, (err, result) => {
    if (err) {
      console.error('Error selecting data: ' + err.message);
      return res.json({ message: "Error" });
    }
    res.status(201).json(result);
  });
})


module.exports = { getavailableCards ,getgovernorate};
