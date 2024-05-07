const express = require(`express`);
const router = express.Router({ mergeParams: true }); 
const User = require(`../models/user.js`); // User Schema
const passport = require(`passport`); // For Authentication (Main Library)
const localStrategy = require(`passport-local`); // Strategy For Authentication
const wrapAsync = require("../utils/wrapAsync.js");
const {saveRedirectUrl} = require(`../middlewares.js`); //To get Redirecting Url (Path)

//// User Sign Up Route

router.get(`/signup`, (req, res) => {
    res.render(`../views/users/signup.ejs`);
})
router.post("/signup", wrapAsync(async (req, res) => {
    try {
        let { username, email, password } = req.body;
    let newUser = new User({ username, email });
    let registeredUser = await User.register(newUser, password);
    // Automatically Login User after Sign Up
    req.login(registeredUser,(err) => {
        if(err) {
            return next();
        }
        req.flash(`success`, `${username}! You have Successfully Signed Up.`);
        res.redirect('/listings');
    })
    console.log(registeredUser);
    
    }
    catch(err) {
        req.flash(`error`, err.message);
        res.redirect(`/signup`);
    }
}))

//// User LogIn Route

router.get(`/login`, (req,res) => {
    res.render(`../views/users/login.ejs`);
})
//// PassPort.authenticate() is used for authentication is User Enter correct Credentials
//// FailureFlash throw Flash
//Save Redirect Url
router.post(`/login`,saveRedirectUrl, passport.authenticate(`local`, {failureRedirect : `/login`, failureFlash : true}),wrapAsync(async(req,res) => {
    req.flash(`success`, `${req.body.username}! You have Successfully Logged In. Welcome!`);
    console.log(req.user._id);
    let redirectUrl = res.locals.redirectUrl || `/listings`;
    res.redirect(redirectUrl);
}))

// Logging Out From System
router.get(`/logout`,(req,res,next) => {
    req.logout((err) => {
        if(err) {
            return next();
        }
        req.flash(`success`, `SuccessFully Logged Out!`);
        res.redirect(`/listings`);
    })
    
})

module.exports = router;