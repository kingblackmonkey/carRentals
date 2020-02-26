const express = require('express');
const userAuthenticationController = require('../controllers/userAuthentication')
let router= express.Router();

router.post('/',userAuthenticationController.createAccountLimiter ,userAuthenticationController.signin);

module.exports = router;