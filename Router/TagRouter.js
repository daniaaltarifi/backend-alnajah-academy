const express = require('express');
const router=express.Router();
const TagController=require('../Controller/TagController.js')

router.get('/', TagController.getTag);
module.exports = router;