// trying out easy post for address verification
// trying tax jar for calculating tax
const Easypost = require('@easypost/api');
const api = new Easypost('EZTK10842e57c94f4b37b9326e44d8b94426KcyOKRFWPZhfqp7aXiUYqA');
const Taxjar = require('taxjar');
const client = new Taxjar({
  apiKey: '5105ece25486f31c15d7474a63b2473a'
});
const Car = require('../models/carModel')

const CarLocations = require('../models/carLocations')

const zipcodes = require('zipcodes');

const AppError = require('../utils/errorClassObject')
const bcrypt = require('bcryptjs');
const stripe = require('stripe')(process.env.STRIPE_SK);

exports.renderBillingAddressPage = async(req, res, next)=>{
 
  
try {

  let MessageArr = [...req.flash('invalidAddress')]
            let Message = MessageArr[0]
            let MessageType = MessageArr[1]

     if(req.user){ 
        let car =await Car.findById(req.query.carId)
 
      // use the seesion logic because in future if you want to prefill the form
      // when user input invalid address; yo can set the invalid address data in the session by the middle ware below (renderBillingAddressPageWithCalculatedTax)

        res.render('billingAddress', {
            car,
            calculatedTax: false, 
            street1: req.session.street1? req.session.street1: '',
            street2: req.session.street2? req.session.street2: '',
            city: req.session.city? req.session.city: '',
            zipcode:  req.session.zipcode? req.session.zipcode: '',
            Message,
            MessageType,
            
            
        })
    }  

      if(!req.user){
      
      req.flash('loginMessage', 'Please Login to Rent Me')
      req.flash('loginMessage', 'error')
           console.clear()
           console.log(req.path)
      req.session.save(function () {
   
            if(req.query.wishlist ==='true'){
              res.redirect('/wishlist');
            }else{
               res.redirect('/cars');
            }
           
       
          
      }); 
    }
} catch (error) {
  console.log(error)
  // handle reering error page right here
  // cause the error middle ware handle api request error

  res.send('sorry there is error')
}

}

