const express = require('express');
const userAuthenticationController = require('../controllers/userAuthentication')
let router= express.Router();


router.route('/')
.get(userAuthenticationController.getSignin)
.post(userAuthenticationController.createAccountLimiter ,userAuthenticationController.signin);

// .post(userAuthenticationController.signin);
module.exports = router;