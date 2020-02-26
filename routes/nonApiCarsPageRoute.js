const express = require('express');
const router = express.Router();
const nonApiCarsController  = require('../controllers/nonApiCars')
router
.get( '/', nonApiCarsController.getCars )

module.exports = router;