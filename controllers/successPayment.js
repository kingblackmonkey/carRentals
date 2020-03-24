
const bcrypt = require('bcryptjs');
const stripe = require('stripe')(process.env.STRIPE_SK);
const Orders = require('../models/order')
const User = require('../models/userModel')
const Email = require('../utils/sendEmailNodeMailer')
exports.verifySucesspayment = async(req,res,next)=>{
  
    try {
      let stripeSessionId =  req.query.session_id
      console.clear()
      console.log('query', req.query)
      console.log('stripe session id',stripeSessionId)
      console.log('stripe session hash', req.session.pendingPayment.hashedStripeSession)
     let resultAfterCompared =  await bcrypt.compare(stripeSessionId, req.session.pendingPayment.hashedStripeSession)
    
 
     console.log('result ',resultAfterCompared)
      if(resultAfterCompared){
          req.verifiedPayment = true
          req.bookedCarInfo = {
            userBookingCar : req.session.pendingPayment.userId,
            carBooked: req.session.pendingPayment.carId,
            carLoc: req.session.foundCarLoc,
            carName: req.session.pendingPayment.carName,
            carImage: req.session.pendingPayment.carImage
          }
      }else{
        req.verifiedPayment = false
      }
      req.session.pendingPayment = undefined
      req.session.foundCarLoc = undefined
      next()
    } catch (error) {
      console.clear()
      console.log(error)
    }
}  




exports.successPayment = async(req, res)=>{

  // fullfill the order here
  try {
    if( req.verifiedPayment){
        
  
        // save order to order collection
        // get checkout session id from req query 
        let sessionId = req.query.session_id
        // retrieve stripe checkout session object
        console.clear()
       let sessionObj =   await  stripe.checkout.sessions.retrieve(sessionId);
        
        //retrieve payment intent to see the cherge object
       let paymentIntentObj =  await stripe.paymentIntents.retrieve( sessionObj.payment_intent)   
      
       let cardBrand = paymentIntentObj.charges.data[0].payment_method_details.card.brand
       let last4CardNUmber = paymentIntentObj.charges.data[0].payment_method_details.card.last4
        let amountPaid = paymentIntentObj.charges.data[0].amount /100
        let taxPaid =  amountPaid - amountPaid/1.1
        let orderDate = new Date()
        let tripePaymentIntent =  sessionObj.payment_intent
        let user = req.bookedCarInfo.userBookingCar
        let car = req.bookedCarInfo.carBooked
      let carLoc = req.bookedCarInfo.carLoc
      let carName = req.bookedCarInfo.carName
      let carImage = req.bookedCarInfo.carImage
      
    // store order info in orders collection
        let orderData = {
          amountPaid,
          taxPaid,
          cardBrand,
          last4CardNUmber,
          orderDate,
          tripePaymentIntent,
          user,
          car,
          pickupLocation: carLoc,
          carName,
          carImage
        }
        console.log(orderData)
 
        
    
        let order =  await Orders.create(orderData)
        
        // -------render the ordernumber number page
        
        // -------send email ;
        // get user email from user doc
        let userDoc = await User.findById(user)
          let email = new Email({to: userDoc.email, text:'This is a confirmed email'})
          await email.makeTransporter()
          await email.sendEmailForCarBookingOrder(order)
        res.render( 'orderNumber',
                  {

                    orderConfirm:true,
                    verifiedPayment: true,
                    orderNUmber: order._id
                  }
                    
                    )
      }else{ 
          res.render( 'orderNumber',
          {

            orderConfirm:true,
            verifiedPayment: false,
           
          }
            
            )
      }
  
    
      } catch (error) {
        console.clear()
        console.log('error from succsess payment    ',error)
        res.send(`<p>sorry there is an error when getting your order number</p> <a href="/"> Go Back </a>`)
      }
 
   };
   