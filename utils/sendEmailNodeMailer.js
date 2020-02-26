
const nodemailer = require("nodemailer");


const sendEmail = async (options)=>{
try {
  //        let transporter =  await nodemailer.createTransport({
  //         service: "gmail", 
  //   auth: {    
  //     user: "tedybearq@gmail.com",
  //     pass: "babyquang"
  //   }
  // });


  let transporter =  await nodemailer.createTransport({
   service: 'SendGrid',

    auth: {    
        user: "apikey",
        pass: "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"
      }
});
   await transporter.sendMail({   
    from: "tedybearq@gmail.com" , // sender address
    to: options.to, // list of receivers
    subject: "reset password token", // Subject line
    text: options.text, // plain text body
 
    html: '<h5> this is html</h5> <br> Embedded image: <img src="https://hips.hearstapps.com/hmg-prod.s3.amazonaws.com/images/single-minded-royalty-free-image-997141470-1558379890.jpg"/> '
  
  }); 

} catch (error) {
  console.log(error) 
}
 

}  

module.exports = sendEmail 

