
const User = require('../models/userModel')
const Features = require('../utils/feaureApi')
const AppError = require('../utils/errorClassObject')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken');
// built in package to turn regular function to promise function 
const {promisify} = require('util');
// import send email function 
const sendEmail = require('../utils/sendEmailNodeMailer')
const Email = require('../utils/sendEmailNodeMailer')

// crypto built in package  for reset token password
const crypto = require('crypto');


const rateLimit = require("express-rate-limit");

// local functions


const createWebTOkenAndSendByCookie = (res, user, status, signup)=>{
    // console.log( process.env.NODE_ENV)
    // string token should be 32 characters long
    // let token = jwt.sign({ _id: user._id }, 'this is my secret key and no one should know', {expiresIn: process.env.NODE_ENV === 'development' ? '1d' : '7d',});
    let token = jwt.sign({ _id: user._id ,iat: Math.floor(Date.now() / 1000) - 2 } ,'this is my secret key and no one should know', {expiresIn: process.env.NODE_ENV === 'development' ? '1d' : '7d',});

    res.cookie('jwt', token, {
        // expires in 1 days
        expires: new Date(Date.now() + 1000 *60*60*1), 
        // this make seding cooking by https
        // set to false in development
        secure:process.env.NODE_ENV === 'development' ? false:true,
        httpOnly: true,
      });
 
            // signup ?  res.status(200).json({
            //     status,
            //     data: {
            //         token,
            //      user
            //     }
            // }):
            //     res.status(200).json({
            //     status,
            //     data: {
            //         token
            //     }
            // });
}





 

exports.getSignup = (req,res,next)=>{
    try {
        res.render('signup')
    
    } catch (error) {
        next(error);
    }
} 


exports.postSignup = async(req, res, next)=>{
    console.log(req.body)
try {
 const user = await User.create(req.body)
// //  even we set select to false in sche ma
// // but that only work with query
// // in the case of creating new doc
// // it will gives us back everything ; so hide the prop by setting to undefined
user.password = undefined;
user.passwordCreatedAt = undefined;
user.wishlist = undefined
//  createWebTOkenAndSendByCookie(res,user,'success', 'signup')
createWebTOkenAndSendByCookie(res,user)

     //check if there is any car in wishlist in sesssion and transfer to wishlist newly sign up signin user       
 
   // transfer those cars to wishlist of newly signup  user
   if(req.session.cars){
        if(req.session.cars.length !==0 ){
            //if there is any car list in the wishlist of data session
            // update the wishlist of newly signed up user
            

            const newWishlist = [...req.session.cars];
            req.session.cars = undefined;
            await  User.findByIdAndUpdate(user._id,{wishlist: newWishlist})

        
        }
   }



    // also check if any url location insession data because
    // if there is url in there it means user try to click on rent me button  but got 
    // rejected because that user did not login 
    // and your code did save the url location for  that car page 
    // so when the user login again if there is a url location there
    // we send back to client so client can redirect to that car par location
    // and you set that url location in session in data base to null
    // to remove it

let savedUrlLocation = ''
if(req.session.urlLocation){
    savedUrlLocation = req.session.urlLocation;
    req.session.urlLocation = undefined
}

res.status(200).json({
        status:'success',
        message:'Sign Up Successful!',
        data:  user,
        savedUrlLocation 
        
    })

} catch (error) {
    next(error);
}
}


// get request for sign in form
exports.getSignin= async(req, res, next)=>{
    // console.log(req.body)
try {
    res.render('login', {
        loginLink:true
    })

} catch (error) {
    next(error);
}
}

// this middle ware is inseted to the sign in route to check for number of login attemp
// this middle ware will count each time a user hit this signin route
// it will automaticlally call next and  pass number of attemps to signin midddle ware
// the signin middle ware check if password dont match, sigin middle ware will return error
// and remaning attempts attached in the req set by createAccountLimiter

// if a user reach the limt this createAccountLimiter will call gloabal error middle ware and
// pass in error before it reaches the signin middle ware 
exports.createAccountLimiter = rateLimit({
    windowMs:  1*60* 1000, // 1minute
    max: 5, // start blocking after 5 requests
    message:
      "Too many attemps to login  from this IP Address, please try again after an hour"
  });

