


const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const morgan = require('morgan');
const path = require('path')



const carRoutes = require('./routes/carRoute');

const userRoutes = require('./routes/userRoute');

const reviewsRoute = require('./routes/reviewsRoute');
const carLocationRoute = require('./routes/carLocationRoute')

const signInRoute = require('./routes/userSignIn');
const errorHandler = require('./controllers/error');
const nonApiHomePageRoute = require('./routes/nonApiHomePageRoute')
const  nonApiCarsPageRoute = require('./routes/nonApiCarsPageRoute')
// package to limit number of request
// limiting number of request can help prevent overload and attacks
const rateLimit = require("express-rate-limit");

// package to remve any dolar sign og mongo db so hacker can not use nosql query string attached on
// request and hack and get data
const  mongoSanitize = require('express-mongo-sanitize');


// package to clean any response that contain html code and javascript attached to it
const xss = require('xss-clean'); 

// this package called http parameter polution 
// it will delete duplicate key in the url parameters 

const  hpp = require('hpp');

// helmet package to set security to your header
// best is to set this middle as the top middle ware in middle ware stack
// this will set more rules to your response header and hide some info on the header
// to make it hard for hacker 

const helmet = require('helmet')

var session = require('express-session')


// set pug template

app.set('view engine', 'pug')
// template folder name and location folder  of template
const viewPath = path.join(__dirname, 'views')
app.set('views', viewPath)

// the root when first start the page(will look for html index.html specificly) or css or image or js  request will go to this middle ware and look for assets
// in the public folder and pull out the asset in the public folder
// with out this middle ware client dont have the path and cannot tell server where
// to look for
app.use(express.static( path.join(__dirname, 'public')));




app.use(helmet())




// morgan middle ware to print the incomming url path to console
// for development purposes

// console.log(process.env.NODE_ENV)





// app.use(session({
//   name: '_es_demo', // The name of the cookie
//   secret: '1234', // The secret is required, and is used for signing cookies
//   resave: false, // Force save of session for each request.
//   saveUninitialized: false, // Save a session that is new, but has not been modified
//   cookie: {
//     path    :'/api/v1/cars' ,
    
//   }
// }));




// app.use(session({
//   name: 'another seesion cookie', // The name of the cookie
//   secret: '12345', // The secret is required, and is used for signing cookies
//   resave: false, // Force save of session for each request.
//     saveUninitialized: false, // Save a session that is new, but has not been modified
//     cookie: {
//       path    :'/' ,
      
//     }
// }));





if (process.env.NODE_ENV === "development") app.use(morgan('dev'));

// when you use use with out explicitly writing the path
// it will br written as '/' internally


// parse application/json
// but we want to limit the size of data being sent in the req
// for performance and security
app.use(bodyParser.json({limit:'10kb'}));
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));

// package to remve any dolar sign og mongo db so hacker can not use nosql query string attached on
// request and hack and get data
app.use(mongoSanitize());


// to clean response that contain html code and html symbols and javascript attached to it
// and converted to normal string 
 app.use(xss());

// my custom middle ware 
// when you use 'use' method (like the below custom middleware) 
// and if you define the path
// you say any request start with '/api' should hit this route
// if you define the verb like 'get' instead of 'use'
// if will compare by the exact match path
app.use("/api/", (req, res, next)=>{
    // console.log(req.query);
  
    next();
});


  
// my custome middle ware to determine numbers  of request
// and limit them to prevent attack and overload
// if your app crashes or reloads then the number ot limit recount from 100 requess
// so app can not crash or limit requests will recount at 100 requests
// the video does not  mention about password attemp
// but i guess you can use this package for password route to limit login attempts
// 
// only apply to requests that begin with /api/
const apiLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // it it reaches over 100 then user have to wait 1 hour before they can make requests
  max: 100
});
 app.use("/api/", apiLimiter);

// app.use((req, res, next)=>{
//     req.timeOfRecevingRequest = new Date().toISOString();
//     next();
// });

