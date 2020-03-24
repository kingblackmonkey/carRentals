// const fs = require('fs');

// let users =JSON.parse(fs.readFileSync(`${__dirname}/../dev-data/data/users.json`)) ;

const User = require('../models/userModel')
exports.getAllUsers = async(req,res)=>{
 try {
    //  console.log(req.session.isAuth)
    //  console.log(req.session.cart)

 const user =  await User.find(req.body);
 res.status(200).json({
    status: 'success',
    data: {
        users: user
    }
})
 } catch (error) {
     next(error)
 }
   };

exports.addUser = (req, res)=>{
    res.status(200).json({
        status: 'user added',
        data: {
            user: req.body
        }
    })
   };

exports.getAUser = async(req, res)=>{
    
    let user =   await User.findById( req.params._id);
    
    res.status(200).json({
        status: 'success',
        data:{
            user
        }
    })
   };

   exports.getMe = async(req, res)=>{
    
    let user =   await User.findById( req.user._id).select('name email');
    
    res.status(200).json({
        status: 'success',
        data:{
            user
        }
    })
   };  

exports.updateAUser = async(req, res, next)=>{

try {
  console.log(req.params._id)
   
    let user =   await User.findById( req.params._id);

    user.password = req.body.password
    user.passwordConfirmed = req.body.passwordConfirmed
      user =   await user.save()


    res.status(200).json({
        status: 'updated',
        data:{
            user
        }
    })
} catch (error) {
    next(error)
}
 
       
   }
exports.deleteUser = (req, res)=>{
    
console.log(req.params._id)
    res.status(200).json({
        status: 'deleted',
        data:{
            user: req.params._id
        }
    })
   };




