const express = require('express');
const { register, login } = require('../Middleware/verifyJWT');



const router = express.Router();
const User = require('../Controller/UserController.js'); // Import UserController
const multer = require("multer");
const path = require("path");
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'images')
    },
    filename: (req, file, cb) => {
        cb(null, file.fieldname + "_" + Date.now() + path.extname(file.originalname))
    }
})
const upload = multer({
    storage: storage
})

router.post('/register',upload.single('img'), register);
router.post('/login', login);


router.get('/user/:id', (req, res) => {
    const userId = req.params.id;
    User.findById(userId, (err, user) => {
      if (err) return res.status(500).send(err);
      if (!user) return res.status(404).send('User not found');
      res.status(200).json(user);
    });
  });
 

module.exports = router;