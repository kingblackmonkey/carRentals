const express = require('express');
const router = express.Router();
const locationControler = require('../controllers/carLocation')
// router
//  .post( '/:lg/:lat/car/:carId/:distance', locationControler.findAvailableCarForALocation)
router
 .post( '/car/nearme', locationControler.findAvailableCarForALocation)

 module.exports = router;