import axios from 'axios'




export const  makeApiRequestForStripeSessionId =async(carId,_csrf )=>{
     

      
           let response =  await axios({
            method: 'post',
            url: `/checkout/payment`,
            data:{
                 carId,
                 
                 _csrf
            }
        
        })
         
        return response
       
     
            
         
     
        
     
     
     }