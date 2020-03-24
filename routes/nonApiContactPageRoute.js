const express = require('express')
const router = express.Router()
const nonApiContactPageController = require('../controllers/nonAPiContact') 
const userAuthenticationControllers = require('../controllers/userAuthentication')
router.get('/', userAuthenticationControllers.verifyWebtokenToDisplayLoggedInHeaderForLoginnedUser ,nonApiContactPageController.getContactForm)

module.exports = router