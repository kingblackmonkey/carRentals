const express = require('express');
const router = express.Router({mergeParams: true});
const reviewsController = require('../controllers/reviews');
const userAuthenticationController = require('../controllers/userAuthentication')

router.get('/all',reviewsController.getAllReviews)



router
.route('/')
.post( userAuthenticationController.verifyWebtoken, userAuthenticationController.checkUserRole('user'),reviewsController.createReview)


router.get( '/admin',userAuthenticationController.verifyWebtoken, userAuthenticationController.checkAdminRole('admin'),reviewsController.getAllReviewsforAdmin)

router
.route('/:reviewId')
.patch(userAuthenticationController.verifyWebtoken, userAuthenticationController.checkAdminRole('admin','user'),reviewsController.updateReview)
.delete(userAuthenticationController.verifyWebtoken, userAuthenticationController.checkAdminRole('admin','user'), reviewsController.deleteReview)
module.exports = router;