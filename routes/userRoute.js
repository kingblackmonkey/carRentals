const express = require('express');
const validator = require('validator');
const AppError = require('../utils/errorClassObject');

const userController = require('../controllers/users');
const userAuthenticationController = require('../controllers/userAuthentication');

const reviewRouter = require('./reviewsRoute')
let router= express.Router();





// for user role only
router.get('/me',userAuthenticationController.verifyWebtoken , userAuthenticationController.checkUserRole('user'),userController.getMe);
// router.get('/signup', userAuthenticationController.signup);


router.get('/forgotpassword', userAuthenticationController.getForgotpassword);
// this route will handle for email submit
router.post('/forgotpassword', userAuthenticationController.forgotpassword);
//this route for rendering the reset password form
router.get('/resetPassword/:resetToken', userAuthenticationController.getResetPassword);
//this route for setting new password for unsign in user who forgets password
router.patch('/resetPassword/:resetToken', userAuthenticationController.resetPassword);
router.patch('/updatePassword',userAuthenticationController.verifyWebtoken ,userAuthenticationController.updatePasswordForSignedInUser);
router.patch('/updateUserInfo',userAuthenticationController.verifyWebtoken, userAuthenticationController.updateSignedInUserInfo);

    // for admin role only 
    // come back here to add the check token and role  middle ware for admin
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
     