exports.signin = async function(req, res, next){
    console.log(req.body)
    const {email, password} = req.body
    try {
        // check if user exist

    //  check if comming password match the hash password in database
    // remember before you save your doc your doc run middle ware
    // in the schema and hash the password
    // all users doc also has access to custom methods
    // defined in the schema
    // findOne method return single found object
    // find returns array of found object
     const user = await User.findOne({email}).select('+password');
 
console.log(user)
//   if no user or password dont match throw error

    if(!user||  !await user.checkPassword(password, user.password)){
        
        next(

            new AppError(`email incorrect or password dont match; you have ${req.rateLimit.remaining} attemps left`, 403))
        return
    }

    //  if there is user email and password match
    // create token and send back token
    createWebTOkenAndSendByCookie(res,user, 'success')


     //check if there is any car in wishlist in sesssion and transfer to wishlist of signin user       
 
   // transfer those cars to wishlist of signin user
       if(  req.session.cars){
           if(req.session.cars.length !==0){
                 //    find duplicate in the wishlist of sign in user 
        // if there is curent duplicate for signin user 
        // filter out this dunplicate in session whish list then add 
        // the wish list of session and wishlist of signin user together

        let filterdDuplicateCarId =     req.session.cars.filter((carId)=>{
            return  !user.wishlist.includes(carId.toString())   
        })
        
        const newWishlist = [...filterdDuplicateCarId, ...user.wishlist];
        req.session.cars = undefined;
             await  User.findByIdAndUpdate(user._id,{wishlist: newWishlist})
        }
      
        
    
          

       
   }

    //we will use the api request for log in
    // java script front end will handle the reques and displa meesage
    // back end need to send back data or error

    // also check if any url location insession data because
    // if there is url in there it means user try to click on rent me button  but got 
    // rejected because that user did not login 
    // and your code did save the url location for  that car page 
    // so when the user login again if there is a url location there
    // we send back to client so client can redirect to that car par location
    // and you set that url location in session in data base to null
    // to remove it
    let savedUrlLocation = ''
    if(req.session.urlLocation){
        savedUrlLocation = req.session.urlLocation;
        req.session.urlLocation = undefined
    }
    res.status(200).json(
        {status: 'success', 
        message:'Login Successful!', 
        savedUrlLocation
    
    }
        
        )

    } catch (error) {
        
        next(error);
    }
    }

// logout controller
exports.logout = (req,res,next)=>{
    //set new coikie thats will expire in 2 second
    // and return the successful log out message
    // then the new jwt cookie live for 2 second 
    // also the jwt itself is also 2 second live
    // then it will be gone  
    let token = jwt.sign({ }, 'this is my secret key and no one should know', {expiresIn: 1,});
    res.cookie('jwt', token, {
        // expires in 1 second
        expires: new Date(Date.now() + 1000 ), 
        // this make seding cooking by https
        // set to false in development
        secure:process.env.NODE_ENV === 'development' ? false:true,
        httpOnly: true,
      });
    
    res.status(200).json({status: 'success', message:'Log out Successful!'})
 

}


