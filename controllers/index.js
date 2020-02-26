

exports.getIndex = (req, res,next)=>{
    res.render('index', {homeLink: true }) 
}

