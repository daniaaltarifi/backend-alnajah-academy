   
const express = require("express");
const router = express.Router();
const { addComment , getComments} = require("../Controller/CommentController");

router.post("/comments", addComment);
router.get("/comment", getComments);
module.exports = router;