exports.verifyWebtoken= async(req, res, next)=>{
       
    try {
        
      
        // after user sign in we issue the token
        // that token will be saved in the client
        // everytime the client use that token along with request
        // to access route 
 
// first of all check if the request header has the web token 
// in the token format of 'Bearer 123423'
// best practice is to send token in header and add the word Bearer to we token
// only for decaoupled api where client send in api request
        // if(!req.headers.authorization || !req.headers.authorization.startsWith('Bearer') ){
        //     next(new AppError('maybe you are not logged in or you are logged in but you forget to provide token; provide token that starts with Bearer word follow by a space and token',401))
        // }
                // we will verify that token in 3 scenario

        // 1) if the token is intact and has not been changed
        // you out uder id in the payload; best is to put user id in the payload
        // cause it is most unique
        // i also turn the webtoken verify method of json web token to async function
      const verifyAsync=   promisify( jwt.verify); 
    //   for decoupled api
        // const decodedToken =  await verifyAsync(req.headers.authorization.split(' ')[1], 'this is my secret key and no one should know') 
        // get the jwt out from cookie

        const decodedToken =  await verifyAsync(req.cookies.jwt, 'this is my secret key and no one should know') 
        
        // console.log(decodedToken)  
        
        // const verifyAsync=   promisify( jwt.verify);        
        // let a = req.headers.cookie.split('=')
        // const decodedToken =  await verifyAsync(a[1], 'this is my secret key and no one should know')
        // console.log(decodedToken) 
        // console.log(a[1])
        
        // 2)if the id of user in the token payload still exist in database
        // if yes then the user is still current
        // if not it means this token belongs to deleted user
        // we wont approve that
      
        const curentUser = await User.findById(decodedToken._id)
        // console.log(curentUser)
        if(!curentUser) {
            // console.log(new AppError('This token belongs to deleted user, login again to get new token',401))
            next(new AppError('This token belongs to deleted user, sign up again to get new token',401))
            return
        }
        // 3) if the token belongs to the old password
        // mean that token was issued then user changed their password right after
        // that then we also wont approve this token and ask user to sign in again
        // so that the new token is connected to the new changed password

        // here is the logic for this step
        // when user sign up; we time stamp the user by adding password time stapm prop

        // then we send user the webtoken then the web token will
        // go through this verify token middle ware
        // since password is created first and web token is created and sent after
        // so password time stamp is always smaller than web token time stamp
// web token time stamp is created when you create the token
// if password time stamp smaller than web token time stamp then password is not change
// if password time stamp is greater than web token time stamp 
// then it means the password is updated and the time stamp is also updated
// therefore the password time stamp is greater than web token time stamp
// this is when we throw error to tel user to sign in again so they will get new token
// which has timestamp greater than time stamp of new updated password
// the logic for updating password and time stamp will be in another round
// kindda password time stamp created after the web token time stamp when web token 
// time stamp is created, create after means 
// so now we will make instance method for document to compare password time stamp and 
// web token time stamp
const timeStampInmilliseconsOfPassword = new Date(curentUser.passwordCreatedAt).getTime()
if(curentUser.checkPasswordTimeStampAndWebTokenTImeStamp(timeStampInmilliseconsOfPassword ,decodedToken.iat * 1*1000)){
    console.log('password not changed aftter issued webtoken')
    // when the code make it here means a token is legit and user with that token
    // is legit
    // we add the legit user to the request
    // so the next middle can use the info of this legit user if it wants too
    req.user = curentUser
}else{
    // 
    next(new AppError('Password has been changed. This token belongs to old password, login again to get new token',401))
    return
  
}
//  verying token is commplete ; send request to nect middle ware and llow accessing the 
// requested route
        next();
    } catch (error) {
        next(error);
    }
    }


    exports.verifyWebtokenToDisplayLoggedInHeaderForLoginnedUser= async(req, res, next)=>{
    //  console.log('hello')
  
        try {           
         
            if (req.cookies.jwt)   {
                const verifyAsync=   promisify( jwt.verify); 
                    
                        
                const decodedToken =  await verifyAsync(req.cookies.jwt, 'this is my secret key and no one should know') 
                
        
            
                const curentUser = await User.findById(decodedToken._id)
            
                if(!curentUser) {
                    // the view index should have access to this user prop cause it is gloabl
                    res.locals.user = undefined
                    // attach user a long the way in middle ware 
                    // so the next middle can know if user is logged in or no; 
                    // this is useful to add wishlist car to signin or unsignin user 
                    req.user = undefined
                    return  next()
                }

                const timeStampInmilliseconsOfPassword = new Date(curentUser.passwordCreatedAt).getTime()
                if(curentUser.checkPasswordTimeStampAndWebTokenTImeStamp(timeStampInmilliseconsOfPassword ,decodedToken.iat * 1*1000)){
                
                    res.locals.user =  curentUser
                    req.user = curentUser
                }else{
                    res.locals.user = undefined
                    req.user = undefined
                
                }
                                       
                   return next();
            }

            res.locals.user = undefined
            req.user = undefined
            next();
                    
        } catch (error) {
            console.log(error)
            next(error);
        }
        }
    



