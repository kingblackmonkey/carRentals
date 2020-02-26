const express = require('express');
const userAuthenticationController = require('../controllers/userAuthentication')
const router = express.Router();
const carController = require('../controllers/car')
const reviewRouter = require('./reviewsRoute')
// middle ware that checks valid id 
// router.param('_id', carController.getId)

// add middle ware to add sort filters to the query object before getAllCars middle ware can 
// use the  query object to sort
// kinda you set up query object for user and the sort logic in getAllCars will sort based on that 
// query object
router
    .route('/most-rented')
    .get( carController.addQueryObject ,carController.getAllCars)

// nested route 
// parent route is /12442/review
// then it is cut then go to child review route and start exactly from the root => '/'
// same thing like going into sub route but just different sub route type
// let the review middle ware handle this request 
// no need for :userId because id hidden in token  is sent to server
// then we verify token by attach verify middle ware before we allow
// it hits the create review middleware
//  ,then get id out and get all user info then add user to 
// req then check user role then  createReview  sub route middle 
// create the review with object id user and object id car

router.use('/:carId/review', reviewRouter)



// nested review route to select reviews base on query in url for a specific car
router.use('/:carId/reviews',  reviewRouter)


 
router.route('/stats').get(carController.tourStats)    
router.route('/payment').get( userAuthenticationController.verifyWebtoken,  carController.paymentPage)    


router
    .route('/')
    .get(carController.getAllCars)
    .post(carController.addCar)

    router
    .route('/:_id')
    .get(carController.getOneCar)
    .patch(carController.updateCar)
    .delete( userAuthenticationController.verifyWebtoken,userAuthenticationController.checkAdminRole('team-leader','admin'), carController.deleteCar)    

    module.exports = router;