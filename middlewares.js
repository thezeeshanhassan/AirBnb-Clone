module.exports.isLoggedIn =  (req, res ,next) =>
{
    if(!req.isAuthenticated()) // req.authenticated() checks that User is authenticated or not
    {
        console.log(req.user);
        req.flash(`error`, `You must be Logged In to Proceede this Operation!`);
        res.redirect(`/login`);
    }
    return next();
}
