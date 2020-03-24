
const Car = require('../models/carModel')
const FEATUREApi = require('../utils/feaureApi')




exports.getCars= async(req, res,next)=>{

    try {
      console.log( req.query )
      
            const features = new FEATUREApi(Car, req.query )
            let carDocsCount = await features.filters().collection
            carDocsCount = carDocsCount.length
            // pagination method will return the this which is the your object that contain 
            // the query collection with filter and pagination rules in it
            // we nee dto access the real query collection car that is stored in the collection prop of  features oject to execute the query in it
           let  cars = await features.filters().sort().pagination().collection
         
            

            //i copy flash message array to new array to keep the flash message
            // cannot use the arryy from last message
            // it is  bug; so copying flash message to new arry will keep
            // the array message
            let messageArr = [...req.flash('wishlist-flag')]
       
            let message =  messageArr[0]
            
            // for future bteter use of flashing meesage 
            // use only one message variables and message type variables
            // no need to use different type of variables names for different 
            // message type 
            let loginMessageArr = [...req.flash('loginMessage')]
            let loginMessage = loginMessageArr[0]
            let loginMessageType =  loginMessageArr[1]
            res.render('cars', { 
                 carLink: true, 
                 cars, 
                  message : message ? message: '',
                  loginMessage: loginMessage ? loginMessage:'',
                  loginMessageType: loginMessageType? loginMessageType: '',
                  carIdInwishlist:req.user? req.user.wishlist.length?  req.user.wishlist:[] :   req.session.cars?  req.session.cars:[],
                  curentPage: req.query.page? parseInt(req.query.page): 1,
                //   you want 3 items per page
                
                  totalPage:   Math.ceil(carDocsCount/3),
                  previousPage :  req.query.page? parseInt(req.query.page)  - 1: 0,
                  nextPage:  req.query.page?       parseInt(req.query.page) ===  Math.ceil(carDocsCount/3)   ?    '':  parseInt(req.query.page)  + 1  :2,
                  sortValue:  req.query.sort?  req.query.sort: ''
                } ) 
  
           
            // cars.forEach(element => {
            //     if(req.session.cars.includes(element._id.toString())){
            //         console.log(element._id)
            //     }
            // });
            //     res.json({ carIdInwishlist: req.session.cars})

    } catch (error) {
      res.send(`<p>sorry there is an error</p> <a href="/"> Go Back </a>`)
    } 

}


