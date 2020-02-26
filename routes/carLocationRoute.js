const express = require('express');
const router = express.Router();
const locationControler = require('../controllers/carLocation')
router
 .get( '/:lg/:lat/car/:carId/:distance', locationControler.findAvailableCarForALocation)

 module.exports = router;