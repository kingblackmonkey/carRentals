const express = require('express');
const router = express.Router();
const ApiCarsController  = require('../controllers/NonApiCars')
const userAuthenticationControllers = require('../controllers/userAuthentication')

router.get( '/',userAuthenticationControllers.verifyWebtokenToDisplayLoggedInHeaderForLoginnedUser ,ApiCarsController.getCars)




module.exports = router;

