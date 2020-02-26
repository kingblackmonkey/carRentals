const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
// crypto built in package  for reset token password
const crypto = require('crypto');
const userSchema = new mongoose.Schema(

  {
    name: {
        type:String, 
        required:[true, "must have name"],
    
     },
    
    
    email: { 
        type: String,  
        required: [true, 'User email is required'],
        unique: true,
        lowercase:true,  
        validate: {
            validator: function(v) {
              return validator.isEmail(v);
            },
            message: props => `${props.value} is not a valid email!`
          },
    
    },
    role:{
      type:String,
      enum: ['user','team-leader','admin'],
      default:'user'
    },
    
    photo: {type:String},
    password: {
        type: String,
        minlength:[5, "password must be at least 5 characters"],
        maxlength:[15, "allow only  15 characters max "],
        required :[true, "must have password"],
        select:false
    },
    passwordConfirmed: {
        type: String,
        minlength:[5, "password must be at least 5 characters"],
       maxlength:[15, "allow only  15 characters max "],
       required:[true, "must have confirmed password"],
       validate: {
        //   the 'this' only point to this  own schema on save method; create but not update
        // when you update user password, use save but not find and update
        // the this will be lost with findAndUpdate method. the 'this' only work when we first create
        // documentand when it first validate
        validator: function(v) {
          return v === this.password;
        },
        message: props => `${props.value} does not match with the password`
      },
    },
    passwordCreatedAt:{ type: Date, default: Date.now },

    passwordResetToken:String,
    passwordResetTokenExpire: Date
    
    }


);




// run this code (middleware) before save the doc in database
// if the doc is created that means password prop is created
// so isModified return true
// if we update password then password is updated then isModified return
// true
// when doc is created and when we update the password
// we encrypt the password
// no need to encrypt confirmed password or save it in
// databse; matching validation already done before this middle ware
// so dont worry about that
// just dont need to save the confirmed password or encrypt it

userSchema.pre('save', async function(next){
  // console.log(this.isModified('password'))
 if(this.isModified('password')){
  //  when new doc is created then password is created
  //when we update with new password then password is modified
   
// isMOdified method will be true when password is created or modified
  //  then we encrypt the password
  // we dont care about other prop cause we dont need to encrypt 
  // other props
    //use npm package to encrypt the password                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                            
  this.password = await bcrypt.hash(this.password, 12);
  // no need to save confirmed password to database 
  // set it to undefined before saving it to databse will not save it to database
  this.passwordConfirmed = undefined;
 }
   next() 

}) ;

// add instance method to schme so later when document is created
// it can use this method
// when user document is found,that user document will cal this 
// pass in incoming method and hashpassword in database to compare the password
// if true then client give password that matches the hashed password in database
// then use the method from bscypt to compare incoming password and the hash password 
userSchema.methods.checkPassword = async function(incomingPassword, hashPassword) {
  return await bcrypt.compare(incomingPassword, hashPassword)
};

userSchema.methods.checkPasswordTimeStampAndWebTokenTImeStamp = (passTime, tokenTime)=> {
 
  if(passTime < tokenTime) return true

  return false
};

userSchema.methods.createResetPasswordToken = async function(){
  const resetToken = crypto.randomBytes(32).toString('hex');

 this.passwordResetToken = crypto
    .createHash('sha256')
    .update(resetToken)
    .digest('hex');
  //   reset password token expires in 10 minutes when this token is created and 
  // send out
   this.passwordResetTokenExpire = new Date(Date.now() + 600000) ;

  
    
    return resetToken;
}
let User =   mongoose.model('Users', userSchema);

 

module.exports = User;