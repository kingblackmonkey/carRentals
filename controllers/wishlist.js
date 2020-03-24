
const Car = require('../models/carModel')
const User = require('../models/userModel')

exports.getWishlist= async(req, res,next)=>{
    try {
        //    the get wishlist route
    
        // this  will serve for guest user
    if( !req.user){
           //get the cars out from session 
     const carsIdInWishlist = req.session.cars;
     const carsInwishlist =await Car.find({_id: carsIdInWishlist});
      //   pass in the car wishlist 
     //  to views ; do if else in the view
     // to display item or message saying no car
 //    res.json({cars: carsInwishlist})
 let loginMessageArr = [...req.flash('loginMessage')]
 let loginMessage = loginMessageArr[0]
 let loginMessageType =  loginMessageArr[1]
     res.render('wishList',{
        loginMessage: loginMessage ? loginMessage:'',
        loginMessageType: loginMessageType? loginMessageType: '',
         carsInwishlist,
         carIdInwishlist: req.session.cars?  req.session.cars:[],
         wishlistLink:true
     
     } );

    }
    // this will serve sign in user wishlist 
    if(req.user){
        const carsInwishlist =await Car.find({_id: {$in:req.user.wishlist}});
        res.render('wishList',{
            carsInwishlist,
            carIdInwishlist: req.user.wishlist.length > 0?   req.user.wishlist:[]
        
        } );
    }
  
    } catch (error) {
        res.send(`<p>sorry there is an error getting your wishlist/p> <a href="/"> Go Back </a>`)
    }

}


exports.addCarToWishlist= async(req, res,next)=>{

    try {
            //find car based on id got from req
            // 
            // this is for non sigin in user
        if(!req.user){
            // store car id in the session data in an array
            if( !req.session.cars){
                req.session.cars = [req.body.carId]
            }else{
                req.session.cars = [...req.session.cars, req.body.carId]
            }
        // because you use the form to make request for this route so we use flash message
        // if you dont use the form and use api request you can response with json message without flash message
            //flash the message 
            // make sure the flash message is completely saved in session data in database
            // then redirect to cars
            req.flash('wishlist-flag', 'Car Added to Wishlist')
            req.session.save(function () {
                res.redirect('/cars');
            });
            
        }
  
        
        // this is for signed in user to add car  to wishlist of sigined in user
        if(req.user){
            //store car id in whish list for signined in user
            await  User.findByIdAndUpdate(req.user._id,{wishlist: [...req.user.wishlist, req.body.carId]})
             // because you use the form to make request for this route so we use flash message
        // if you dont use the form and use api request you can response with json message without flash message
            //flash the message 
            // make sure the flash message is completely saved in session data in database
            // then redirect to cars
            req.flash('wishlist-flag', 'Car Added to Wishlist')
            req.session.save(function () {
                res.redirect('/cars');
            });
        }

    } catch (error) {
        next(error);
        
    }






  
    
        
    }
    
    exports.deleteCarInWishlist= async(req, res,next)=>{

        if(!req.user){
              //remove car from car wishlist array in session data
   //this is for unsign in user
             req.session.cars = req.session.cars.filter((id)=>{
                return id !== req.body.carId
             })  
        
       
        //flash the message 
        // then redirect to cars
        req.flash('wishlist-flag', 'Car Removed From Wishlist')
        req.session.save(function () {
            res.redirect('/cars');
          });
        }
     
        if(req.user){
           let updatedCarWishlistId =  req.user.wishlist.filter((carId)=>{
                return carId !== req.body.carId
            });
            await  User.findByIdAndUpdate(req.user._id,{wishlist: updatedCarWishlistId})
              //flash the message 
            // then redirect to cars
            req.flash('wishlist-flag', 'Car Removed From Wishlist')
            req.session.save(function () {
                res.redirect('/cars');
            });
        }
        
            
        }     