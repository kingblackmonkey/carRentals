
const nodemailer = require("nodemailer");
var pug = require('pug');
const path = require('path')
class Email{
  constructor(option){
    this.option = option;
  }

 async makeTransporter(){
      let transporter =  await nodemailer.createTransport({      
      
            service: 'SendGrid',
        
            auth: {    
                user: "apikey",
                pass: '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'
              }
      });

      this.transporter = transporter;

  }

  async  sendEmailForResetpassword(){
        await this.transporter.sendMail({   
          from: "tedybearq@gmail.com" , // sender address
          to: this.option.to, // list of receivers
          subject: "reset password token", // Subject line
          text: this.option.text, // plain text body
      
          // html: '<h5> this is html</h5> <br> Embedded image: <img src="https://hips.hearstapps.com/hmg-prod.s3.amazonaws.com/images/single-minded-royalty-free-image-997141470-1558379890.jpg"/> '
          html:`<h1>This message is from Car Rentals</h1><p>${this.option.text}</p> `
        }); 

  }

  async  sendEmailForCarBookingOrder(orderData){

    //get  html string from  from pug
    const viewPath = path.join(__dirname, '../views/emailBookConfirm.pug')
      let html = pug.renderFile(viewPath, orderData);



    await this.transporter.sendMail({   
      from: "tedybearq@gmail.com" , // sender address
      to: this.option.to, // list of receivers
      subject: "California Car Rentals Confirmation", // Subject line
      text: this.option.text, // plain text body
  
      // html: '<h5> this is html</h5> <br> Embedded image: <img src="https://hips.hearstapps.com/hmg-prod.s3.amazonaws.com/images/single-minded-royalty-free-image-997141470-1558379890.jpg"/> '
      html
    }); 

}
}


// const sendEmail = async (options)=>{

//   let transporter =  await nodemailer.createTransport({

    
//   // host: "smtp.mailtrap.io",
//   // port: 2525,

//   // auth: {    
//   //     user: "1b93f79be34401",
//   //     pass: "24958024b25fd0"
//   //   }


//     service: 'SendGrid',
 
//      auth: {    
//          user: "apikey",
//          pass: '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'
//        }
//  });
//     await transporter.sendMail({   
//      from: "tedybearq@gmail.com" , // sender address
//      to: options.to, // list of receivers
//      subject: "reset password token", // Subject line
//      text: options.text, // plain text body
  
//      // html: '<h5> this is html</h5> <br> Embedded image: <img src="https://hips.hearstapps.com/hmg-prod.s3.amazonaws.com/images/single-minded-royalty-free-image-997141470-1558379890.jpg"/> '
//      html:`<h1>This message is from Car Rentals</h1><p>${options.text}</p> `
//    }); 
// }  

// module.exports = sendEmail 
module.exports = Email


