const db = require("../config.js");

const addComment = (req, res) => {
  const { name, email, comment } = req.body;

  if (!name || !email || !comment) {
    return res.status(400).json({ error: "All fields are required" });
  }

  const sql = "INSERT INTO comments (name, email, comment) VALUES (?, ?, ?)";
  db.query(sql, [name, email, comment], (err, result) => {
    if (err) {
      console.error("Error inserting comment:", err);
      return res.status(500).json({ error: "Database error" });
    }
    res.json({ message: "Comment submitted successfully", result });
  });
};

const getComments = (req, res) => {
    const sql = "SELECT * FROM comments";
    db.query(sql, (err, results) => {
      if (err) {
        console.error("Error fetching comments:", err);
        return res.status(500).json({ error: "Database error" });
      }
      res.json(results);
    });
  };

module.exports = { addComment , getComments};