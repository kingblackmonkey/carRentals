


const fs = require('fs');
// require('../models/carModel')
// require('../models/carLocations');

const Car = require('../models/carModel')

const Features = require('../utils/feaureApi')
const AppError = require('../utils/errorClassObject')
// let tours =JSON.parse(fs.readFileSync(`${__dirname}/.././dev-data/data/tours.json`)) ;

// exports.getId = (req, res, next, val)=>{

//     const tour = tours.find((item)=>item._id === val )
//     if(!tour){
//      res.status(404).json({
//          status:'fail',
//           message:"no tour"
         
//          });
//     }else{
//         next();
//     }


// }

// exports.checkValidProperties = (req, res, next)=>{
//    console.log(req.body) ;
  
 
  
// if(req.body.name   &&  req.body.duration &&  req.body.maxGroupSize)  {
//     next();
// }else{
//     res.status(400).json({
//         status:'fail',
//          message:"bad request"
        
//         });
// }
// }
exports.addQueryObject = (req, res, next)=>{
    req.query.sort='price,-mph';
    next();
}



exports.getAllCars = async(req, res, next)=>{
   
//copy the filter object
// const filters = {...req.query}
// remove the sort prop so we can put empty object into find
// then it will return all docs
// basically remove props that dont exits on your doc so the find method 
// can find the results
// delete filters.sort
// delete filters.fields
// delete filters.page
// delete filters.limit
// turn query object from request to string and find match word and add dollar sign to filter doc in database
// let queryStr = JSON.stringify(filters)
// queryStr =  queryStr.replace(/\b(lt|gt|gte|lte)\b/g, match =>`$${match}` )
// console.log(JSON.parse(queryStr)) 

try {
    // find method will return query object after you put in your filters
    // your filters can be price or mph properties in the query string and store in
    // the query object of request
    // filter the docs if there is any props other than sort props cause 
    // you remove sort props already before pass into find method
    // your docs has no sort props
    // so we must remove sort prop
    // sort prop is sent with other filter prop like price and mph in 
    // the query object 
    // thats why we exclude sort prop
    // find method return query object for you to chain all the filter method 
    // to filter docs
//  let query =  Car.find(JSON.parse(queryStr))

 
    //sort low to high if specify; if no sort by default using requiredDeposit field
    // by default if you pass any string it will sort from low to high
// console.log(req.query)
    // req.query.sort?   query.sort(req.query.sort.split(',').join(' ')) :   query.sort('requiredDeposit')

    // selec fileds if specified ; if no then do nothing
// console.log(req.query.fields)
// req.query.fields?   query.select(req.query.fields.split(',').join(' ')): query.select('-__v')
 


// pagination 
// user can specify pages and limit for each page
// we specify default page number 1 and limit 5 per page
// console.log(req.query.limit )
// let page = req.query.page * 1 || 1;
// let limit =  req.query.limit * 1 || 3;
// let skip = (page - 1) * limit 
// query.skip(skip).limit(limit)

// let page = req.query.page * 1 || 1;
// let itemsPerpage    =   3;
// let skip = (page - 1) * itemsPerpage
// query.skip(skip).limit(req.query.limit * 1|| 3)


// pagination error when user wants page not exits 
// which is more than the total of number of current docs
// if(req.query.page){
    //count number of docs
//    let totalDocs = await Car.countDocuments();

//   if (skip >= totalDocs){
//     throw new Error('page does not exitst');
// }
// }

    // execute query
    // when ever you put in await it means you execute the query
// let cars = await query


   let features =  new Features( Car,req.query )
   .filters()
   .sort()
   .selectedFields()
   .pagination();  

   let cars = await features.collection
    // console.log(cars)
    
// no need to handle error here cause if we find none docs after querying 
// then we just need to send back 

//  req.session.views = true
// console.log(req.session);

    res.status(200).json({
        status:'success',
        results: cars.length,
        data: {
            cars
        }
    });
   } catch (err) {   
 
    next(err);
   }

    // console.log(req.body.name);
    //   res.status(200).send('recieved')
}