exports.checkAdminRole = (...roles)=>{
        return   (req, res, next)=>{
   
  
    if(!roles.includes(req.user.role)){
         next(new AppError('you dont have permission to perform this action',401));
         return
    }
   
next()
  

}


}
    
exports.checkUserRole = (userrRole)=>{
    return   (req, res, next)=>{


if(req.user.role !== userrRole){
     next(new AppError('Sorry admin!! this route is for regular user',401));
     return
}

next()


}

}



exports.getForgotpassword = (req,res,next)=>{
    res.render('forgotPassword')
}

    
 exports.forgotpassword = async (req, res, next)=>{
    //  imagine user is on the forgotpassword page and enter their email
try {
        // check if there is user with this email
        console.log(req.body)
        let user = await User.findOne({email: req.body.email})
        
        if(!user) {
            return next(new AppError('sorry, no user with this email', 401) )
        } 
    
        //  create reset password token and hash it and expiration for token
        //  and  add to user doc before save in database
        const resetPasswordToken = await user.createResetPasswordToken()

    // send token embedded in the link to user email so user can navigate to the reset password page
    const resetURL = `${req.protocol}://${req.get(
    'host'
  )}/api/v1/users/resetPassword/${resetPasswordToken}`;
//     await sendEmail(
//     {        
//         to: `${req.body.email}`,   
//         text: `Token is good for 10 minutes. Click this link to reset password: ${resetURL}`
//     }
//   )  

        let email = new Email({
              to: `${req.body.email}`,   
              text: `Token is good for 10 minutes. Click this link to reset password: ${resetURL}`
        })

        await email.makeTransporter();
        await email.sendEmailForResetpassword()
//   if sucessfuly send the email then save the updated doc to database

    // save the new updated user doc back to database with newly created props
    // deactivate validation because this doc is missing one property defined in schema
    // the props is confirmed password
    // because the other code set this property to undefine before saving it so 
    // when pulling it out we dont have this prop and when save it back we dont have it
    // either; but this props is defined in schema so we need to bypass the schema  
   
    await user.save({validateBeforeSave:false})
    res.status(200).json({
        status: 'success',
        
         message: 'Please check your email for rest pasword llink'
        
    });
} catch (error) {
    // if cannot send reset password token 
    // async send mail function will return error
    // then we catch the error here  
    // then we need to remove  the reset password token and reset token expiration 
    // in the user doc before saving it to database
    user.passwordResetToken  = undefined;
    user.passwordResetTokenExpire = undefined
    await user.save({ validateBeforeSave: false });
    
    return next(
        new AppError('There was an error sending the email. Try again later!'),
      500
    );
}
 


 

 }

