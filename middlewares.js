module.exports.isLoggedIn =  (req, res ,next) =>
{
    if(!req.isAuthenticated()) // req.authenticated() checks that User is authenticated or not
    {
        req.flash(`error`, `You must be Logged In to Proceede this Operation!`);
        return res.redirect(`/login`);
    }
    next();
}
