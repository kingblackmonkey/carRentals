exports.getContactForm = async(req,res, next)=>{
    try {
        res.render('contact',{
            contactLink: true
        })
    } catch (error) {
        
    }
}

