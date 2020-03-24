const express = require('express');
const userAuthenticationController = require('../controllers/userAuthentication')
let router= express.Router();


router.route('/signup')
.get( userAuthenticationController.getSignup)
.post( userAuthenticationController.postSignup)




router.route('/signin')
.get(userAuthenticationController.getSignin)
.post(userAuthenticationController.createAccountLimiter ,userAuthenticationController.signin);



router.post('/logout', userAuthenticationController.logout)

module.exports = router;