const express = require('express');
const router = express.Router();
const userAuthenticationControllers = require('../controllers/userAuthentication')
const indexController  = require('../controllers/index')


router
 .get( '/', userAuthenticationControllers.verifyWebtokenToDisplayLoggedInHeaderForLoginnedUser ,indexController.getIndex )

 module.exports = router;