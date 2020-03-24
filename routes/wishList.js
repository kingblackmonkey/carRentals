const express = require('express')
let router= express.Router();
const wishlistController = require('../controllers/wishlist')
const userAuthenticationControllers = require('../controllers/userAuthentication')
router.get('/',
userAuthenticationControllers.verifyWebtokenToDisplayLoggedInHeaderForLoginnedUser,
wishlistController.getWishlist
)

 router.post('/addCar', 
 userAuthenticationControllers.verifyWebtokenToDisplayLoggedInHeaderForLoginnedUser , 
 wishlistController.addCarToWishlist
 )
router.post('/deleteCar',
 userAuthenticationControllers.verifyWebtokenToDisplayLoggedInHeaderForLoginnedUser ,
 wishlistController.deleteCarInWishlist
 )

module.exports = router