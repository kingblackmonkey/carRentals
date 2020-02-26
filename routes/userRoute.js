const express = require('express');
const validator = require('validator');
const AppError = require('../utils/errorClassObject');

const userController = require('../controllers/users');
const userAuthenticationController = require('../controllers/userAuthentication');

const reviewRouter = require('./reviewsRoute')
let router= express.Router();





// for user role only
router.get('/me',userAuthenticationController.verifyWebtoken , userAuthenticationController.checkUserRole('user'),userController.getMe);
router.post('/signup', userAuthenticationController.signup);

router.patch('/forgotpassword', userAuthenticationController.forgotpassword);
router.patch('/resetPassword/:resetToken', userAuthenticationController.resetPassword);
router.patch('/updatePassword',userAuthenticationController.verifyWebtoken ,userAuthenticationController.updatePasswordForSignedInUser);
router.patch('/updateUserInfo',userAuthenticationController.verifyWebtoken, userAuthenticationController.updateSignedInUserInfo);

    // for admin role only 
router
    .route('/')
    .get(userController.getAllUsers)
    .post(userController.addUser)
 

router
    .route('/:_id')
    .get( userAuthenticationController.verifyWebtoken, userAuthenticationController.checkAdminRole('admin'),userController.getAUser)
    .patch(userController.updateAUser)
     .delete(userController.deleteUser)

 module.exports = router;
     