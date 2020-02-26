
const mongoose = require('mongoose');
//use mongoose schema to make rules  for document properties
// slugify makes url of doc nice
const slugify = require('slugify');
// validator package helping validating string
// npm node validator
const validator = require('validator');
// put car location model here cause pickuplocation prop point to car location docs
require('./carLocations');
require('./reviewsModel');

const carSchema = new mongoose.Schema({
    name: { 
      type: String, 
      required: [true,
         'Why no name?' ], 
         unique: true,
         trim:true,
         maxlength: [40, 'A tour name must have less or equal then 40 characters'],
         minlength: [10, 'A tour name must have more or equal then 10 characters'],
        //  validate: {
           //external function to check if string contains number
          //  will return false if it contains number
          // but this function does not allow space which is not useful 
          // i will not use this function
          // validator: validator.isAlpha, 
          // message: props => `name has number ${props.value}, it cannot contain number`
  
          // }
        
        },
    brand:{
      type: String, 
      required: [true,
      'Should have a brand for a car' ]
    } ,
    slug: String,
    requiredDeposit:{type: Number, required:true, default:500},
    price: { type: Number, required: [true, 'Why no price?'] },
    ratingsAverage: {type: Number, default: 4},
    ratingsQuantity: {type: Number, default: 0},
    mph: {type: Number,required: [true, 'must have mph']},
    MaxPassenger:  {
      type: Number, 
      required: [true, 'must have passenger number'],
      min: [1, 'must be above 1'],
      max: [9, 'must be below 9']
    
    },
    type:{type: String, required: [true, 'must have type']},
    priceDiscount:{
      type: Number,
      validate: {
        validator: function(v) {
          return v < this.price 
          //this refers to doc being created when you first create it; v is the value being put in priceDiscount field
          //this will point to newly created doc  but if you update the doc the this will 
          //not point to the existing docs
          // pull the doc out ; update prop like 0bj.something = 123 , then run save method to get coorect validation and save
          // to database
          // where you use custom validattor with the "this" remeber to use save()

        },
        message: props => `discount price is ${props.value}; it must be less than price!`
      },
    },
    summary:{type: String, trim:true},
    color:{type: String, trim:true, required: [true, 'must have color']},
    imageCover: {type: String, trim:true, required: [true, 'must have image']},
    images: [String],
    createdAt: {
      type: Date,
      default: Date.now()
    },
    manufacturedDay: {type:Date},
    // pick up location have id point to car location model
    _populatePickUpLocation: [{ type: mongoose.Schema.Types.ObjectId}]
   
  }, { toJSON: { virtuals: true } }); 

  carSchema.virtual('_virtualPopulateReviews', {
    ref: 'Reviews', // The model to use
    localField: '_id', // current id of car doc in this car collection
    foreignField: 'car', // car property in review doc in reviews collections
 
});


  // busineess logic where business want to know car cheap or no and incluse it in each doc
  // put logic business in your model
  // virtual property is shown in doc but not save in doc in database
  // application logic often in route and controller where you might group docs and calculate average
  // application logic is when you produce new docs of info based on original docs
  // like you group original docs and returns new grouped docs to users
  // mostly you put your application like aggregation in your controller but some time 
  // you have to put your application logic in your model ; 
  // go to review model you will see you have to perform aggregation for average review in the model after you save
  // the doc in dadabase and after you update or delete review
  
  carSchema.virtual('VirtualPropertyNotSavedInDataBase-cheap').get(function () {
    return this.requiredDeposit < 500
  })









// pre middle ware in mongoose that runs before current doc saved in database
//think like you add event to it and it runs before doc being saved to database
// below you say 'save' event 
// save evnt only trigger for save() and create() not other method from mongoose like  insert() or findAnUpdate()
// define the slug field in your schema so slug field can be added to the schema
// so when the middleware  pre run the value can be added to the slug
// the middleware below set the name value  being manipuated by slugify  to the slug property
// next function  allows the proceess to continue in the mongoose middleware 
// you can have post middle also with diferent events but nost common is save event
// if there is one  posst middle no need to call next but best practice is to call one 
carSchema.pre('save', function(next) {
  this.slug = slugify(this.name, { lower: true });
  console.log(this)
  next();
  
});
  

// create index for price from low to high(1)and rating(-1) from high to low to make reading query faster
 
  let Car =   mongoose.model('Cars', carSchema);

module.exports = Car;