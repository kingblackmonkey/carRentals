
const Car = require('../models/carModel')
const FEATUREApi = require('../utils/feaureApi')

exports.getIndex = async(req, res,next)=>{


    try {

        const features = new FEATUREApi(Car, req.query )
        // pagination method will return the this which is the your object that contain 
        // the query collection with filter and pagination rules in it
        // we nee dto access the real query collection car that is stored in the collection prop of  features oject to execute the query in it
        cars = await features.filters().pagination().collection
        // console.log(cars)
        // res.cookie('XSRF-TOKEN', req.csrfToken());
        // req.session.isAuth = true
        // set and send the csrf token cookie
        // this cookie set to no http only
        // so your code in front end can read it and send 
        // in with the api call to pass csrf middle ware in
        // the back end
        // this prevent csrf attack
        // because only your code in your own domain 
        // can read the cookie value
        // the other code in other domain can not read this
        // this cookie value which is to csrf token
        // so only your code has this csrf token 
    // and can pass the csrf middle ware in the back
    // this cookie will be expired after 4 hours which is enough be cause 
    // the new cookie with new csrf token value is created
    // everytime the user hit the homepage route
    // res.cookie('token', `${req.csrfToken()}`, { expires: new Date(Date.now() + 4 * 3600000) , httpOnly: false })

   

    // this homepage view have access to user prop cause in the previous middle before this middle it sets the user prop for you
    
        res.render('index', { 
            homeLink: true,
            cars: [cars[1], cars[2]],
            
                 
        
        }) 

        //   res.json({status:'success'}) 


        

        } catch (error) {
            res.send(`<p>sorry there is an error</p> <a href="/"> Go Back </a>`)
        }

  
}