exports.renderBillingAddressPageWithCalculatedTax = async(req, res, next)=>{

  
  try {
     let car =await Car.findById(req.body.carId)
    if(req.user && car){
     
    

        // for experiment with easypost  api address validation and tax jar 

        // i dont use tax  and easypost  api  in producttion because it cost api request if 
        // user enter invalid address many time
        // i will use  easypost  api  in developement
        // im gonna use fixed tax rate for development
        // even user enter wrong address 

        let street1 = req.body.street1
        let street2  =req.body.street2
        let city = req.body.city 
        let state = req.body.state
        let zip = req.body.zip
        // easy post api 
        // will return response if address is valid or not
        // console.log(street1,'  ',street2, '  ', city, ' ', state  ,'  ', zip )

        const verifiableAddress = new api.Address({
          verify: ['delivery'],
          street1, 
          city,
          state,
          zip,
          country: 'US',
        
        });
        
        let address =  await  verifiableAddress.save()
      
        if(address.verifications.delivery.success){
          console.log(address)
          

          //  if valid aaddress
          // we will accept the zip code; the zip code is for sure valid california zipcode
            //we will find the docs that is within the codinates converted from the zipcode provided by user
          // we will assume the user live within 20 miles away from the location that has this car 
          //  we will render possible pickup location for the user
          // finds car locations using cordinates and car available at that location

          const resultOflookupZipcode = zipcodes.lookup(zip  * 1);  

      
          let foundCarLoc = await CarLocations.find(
                {
                  locationCoordinates:
                    { $nearSphere :
                      {
                        $geometry: { type: "Point",  coordinates: [ resultOflookupZipcode.longitude,  resultOflookupZipcode.latitude ] },
                        
                        
                        $maxDistance: 20 * 1 * 1609
                      } 
                    },  
 
                    carsAvalaibleAtThisLocation: car._id

                }
            )
          
           

             console.clear()
             console.log(foundCarLoc)   
             console.log(foundCarLoc.length)   
            // if we find carLoc doc 
            // we store in the session data 

            if(foundCarLoc.length > 0){
              req.session.foundCarLoc = foundCarLoc
            }else{
              req.session.foundCarLoc =  0
            }


             //  succesful with valid address 
            //render the calculated page here 
            // render the view with calculated fix tax; your own tax 10% not from tax jar api
              res.render('billingAddress', {
                  car, 
                  calculatedTax: true,
                  street1,
                  street2,
                  city,
                  zip,
                  tax: Math.round(0.1 * car.requiredDeposit) ,
                  total:Math.round( car.requiredDeposit * 1.1),
                  foundCarLoc: foundCarLoc.length > 0 ? foundCarLoc: ''
                  
              })   

      }else{
          req.flash('invalidAddress', 'Invalid Address. Please Provide Valid California Address')
          req.flash('invalidAddress', 'error')
          
          req.session.save(function () { 
              res.redirect(`/checkout?carId=${car._id}`); 
          }); 
      } 
  
      // ==============Tax jar api will return the amount that you should collect the tax
      //  let taxResponse = await client.taxForOrder({
      //   from_country: 'US',
      //   from_zip: '91733',
      //   from_state: 'CA',
      //   from_city: 'El monte',
      //   from_street: '3137 havenpark ave',
      //   to_country: 'US',
      //   to_zip: zip,
      //   to_state: 'CA',
      //   to_city: city ,
      //   to_street: street1,  
      //   amount: car.requiredDeposit,
      //   shipping: 10

      // })

      // console.log(taxResponse)

     
  }  

      if(!req.user&& !car){
        
          req.flash('loginMessage', 'Please Login to Rent Me')
          req.flash('loginMessage', 'error')
          
          req.session.save(function () {
              res.redirect('/cars');
          });
      }
      
  } catch (error) {
    console.log(error)
        // handle reering error page right here
        // cause the error middle ware handle api request error
        
        
        // the RequestError is to handle error of easypost in case of api running request 
        // we still allow user to see page of total and calculated tax go to stripe checkout page any way 
      if(error.name === 'RequestError'){
        // render the calculated page here anyway
       // render the view with calculated fix tax; your own tax 10% not from tax jar api
      //  in case the easy post api can not process address api request due to limit
      // we will accept the zip code; the zip code is for sure valid california zipcode
      //we will find the docs that is within the codinates converted from the zipcode provided by user
      // we will assume the user live within 30 miles of the location that has this car 
              try {
                let car =await Car.findById(req.body.carId)
                if(car){
                          let zip = req.body.zip
                          let street1 = req.body.street1
                          let street2  =req.body.street2
                          let city = req.body.city 
                          let state = req.body.state
                          const resultOflookupZipcode = zipcodes.lookup(zip  * 1);  
                          let foundCarLoc = await CarLocations.find(
                            {
                              locationCoordinates:
                                { $nearSphere :
                                  {
                                    $geometry: { type: "Point",  coordinates: [ resultOflookupZipcode.longitude,  resultOflookupZipcode.latitude ] },
                                    
                                    
                                    $maxDistance: 30 * 1 * 1609
                                  } 
                                },  
                  
                                carsAvalaibleAtThisLocation: car._id
                  
                            }
                        )
                  
                          if(foundCarLoc.length > 0){
                            req.session.foundCarLoc = foundCarLoc
                          }else{
                            req.session.foundCarLoc =  0
                          }
                  
                            res.render('billingAddress', {
                              car, 
                              calculatedTax: true,
                              street1,
                              street2,
                              city,
                              zip,
                              tax: Math.round(0.1 * car.requiredDeposit) ,
                              total:Math.round( car.requiredDeposit * 1.1),
                              foundCarLoc: foundCarLoc.length > 0 ? foundCarLoc: ''
                              
                            })   
                }else{
                  res.send(`<p>sorry there is an error</p> <a href="/"> Go Back </a>`)
                }
            
              } catch (error) {
                console.clear()
                console.log(error)
              }
      
      }else{
        res.send(`<p>sorry there is an error</p> <a href="/"> Go Back </a>`)
      }
 
         
    
  }
     
  }  


