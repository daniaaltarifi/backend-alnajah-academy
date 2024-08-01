const express = require('express');
const AvailableCards= require('../Controller/AvailableCards.js');

const router = express.Router();

router.get('/:governorate_id',AvailableCards.getavailableCards);


router.get('/', AvailableCards.getgovernorate);


module.exports = router;