// this middleware will remove duplicate keys(http parameter polution) in the url
// your code only work for single key of fields,sort,page and limit => 
// i do one example from on the keys => fields=name,email
// name and email will be put in an object with the key is fields and value is a string of "name,email"
// parameter object looks like this {fields:"name,email"}
//  your code logic will split the that string and join back them back with a space => "name email"
// then your code do a query like this User.select('name email') => then all the docs will return with 
// only name and email props in it
//  but if hack put fields=name&fields=email then your code will crash
// here is why => the parameter object reuest will have something like this {fields:["name","email"]}
// your code logic will try to split the array which is not possible cause we can only split the string
// your code will crash; this applies to other keys like sort,limit,and page
// with this middle ware duplicate keys in parameter in url will be removed 
// it will remove all the duplicte keys but keep the last duplicate key 
// like fields=name&fields=email => it will remove fields=name and keeps fields=email
// so the parameter object will be like this =>{fields: "email"} then your code can split the string 
// "email" and continue the operation

// white list options is to tell hpp not to remove these keys in the parameter url
// lets say if you white list mph key then mph duplicates will not be removed
// your code can have other duplicate keys like mph=50&mph=60 => the mongo db find method 
// in your code can find the docs like this User.find({mph:['50','60']})
// then other code can select and sort and so on 
// 
//  but when there is duplicate  keys like fields, sort, page and limit after the find method runs your code will crash

// for short white list all the keys in your docs that you want to allow user to be able to query
// the doc based on the whitelisted keys
// like you whitelist mph keys and alow user to find doc that have mph 50 and 60 

// go back to white list the props you allow to have multitple values
// mostly white list all props in your document ; so you can allow user to perform gt or lt  
// app.use(hpp());


const getMainPage = (req, res) => {
    // res.status(200).json({ message: 'heloo from server' });
    //  res.status(200).send(`<form  action="/product" method="post"> <input type="text" name="name"> <button type="submit" value="Submit">Submit</button> </form>`);
  
   
  // res.sendFile('overview.html', {root:`${__dirname}/public`} )
  req.session.views = 1;
  res.status(200).json({
    status:'success'
    
});
} 

 app.use('/', nonApiHomePageRoute);

 app.use('/cars', nonApiCarsPageRoute);
// the request start with '/signin' will hit this route
app.use('/signin', signInRoute);


// =============================================Api routes
// app.get('/api/v1/tours', getAllTours);
// app.post('/api/v1/tours', addTour); 
// app.get('/api/v1/tours/:_id', getOneTour);
// app.patch('/api/v1/tours/:_id', updateTour); 
// app.delete('/api/v1/tours/:_id', deleteTour);

//add route middle ware for this patch, use method can take middleware handler function  or route middle ware
// which will lead to the subroute and subroute middleware handler 
app.use('/api/v1/cars', carRoutes);




// ===========================
//user api







app.use('/api/v1/users', userRoutes);


// reviews route
app.use('/api/v1/reviews', reviewsRoute)

// car location route
app.use('/api/v1/locations', carLocationRoute)

// default route 
// way 1
// app.use('/', (req, res) => {
//     res.status(404).json({
//         status: 'fail',
//         message: "page not found"
//     })
// });

// way 2
app.all('*', (req, res,next) => {
    // res.status(404).json({
    //     status: 'fail',
    //     message: "page not found"
    // })
    // console.log(req.url)
    let err = new Error(`${req.url} page not found `); // Sets error message, includes the requester's ip address!
  err.statusCode = 404;
//   when you call next and pass in error object; express will skip all the middlewares and go straight 
// to the error middle ware handler
// in the video he create a class that extends the Error class to set the message prop to object ob subclass
// and set the status code prop to object of subclass but i think it is simple just use 
// the Error class straight up
// he also add isOperational prop to the indstance to true so he can classify if the error is from users or bug
// oprational error is from user and that error is not a bug from us developer
  next(err);
});

// error middle ware has 4 parameters that express knows it is the error handler middleware
app.use(errorHandler);

module.exports = app;
