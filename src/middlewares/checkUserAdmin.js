module.exports = (req,res,next) => {
    if(req.session.userLogin && req.session.userLogin.category === 1){
      
     return next();

    }
    return res.redirect('/');
}