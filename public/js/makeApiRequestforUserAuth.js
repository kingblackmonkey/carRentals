import axios from 'axios'


export const makeApiRequestForLogin = async(email,password, _csrf)=>{



       
     let response =  await axios({
        method: 'post',
        url: '/user/signin',
        data: {
        email,
        password,
        _csrf

        }
    
    })
     
    return response
 
    


}



export const makeApiRequestForLogout = async(_csrf)=>{



       
    let response =  await axios({
       method: 'post',
       url: '/user/logout',
       data: {
      
       _csrf

       }
   
   })
    
   return response

   


}

export const makeApiRequestForSignup= async( userName,email,password,confirmPassword,_csrf)=>{



       
    let response =  await axios({
       method: 'post',
       url: '/user/signup',
       data: {
      name: userName,
      email,
      password,
      passwordConfirmed: confirmPassword,
       _csrf

       }
   
   })
    
   return response

   


}

export const makeApiRequestForgotPassword = async(email, _csrf)=>{
    let response =  await axios({
        method: 'post',
        url: '/api/v1/users/forgotpassword',
        data: {
     
       email,
     
        _csrf
 
        }
    
    })
     
    return response
}


export const makeApiRequestForresetPassword = async(password,confirmedPassword, _csrf, resetPasswordtoken )=>{
    let response =  await axios({
        method: 'patch',
        url: `/api/v1/users/resetPassword/${resetPasswordtoken }`,
        data: {
     
       password,
       passwordConfirmed: confirmedPassword,
        _csrf
 
        }
    
    })
     
    return response
}

export const makeApiRequestToFindCarNearTheZipcode= async( carId,zipcode,withinMiles,_csrf)=>{
    let response =  await axios({
        method: 'post',
        url: `/api/v1/locations/car/nearme`,
        data: {
            carId,
            zipcode,
            withinMiles,
            _csrf
 
        }
    
    })
     
    return response
}



