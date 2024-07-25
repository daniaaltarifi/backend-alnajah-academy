const express = require('express');
const { register, login } = require('../Middleware/verifyJWT');
const router = express.Router();
const User = require('../Controller/UserController.js'); // Import UserController
router.post('/register', register);
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
