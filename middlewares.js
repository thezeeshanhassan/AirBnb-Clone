module.exports.isLoggedIn =  (req, res ,next) =>
{
    if(!req.isAuthenticated()) // req.authenticated() checks that User is authenticated or not
    {
        // Redirects URL Redirect the User Where he want to Go Before LogIn, After LogIn he Will 
        // Go there With Help of Redirect URl
        req.session.redirectUrl = req.originalUrl;
        console.log(req.session.redirectUrl);
        req.flash(`error`, `You must be Logged In to Proceede this Operation!`);
        return res.redirect(`/login`);
    }
    next();
}

module.exports.saveRedirectUrl = (req, res, next) => {
    if(req.session.redirectUrl)
    {
        res.locals.redirectUrl = req.session.redirectUrl;
    }
    next();
}