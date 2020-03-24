const AppError = require('../utils/errorClassObject')


const handleMissingOrInvalidField = (err)=>{
    
    return  new AppError(`${err.message}`, 400)

}

const handleDuplicateKey = (err)=>{
    const value = err.errmsg.match(/(["'])(\\?.)*?\1/)[0];
    return  new AppError(`duplicate value ${value}; use another name or email`, 400)
}


const handleCastError =(err)=>{
    return  new AppError(`${err.name} invalid ${err.path} with ${err.value}`, 400)
}
 
 


const sendResErrorDev = (err, res)=>{
    console.clear()
    console.log(err)
    console.log('ohhhhhhhhhh oh ',err.message)
    res.status(err.statusCode).json({
        status: `${err.statusCode}`.startsWith('4')? `fail`: 'internal error',
        message: err.message,
        error: err,
      errorStack: err.stack,
       operationalError: err.isOperational
     })

} 

const handleJsonWebTokenError = err =>  new AppError(`${err.message} because token has been modified`,401)
const handleInvalidCsurfToken = (error)=>{
    return new  AppError(`no csurf token found or ${error.message}`, 403)
}
// the error object passed in here is either your custom object or mongoose-made object
module.exports = function (err, req, res, next) {

  



    // monggose made object will not have status code property
    // only your custom error object has status code
    
    // oject form monggose will have status code of 500 because 
    // of the code below
    if (!err.statusCode) err.statusCode = 500;
    
    if(process.env.NODE_ENV === 'development'){
        sendResErrorDev(err,res);
        // console.clear()
        //   console.log(err)
    }    else{
        //   this code block run in production
        // copy your error object or mongoose error object
        // to the new one 
        // in production mode
        // there no need to show  stack trace in production mode
        let error = {...err}

        if(error.name === "CastError") error = handleCastError(error);
        if(error.code === 11000) error = handleDuplicateKey(error);
        if(error.name === "ValidationError") error = handleMissingOrInvalidField(error)
        if(error.name===  "JsonWebTokenError" ) error = handleJsonWebTokenError(error)
        if(error.code === "EBADCSRFTOKEN") error = handleInvalidCsurfToken(error)
        
        //this only works for handling api request error
        // not for rendering error page
        // redering error page will be done in the route that render the view
        error.isOperational? 
        res.status(error.statusCode).json({
            status: `${error.statusCode}`.startsWith('4')? `fail`: 'internal error'   ,
            message: error.message ? error.message: err.message,
        
        }): 
        res.status(error.statusCode).json({
            status: `${error.statusCode}`.startsWith('4')? `fail`: 'internal error'   ,
            message: `not operational error, application or database problem`,
        
        })


   }
  }