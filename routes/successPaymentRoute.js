const express = require('express');
const router = express.Router();
const stripePaymentController = require('../controllers/successPayment')
const userAuthController = require('../controllers/userAuthentication')

router.get('/', stripePaymentController.verifySucesspayment  , userAuthController.verifyWebtokenToDisplayLoggedInHeaderForLoginnedUser  , stripePaymentController.successPayment)

module.exports = router;  