const express = require('express');
const router = express.Router();
const userAuthenticationControllers = require('../controllers/userAuthentication')
const paymentAndCheckoutController = require('../controllers/paymentAndCheckout')


router.route('/')
.get(userAuthenticationControllers.verifyWebtokenToDisplayLoggedInHeaderForLoginnedUser,paymentAndCheckoutController.renderBillingAddressPage)
.post(userAuthenticationControllers.verifyWebtokenToDisplayLoggedInHeaderForLoginnedUser ,paymentAndCheckoutController.renderBillingAddressPageWithCalculatedTax )

router.post('/payment',userAuthenticationControllers.verifyWebtokenToDisplayLoggedInHeaderForLoginnedUser ,paymentAndCheckoutController.makeStripePaymentSession)

module.exports = router; 