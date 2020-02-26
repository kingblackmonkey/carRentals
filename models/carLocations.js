const mongoose = require('mongoose');
const validator = require('validator');

require('./userModel');
require('./carModel');
const CarlocationSchema = new mongoose.Schema({
    address: {
        type: String,
         required: [true,'Should have Address' ]
    },
    city: {
        type: String,
         required: [true,'Should have city' ]
    }, 
    state: {
        type: String,
         required: [true,'Should have state' ]
    },
    country: {
        type: String,
         required: [true,'Should have country' ]
    },
    zipcode: {
        type: String,
         required: [true,'Should have zipcode' ],
         maxlength: [5, 'zipcode must be 5 digits'],
         minlength: [5, 'zipcode must be 5 digits'],

    },
    storePhoneNumber:  { 
        type: String,      
    required: [true,'Should have phone number' ],
  
    } ,
    managers:[{ type:  mongoose.Schema.Types.ObjectId }],
    carsAvalaibleAtThisLocation: [{ type:  mongoose.Schema.Types.ObjectId}],
   locationCoordinates:{
            // It's important to define type within type field, because
        // mongoose use "type" to identify field's object type.
    type: {type: String, enum: ['Point'], default: 'Point'},
 
//  list the longitude first and then latitude
    coordinates: {type: [Number], required: [true,'Should have coordinates' ]}
   }
});

// must create index for locationCoordinates so geo spatial query can work
CarlocationSchema.index({ locationCoordinates : "2dsphere" } );


let CarLocations =   mongoose.model('CarLocations', CarlocationSchema);

module.exports = CarLocations;