exports.makeStripePaymentSession = async (req,res,next)=>{

  try {
    


    let car =await Car.findById(req.body.carId)
    //create stripe customer
    // so you can see customer in stripe dash board
    // and helpful for exisitng customer to make next payment


    if(req.user && car ){
      let stripeCustomer=   await stripe.customers.create(
        {
         email: req.user.email ,
         name: req.user.name
        }
      );
  
  
  
  
              // create stripe seesion and get stripe id session 
        // send back stripe session id to client so client can redirect
        const session = await stripe.checkout.sessions.create({
          
          customer: stripeCustomer.id ,
          payment_intent_data:{
            receipt_email:   req.user.email  
          },
         
       
  
  
          payment_method_types: ['card'],
          line_items: [{
            name:car.name,
            description:`Car Brand: ` + car .brand,
  
            // -========================  go back and turn the image with the system path on when you deploy
            // to heroku 
          
            // images: [`${req.protocol}://${req.get('host')}${car.imageCover}`],
          //tax is from your place is 10 %
            images: [car.imageCoverUrl],
  
            amount: Math.round(car.requiredDeposit * 1.1* 100 ) , 
            currency: 'usd', 
            quantity: 1,
           
  
          }],
          // success_url: `${req.protocol}://${req.get('host')}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
          success_url: `${req.protocol}://${req.get('host')}/success?session_id={CHECKOUT_SESSION_ID}`,
  
          cancel_url: `${req.protocol}://${req.get('host')}/`,
        });
  
        //store the object stripe checkout session id, cus id,and car id  in your sesiosn 
        // so later after successful payment stripe redirects and passes that session id 
        // you can compare the stripe session id with the one in your session data
        // if match then you can fullfill order
        // if user cancel and dont pay
        // the the stripe sesion id will be killed 
        let hashedStripeSessionId =  await bcrypt.hash( session.id, 12);
        req.session.pendingPayment = {
          hashedStripeSession:  hashedStripeSessionId,
          userId: req.user._id,
          carId: car._id,
          carName: car.name,
          carImage: car.imageCoverUrl,


        }
  
  
        res.status(200).json({
          status:'success',
          stripeSessionId: session.id
  
        })
    }else{
      next(new AppError('No Loggined User Or Car Found to Proceed to Payment'))
    }
 



  } catch (error) {
    console.clear()
    console.log(error)
    next(error)
    
  }

  


      
  
    



 

}



// makeStripePaymentSession = async (req,res,next)=>{
//   try {
//       if(req.user){
//         //create stripe customer
//         // so you can see customer in stripe dash board
//         // and helpful for exisitng customer to make next payment
//       let stripeCustomer=   await stripe.customers.create(
//           {
//            email: req.user.email ,
//            name: req.user.name
//           }
//         );

//       let car =  await Car.findById(req.body.carId)
//         if(car){

//                 // create stripe seesion and get stripe id session 
//           // send back stripe session id to client so client can redirect
//           const session = await stripe.checkout.sessions.create({
            
//             customer: stripeCustomer.id ,
//             payment_intent_data:{
//               receipt_email:   req.user.email  
//             },
           
//             // billing_address_collection:'required',
//             // shipping_address_collection:{
//             //   allowed_countries: ['US']

//             // },


//             payment_method_types: ['card'],
//             line_items: [{
//               name:car.name,
//               description:`Car Brand: ` + car .brand,

//               // -========================  go back and turn the image with the system path on when you deploy
//               // to heroku 
            
//               // images: [`${req.protocol}://${req.get('host')}${car.imageCover}`],
            
//               images: [car.imageCoverUrl],

//               amount: car.requiredDeposit * 100 , 
//               currency: 'usd', 
//               quantity: 1,
             

//             }],
//             // success_url: `${req.protocol}://${req.get('host')}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
//             success_url: `${req.protocol}://${req.get('host')}/success?session_id={CHECKOUT_SESSION_ID}`,

//             cancel_url: `${req.protocol}://${req.get('host')}/`,
//           });

//           //store the object stripe checkout session id, cus id,and car id  in your sesiosn 
//           // so later after successful payment stripe redirects and passes that session id 
//           // you can compare the stripe session id with the one in your session data
//           // if match then you can fullfill order
//           // if user cancel and dont pay
//           // the the stripe sesion id will be killed 
//           let hashedStripeSessionId =  await bcrypt.hash( session.id, 12);
//           req.session.pendingPayment = {
//             hashedStripeSession:  hashedStripeSessionId,
//             userId: req.user._id,
//             carId: car._id
//           }

//           res.status(200).json({
//             status:'success',
//             stripeSessionId: session.id

//           })
  



//         }else{
//           next(  new AppError('Sorry Can not Find This Car for Checkout ', 403) )
//         }
      
//   }
    
//   if(!req.user){
//     req.session.urlLocation = req.body.urlLocation
//     next(  new AppError('Please Login to Book Me', 403) )
//   }


//   } catch (error) {
//     next(error)
//     // console.clear()
//     //   console.log(error)
//   }

// }