exports.addCar = async (req, res, next)=>{
  
   

            try { 
                // console.log(req.session.views) 
                // create method of the query object will automatically
                const car =  await Car.create(req.body)

                res.status(200).json({
                    status: 'success',
                    data: {
                        car
                    }
                });  
            } catch (err) {
            //   there is another way to write catch error function
            // without repeating the try catch block
            // you pass this async function in another function and return a function for express 
            // to call it 
            // go to video section 9 part 7 at 8:28 runtime
                // err.statusCode = 400;
                // calling next and passing error object will go straight to error middleware hadnler
                next(err);
                // res.status(400).json({
                //     status: 'fail',
                //     message: error
                // }); 
            }
 

    
    }

    


    


exports.getOneCar = async (req, res, next)=>{
    try {
        // console.log(req.session.views) 
   const car =  await Car.findById(req.params._id).populate(
    {
        // this doc has pickup location prop points to carlocation collection 
         
      path: '_populatePickUpLocation',
      
      //i dont know why but if i define location reference model
     //    in this car current model      
    // the car model can not find the carLocations model
     //but put the model reference in the populate method works
     // to populate pickupLocation we need to point to carLocations model(collection)
// the manager and carsAvalaibleAtThisLocation are nested populate in the  populate _populatePickUpLocation props
// manager, carsAvalaibleAtThisLocation , _populatePickUpLocation are all array of ref object id
      model: 'CarLocations',
         populate:[
             {
                 path: 'managers',
                 model: 'Users', 
            },
            {
                path: 'carsAvalaibleAtThisLocation',
                model: 'Cars',
                select:'name brand'
            }
    
    ]     

     
     
      

    }
   
  ).populate({
      path:'_virtualPopulateReviews' //the reference model is defined in this car model by virtual method
                                        // 
      
  })


      if(!car){

          const err = new AppError('there is no car found with this id', 400);    
          next(err);
          return
      }

        res.status(200).json({
            status: 'success',
            data:{
                car
            }
           
        });  
    } catch (err) {
     
        
        next(err);

    
    }


}


exports.updateCar = async(req, res,next)=>{
  
    // console.log(req.body)




    try {

        const car =  await Car.findByIdAndUpdate(req.params._id, req.body, {new:true,runValidators:true})  

        if(!car){
            const err = new AppError('there is no car found with this id to update', 400);    
        
            next(err);
            return
        }
        res.status(200).json({
            status: 'success',
            data: {
                car
            }
        });  
    } catch (err) {
    
        next(err); 
    }
 


}



exports.deleteCar = async(req, res,next)=>{
  
    

    try {

        // const car =  await Car.findByIdAndDelete(req.params._id)  
        // if(!car){
        //     const err = new AppError('there is no car found with this id to delete', 400);    
        
        //     next(err);
        //     return
        // }
        res.status(200).json({
            status: 'success deletion',
            // data: {
            //     car
            // }
        });  
    } catch (err) {
   
        next(err);  
    }
 
 


}

exports.tourStats= async(req, res, next)=>{
try {
    const stats = await Car.aggregate(
        [
            { 
                $match : {
                     
                    requiredDeposit : {$gt: 600} 
                    
                    } 
            
            },
           
           {
               $group : {
                _id : "$requiredDeposit",
              
                averageMph: { $avg: "$mph" },
                count: { $sum: 1 }
             
             }
           } 
        ]
    )
    res.status(200).json({
        status: 'success',
        data: {
            stats
        }
    });  

} catch (err) {
    err.statusCode = 400
        next(err); 
}
}



exports.paymentPage = (req, res, next)=>{
    res.status(200).json({
        status: 'success',
        data: {
            message: "this is payment page"
        }
    }); 
}