//get reset password
exports.getResetPassword = (req,res,next)=>{
    res.render('newpassword')
}
 exports.resetPassword = async(req, res, next)=>{

    // uer will send request to this route and hit this middle ware with the token in this middleware's toute
    // we have access to this param meter value

    // find the user in database with this reset token
    // the reset token in databse is hashed
    // since we use the crypto for reset password  token we have to hash the unhashed token so we can match it with
    // the hashed token in database
    // also we will check if the incoming token millisecond is greater than the one in database
    // if yes than incoming token is expired 
    // monggose will convert date object to millisecond and compare it for you
 
// hash the unhased incoming reset password token same to the one in databased 
// so we can find the match reset  password token
try {
    let hashedResetPasswordToken= crypto
    .createHash('sha256')
    .update(req.params.resetToken)
    .digest('hex');

 let user = await User.findOne({
     passwordResetToken:hashedResetPasswordToken,
     passwordResetTokenExpire:{$gt: Date.now()}

 })

 if(!user){
     // if no user means that token is not match or token is expired 
      next(new AppError('sorry, token is broken or expired', 401))
      return
 }

 // update the user with new password and time stamp for new password
 user.password = req.body.password;
 user.passwordConfirmed = req.body.passwordConfirmed;
 // i subtract 1000 millisecond to make password time stamp 1 minute early than
 // to make sure it is 1 minute eralier(smaller) than 
 // the time stamp of the json web token
 // the password time stamp must be smaller(earlier) than the time stamp of jwt time
 // stamp
 // otherwise when user login with email  new password and get the token andaccess some routes
 // and when it verifies the token and if password timee is not smaller(earlier) than json web token  the user
 // will receive  error from the code that handles verifying token process

 user.passwordCreatedAt = Date.now() - 2000  ;
 user.passwordResetToken = undefined;
 user.passwordResetTokenExpire = undefined;

 await user.save()

 // create login token and send to user so they when they login they have token
 // along with them and can navigate the protected routes
 createWebTOkenAndSendByCookie(res,user, 'success')
    // also check if any url location insession data because
    // if there is url in there it means user try to click on rent me button  but got 
    // rejected because that user did not login 
    // and your code did save the url location for  that car page 
    // so when the user login again if there is a url location there
    // we send back to client so client can redirect to that car par location
    // and you set that url location in session in data base to null
    // to remove it
    let savedUrlLocation = ''
    if(req.session.urlLocation){
        savedUrlLocation = req.session.urlLocation;
        req.session.urlLocation = undefined
    }

 res.status(200).json({
     status:'success',
     message:'Password updated,Yor are now Logged in!',
    savedUrlLocation
 })
} catch (error) {
    next()
}
  
} 


exports.updatePasswordForSignedInUser = async(req, res,next)=>{

    //get user with incoming current password
    // signned user has their id attached to them after signing in
    // we have user profile on the client after a user sign in

 try{
     let user = await User.findOne({_id: req.user._id}).select('+password')
   console.log(user)
if(!user || !await user.checkPassword(req.body.currentPassword, user.password)){
   return next(new AppError('cannot find you in our file system because you have been deleted or current password you provide does not match'))
}



    //update the password and update the password time created at 
user.password = req.body.newPassword;
user.passwordCreatedAt = Date.now() -1000;
user.passwordConfirmed = req.body.confirmedNewPassword;
// save updated docs with new passsword
   await user.save()
    // create and send back new json web token
    createWebTOkenAndSendByCookie(res,user, 'successfully updatePassword')
 }catch(err){
next(err)
 }


}


const acceptedUpdatedfields = (unfilterFields)=>{
    // for now we want to allow onky name and email to be changed
    const acceptedProps = ['name', 'email'];
   
    const propNames = Object.keys(unfilterFields)

    let filteredFields = {};

propNames.forEach((propName)=>{
    if(acceptedProps.includes(propName)) {
        
        filteredFields = {...filteredFields, [propName]:unfilterFields[propName]}
        
    }  
});

return filteredFields
  
  


}

exports.updateSignedInUserInfo = async(req,res,next)=>{
    // find user  with id of user set in the req object by the verifyWebToken middleware
    // if we use save() methed here, we will get validation error because we dont have required passwordConfirmed
    // property here
    // the save method checks all the props defined in schema
    // the update method just check the prop that you say you want to update
    // keep in mind this update method will not work with custom validator function that has the "this" keyword
    // the "this" will not point to the current doc when you use update method
    // it make sense cause the update method check the props first against the schema
    // if it is okay than it will continue and find the doc in database
    // during the validation of update method , we dont have any current doc so the custom validator
    // with the "this" ponits to nothing
    // for the save method, you first get the doc out from databse , you make cahnge to it, then you run save method
    // then it run validations for all props and during that you do have the doc and custom validator
    // with the "this" keyword will point to the current doc correctly
// acceptedUpdatedfields(req.body)

    let user = await User.findByIdAndUpdate(req.user._id, acceptedUpdatedfields(req.body),{new:true, runValidators:true}).select('-passwordCreatedAt ')
    res.status(200).json({
        status: 'successfully updated your profile',
        data: {
           user
        }
    });

} 
