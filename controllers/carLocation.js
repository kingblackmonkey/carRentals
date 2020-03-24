const CarLocations = require('../models/carLocations')
const axios = require('axios');
const zipcodes = require('zipcodes');


const makeBingRequest =  async(arrOfcarLocs, origins)=>{

 
        // create orgins string
    origins = `${origins.lat},${origins.long}`
    // get the destniation out and put in new array of string of destination coordinates
    const arrLatLong =   arrOfcarLocs.map(element => {
            return `${element.locationCoordinates.coordinates[1]},${element.locationCoordinates.coordinates[0]}`
        });

     //make the destinations string for bing 
    //  [`-118.0446,34.06246`, `-118.123863,34.091572`]
    
    let destinations = arrLatLong.join(';')
     
    // send the request

      const response = await axios.get(
          `https://dev.virtualearth.net/REST/v1/Routes/DistanceMatrix?origins=${origins}&destinations=${destinations}&travelMode=driving&distanceUnit=mi&key=ApX-NwllqUlqBPY9JX16uQh3y9THFwv-pY6ljgRNfhWlMcWp4ZwSSm0F5W37s-E8`
          
          );
    //   console.log(response.data.resourceSets[0].resources[0]);
    
  return response.data.resourceSets[0].resources[0]
}


exports.findAvailableCarForALocation = async(req, res, next)=>{
    // we can use either geo near or near sphere 
    // but use near shpere is beeter cause you can chain populate field
    //but we have to convert the docs back to regular object

    //geonear is arregation which is we can not use with populate method or any query method

   
//    maxdistance is accept meter so time 1609 to make it to meter
//    distance multiplier time the 0.000621371 back to miles cause geo near return distance in  meter
// rember this is not driving distance; it is a distance from 
 
// the geonear find the docs within the distance of the specified long and lat
// it is a straight line distance and not driving disyance
     try {
        //    const foundCarLoc = await CarLocations.aggregate([
        //             {
        //             $geoNear: {
        //                 near: { type: "Point", coordinates: [ req.params.lg * 1 , req.params.lat *1] },
        //                 distanceField: "distanceForStraightLineWithinRadius",
        //                 maxDistance:  req.params.distance* 1 * 1609,
        //                 query: { carsAvalaibleAtThisLocation: req.params.carId},
        //                 distanceMultiplier: 0.000621371,
        //                 spherical: true
        //             }
        //             }
        //         ])
        const resultOflookupZipcode = zipcodes.lookup(req.body.zipcode *1);  

                // const foundCarLoc = await CarLocations.aggregate([
                //     {
                //     $geoNear: {
                //         near: { type: "Point", coordinates: [ resultOflookupZipcode.longitude  , resultOflookupZipcode.latitude] },
                //         distanceField: "distanceForStraightLineWithinRadius",
                //         maxDistance: req.body.withinMiles * 1 * 1609,
                //         query: { carsAvalaibleAtThisLocation: req.body.carId},
                //         distanceMultiplier: 0.000621371,
                //         spherical: true
                //     }
                //     }
                // ])

               let foundCarLoc = await CarLocations.find(
                    {
                      locationCoordinates:
                        { $nearSphere :
                           {
                             $geometry: { type: "Point",  coordinates: [ resultOflookupZipcode.longitude,  resultOflookupZipcode.latitude ] },
                            
                            
                             $maxDistance: req.body.withinMiles * 1 * 1609
                           }
                        },

                        carsAvalaibleAtThisLocation: req.body.carId

                    }
                 ).populate({
                    path:'managers',
                    model:'Users',
                    select:'name email'
                }).populate({
                    path:'carsAvalaibleAtThisLocation',
                    model:'Cars',
                    select:'name brand imageCover'
                })


              

//   send request to bing api to get driving distance and time travel 
// because geonear only return the straight line distance from center to the specified long and lat
// make function to send request 
// get the driving distance and travel time back from Bing
// now round the travel distance = > time travel distance by 10 then use ciel method to round up then divide by 10
// then add the bing result to you car location doc
// send back response

//--------convert mongodb doc back to regular object because docs is frozen that we can not add random prop to it
   foundCarLoc= foundCarLoc.map((carLoc)=>{
        return carLoc.toObject()
   })

    //     const travelDistanceInfoResult =     await makeBingRequest(foundCarLoc,{lat:resultOflookupZipcode.latitude, long:  resultOflookupZipcode.longitude});
    // //    console.log(travelDistanceInfoResult)
    //     travelDistanceInfoResult.results.forEach( (element,i )=> {
            
    //         foundCarLoc[i].drivingDistance = `${ Math.ceil(element.travelDistance * 10) /10} mile(s)`;
    //         foundCarLoc[i].drivingTime =  Math.ceil(element.travelDuration)  >= 60 ? `${ Math.floor( Math.ceil(element.travelDuration)  / 60)} hour(s) ${Math.ceil(element.travelDuration) % 60} minute(s)` : `${Math.ceil(element.travelDuration)} minute(s)` 
    //         foundCarLoc[i].userGivenPoints = [  resultOflookupZipcode.latitude,  resultOflookupZipcode.longitude ]
    //     });
    //   console.log(foundCarLoc)
       
        res.status(200).json({
            status: 'success',
            data: {
                foundCarLoc
               
            }
        });  
    } catch (err) { 
   
        next(err);  
    }

}