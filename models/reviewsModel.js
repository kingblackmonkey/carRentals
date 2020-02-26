const mongoose = require('mongoose');
const validator = require('validator');
// car and user prop hold id ref; so it is important to get import the user and cat model here
require('./userModel');
const CarModel = require('./carModel');
const ReviewsSchema = new mongoose.Schema({
    review: {
        type: String,
         required: [true,'Should have a review' ],
         minlength:[2, "password must be at least 2 characters"]
    },
    rating: {
        type: Number,
          min:[1, 'must be above 1'],
          max: [5, 'must be below 5'],
         required: [true,'Should have a rating' ]
    },
    status:{
        type: String,
        required: [true,'Should have a review status' ],
        trim: true,
        enum: {
            values: ['pending', 'accept', 'decline']
          , message: 'Status can only accept,pending ,accept, and decline status'
          },
        default:'pending'
    },
    user: { type:  mongoose.Schema.Types.ObjectId , required: [true,'Must have user id' ]},
    car: { type:  mongoose.Schema.Types.ObjectId  , required: [true,'Must have car id' ]} 
 
 
});

// only populate user field
ReviewsSchema.pre('find', function(){
   //populate the fields
    this.populate({ 
        path:'user',
        model:'Users', 
        select:'-passwordCreatedAt'
      
    })
    // console.log('it runs 345') 
})

ReviewsSchema.pre('save', function(){
    if(this.rating >= 3){
        this.status = 'accept'
    }
})

// populate user and car but not neccessary 
// to populate both user and car; just populate user thats goo enough
// ReviewsSchema.pre(/^find/, function(){
//     this.populate({
//         path:'user',
//         model:'Users',
//         select:'-passwordCreatedAt'
      
//     }).populate({
//       path:'car',
//       model:'Cars',
//       select:'name brand'
//     })
// })

// 
// calculate average rating when there is a new review comes in
// after you save a review in review collection
// must use he post save method of the document because
// we need new review to be present in the review collection
// so we can do the calculation
// if use pre method then the new review doc is not included
// you aggregate them
// you match them(find docs based on car id), group them(group the review based on car id), count number
// of review docs with same car id  , and calculate average
// it will return a single object containing the avrage rating and number of review docs which is 
// the number of reviews

// you need Reviews model to run aggregate method
// you need  a car id to finds review doc for that specific car and group them

ReviewsSchema.statics.calculateAverage= async function(carId) {
    // this refers to the model when this function runs
   const averageAndTotalNumberOfReviewsForACar= await this.aggregate([
    // First Stage

 
    {
      $match :    { $and: [ {"car": carId }, { status: 'accept' } ] }
    },
    // Second Stage
    {
      $group : {
        //   group by the same car id in the car field
         _id : "$car",     
         averageForReview: { $avg: "$rating" },
         totalReviewsQuantity: { $sum: 1 }
      }
    }
   ]) 

//    after you get the review doc stats back 

// import the car model and use car id to find the car and update the average rating and review quantity field

  console.log(averageAndTotalNumberOfReviewsForACar)
  };

//   create method all so call the save method so the hook for save also run
// after a  review   saved in the collection 
// this post save method of review doc will run and trigger the calculateAverage method
ReviewsSchema.post('save',  async function(){
    // this is the new review doc after being save in reviews collection
    // in this doc you have access to car id
         await  this.model("Reviews").calculateAverage(this.car)
});
// ======================================================


// when user update review we recalcualte the rating average


// method 1
// trigger this function when the doc run remove method
// but this method is not good cause you have to update each property manually
// method 2 is better cause you dont have to update each property manually
// ReviewsSchema.post('remove', async function() {
//     await  this.model("Reviews").calculateAverage(this.car)
//   }); 

// method 2
// use post method to run function after query execute and update the doc
// the callback runs after the doc is updated and deleted
// if we update it will reuturn the updated doc and if we delete review doc 
// it will return deleted review doc
// the doc being updated is return in the callback function 
// findByIdAndDelete is short hand and same for findOneAndDelete
// findByIdAndUpdate is same and short hand for findOneAndUpdate
  ReviewsSchema.post(['findOneAndUpdate', 'findOneAndDelete'], async function(doc) {

   if(doc){
     
       
        await doc.model("Reviews").calculateAverage(doc.car)
   }
   
   
       
  });



  // create combination unique fields
  // in this case we create a unique feilds for user id and car id in review doc
  // when each review is created, the review doc has user id and car id in it
  // if the same user create another review for a same car we want to stop that
  // cause each same user should write only one  review for each car not doublbe review for same car
  // we do that by using create index from mongodb
  // making user id and car id, it will check if new review come in  have same uer id and same car id  
  // then it will throw error
  // only do this way to make combined field unique; setting unique feild on the above model can not make the 
  // combined feilds unique
  // setting 1 or -1 does not matter ; just the unique field equal to true  matters
  // 
  // ReviewsSchema.createIndex( { user: 1,  car: 1 }, { unique: true } )
 
let Reviews =   mongoose.model('Reviews', ReviewsSchema);

module.exports = Reviews; 

 