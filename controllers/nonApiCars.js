
const Car = require('../models/carModel')
const FEATUREApi = require('../utils/feaureApi')

exports.getCars= async(req, res,next)=>{
    try {

            const features = new FEATUREApi(Car, req.query )
            // pagination method will return the this which is the your object that contain 
            // the query collection with filter and pagination rules in it
            // we nee dto access the real query collection car that is stored in the collection prop of  features oject to execute the query in it
            cars = await features.filters().pagination().collection
            console.log(cars)
            res.render('cars', { carLink: true, cars}) 


    } catch (error) {
        
    }

}