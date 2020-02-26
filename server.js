const dotenv = require('dotenv').config();



const app = require('./app');
const mongoose = require('mongoose');


const port = process.env.PORT ||3000;
 const server =  app.listen(port, ()=>{
    console.log(`running on port ${port}`)
    });
// this event catch synchorous bug in your app 
// like variables not defined 
// since it catches bug synchronously put it on top
// this erroe handle will catch eeror that you first run the script
//  this will not handle error from call back or error logic in the call back
// logic and error in call back are handled by the main error middleware in error controller
process.on('uncaughtException',()=>{
  console.log('error from uncaught')
  server.close(()=>{
    process.exit(1)
  })
})






  console.log(process.env.NODE_ENV)
const DatabaseAddress = process.env.USER_DATABASE
  // connect node app to mongo data base using mong0ose
mongoose.connect(`${DatabaseAddress}`, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
  }).then((con)=>{
    console.log('connect to database')

  })





// when the mongoose cannnot conect to database 
// and if you dont have the catch for the promise then 
// the unhandledRejection event fire and run the
// call back; this event used for asynchronous code
// it will fire for promise that dont have catch method
// but for beeter practice handle the error of promise after the "then"
// it is much beeter
 process.on('unhandledRejection', (reason, promise) => {
   console.log('error from unhandle')
server.close(()=>{
  process.exit(1)
})
});   


