const Reviews = require('../models/reviewsModel')

exports.getAllReviews = async(req, res, next)=>{
//    to populate same level, you can chain the 
// populate method and pass options to them
// or use one populate method, pass in an array
// of options (options is object has path,model,and select field
// )
// the populate method is defined in review  model and run first when there is a find query that run
    try {
        // regular when request for all reiews, this midlleware will run
        // we only allow reviews with status accept to be returned 
        let filter = { status:'accept', car: req.params.carId}
        //regular user can not use status to query the reviews
        // we should delete it here in case user put status in query 
        delete req.query.status
        if(req.query.rating){
            req.query.rating = parseInt(req.query.rating)
            filter = {...filter ,...req.query}
        }
        console.log(filter)
      let reviews =   await  Reviews.find(filter).select('-status')
        res.status(200).json({
            status: 'success', 
            data: {
               reviews
            }
        });  
    } catch (error) {
        next(error)
    }
}

exports.getAllReviewsforAdmin = async(req, res, next)=>{
   
        try {
            let filter = {}
            if(req.query.status){
              
                filter = {...req.query}
            }
            console.log(filter)
          let reviews =   await  Reviews.find(filter)
            res.status(200).json({
                status: 'success', 
                data: {
                   reviews
                }
            });  
        } catch (error) {
            next(error)
        }
    }

exports.createReview = async(req, res, next)=>{
  
        try {
            let review;
          if(req.params.carId) {
             review =   await  Reviews.create({...req.body, user: req.user._id, car: req.params.carId})
          }else{
                 review =   await  Reviews.create(req.body)
          }

        
            res.status(200).json({
                status: 'success',
                data: {
                   review
                }
            });  
        } catch (error) {
            next(error)
        }
    }

const acceptedfieldsToUpdateBasedOnRole= ({body, user})=>{
    if(user.role === "user" && body.review  || user.role === "user" && body.rating ){
        return body.review && body.rating?
       
        {  
            review: body.review,
            rating: body.rating,
            status: body.rating >=3 ? "accept":"pending"
        } :  
        
        body.review? {  review: body.review}:{ rating: body.rating , status: body.rating >=3 ? "accept":"pending"}



         
     
      
    }


    if(user.role === "admin" && body.status){
        return {
            status: body.status
        }
    }
 
    return {}
}    
    
    exports.updateReview = async(req, res, next)=>{
    
            try {
            // method 1 is okay 
            // but not good practice
            //     let review =   await Reviews.findById( req.params.reviewId);
            // let contentToUpdate =    acceptedfieldsToUpdateBasedOnRole(req)
            //     review.review= contentToUpdate.review? contentToUpdate.review:  review.review
            //     review.rating =  contentToUpdate.rating? contentToUpdate.rating:  review.rating
            //     review.status= contentToUpdate.status? contentToUpdate.status:  review.status
            //      review=   await review.save()
// method 2
// the acceptedfunction will also check for rating when upating;
// if rating is greater than 3 then it will set review status to "accept"
// and that review will be included in the arggreation for average calculation
// there is a hook middle ware that will run to calculate average after the update in the post method in the review model
// 
                let review =   await Reviews.findByIdAndUpdate(req.params.reviewId,  acceptedfieldsToUpdateBasedOnRole(req), {new:true, runValidators: true}, )        
    
            
                res.status(200).json({
                    status: 'success',
                    data: {
                       review 
                    }
                });   
            } catch (error) {
                next(error)
            }
        }



exports.deleteReview = async(req, res, next)=>{
   
            try {
                // method 1 is okay but not good practice in this case
            //   let    review =  await Reviews.findById(req.params.reviewId); 
        //    let    product = await review.remove();

        // method 2 is much better
                 let review =   await Reviews.findByIdAndDelete(req.params.reviewId)        
               
        

                res.status(200).json({
                    status: 'successful deletion' 
                   
                });  
            } catch (error) {
                next(error)
            }
        }       