module.exports = (req,res,next) => {
    if(req.cookies.userbooksChallenge){
        req.session.userLogin = req.cookies.userbooksChallenge
    }

    next()
}
