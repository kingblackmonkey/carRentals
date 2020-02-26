const Car = require('../models/carModel');
 const Carlocations = require('../models/carLocations');
 const Reviews = require('../models/reviewsModel');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const fs = require('fs');
dotenv.config({path: '.././.env'})
  
const cars = JSON.parse(fs.readFileSync(`${__dirname}/../dev-data/data/cars.json`));
const carLocations = JSON.parse(fs.readFileSync(`${__dirname}/../dev-data/data/locations.json`));
const reviews = JSON.parse(fs.readFileSync(`${__dirname}/../dev-data/data/reviews copy.json`));

const addDocuments = async (docType)=>{
 
try {
  if(docType === '--addCars'){
    await Car.create( cars );
  }
  
  if(docType === '--addCarLocations'){
    await Carlocations.create( carLocations  );
  }

  if(docType === '--addReviews'){
    await Reviews.create( reviews );
  }
      
      console.log('add docs')
} catch (error) {
     console.log(error)
}
 process.exit()
}

const deleteDocuments = async (docType)=>{ 
 
    try {


      if(docType === '--deleteCars'){
        await Car.deleteMany();
      }
      
      if(docType === '--deleteCarLocations'){
        await Carlocations.deleteMany();
      }          

      if(docType === '--deleteReviews'){
        await Reviews.deleteMany();
      }
       console.log('deleted all')
    } catch (error) {
         console.log(error)
    }

    process.exit()
     
    }
    


// connect node app to mongoprocess.env.USER_DATABASE data base using mong0ose
mongoose.connect(`${process.env.USER_DATABASE}`, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
  }).then((con)=>{
    console.log('connect to database')
  
 
   
    
  }).catch((err)=>{
    console.log(err)
  });


  if(
    process.argv[2]==='--addCars'
  || process.argv[2]==='--addCarLocations'
  || process.argv[2]==='--addReviews'
  ) 
  {
 
      addDocuments(process.argv[2])
     
  }else{
      deleteDocuments(process.argv[2]);
  }