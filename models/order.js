const mongoose = require('mongoose');
const validator = require('validator');

require('./userModel');
require('./carModel');
require('./carLocations')
const OrderSchema = new mongoose.Schema({
    carName: {
        type:{String}
    },
    carImage: {
        type:{
            String
        }
    },
    amountPaid: {
        type: Number,
        
    },
    taxPaid: {
        type: Number,
         
    }, 
    taxRate:{
        type:Number,
        default: 10
    },
    orderDate: {
        type: Date,
        
    },
    stripePaymentIntent: {
        type: String,
        
    },
    last4CardNUmber:{
        type: Number
    } ,

    cardBrand:{
        type:String
    },
    
   user:{ type:  mongoose.Schema.Types.ObjectId },
   car: { type:  mongoose.Schema.Types.ObjectId},
   pickupLocation:[]

});

// CarlocationSchema.pre('find',function() {
//     this.populate({
//         path:'managers.',
//         model:'Users',
//         select:'name email'
//     })
// });





let Orders =   mongoose.model('orders',OrderSchema);

module.exports = Orders;

