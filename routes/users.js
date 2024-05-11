const express = require(`express`);
const router = express.Router({ mergeParams: true }); 
const User = require(`../models/user.js`); // User Schema
const passport = require(`passport`); // For Authentication (Main Library)
const wrapAsync = require("../utils/wrapAsync.js");
const {saveRedirectUrl} = require(`../middlewares.js`); //To get Redirecting Url (Path)
const userController = require(`../controller/user.js`); // Contain All User Function

/* router.route is used when multiple route has same path. It helps not to write same path repeatedly */

//// User Sign Up Route
router.route(`/signup`)
.get(userController.renderSignUpForm)
.post(wrapAsync(userController.signUp));

//// User LogIn Route
router.route(`/login`)
.get(userController.renderLogInForm)
//// PassPort.authenticate() is used for authentication is User Enter correct Credentials
//// FailureFlash throw Flash
//Save Redirect Url
.post(saveRedirectUrl, passport.authenticate(`local`, {failureRedirect : `/login`, failureFlash : true}),wrapAsync(userController.logIn));

// Logging Out From System
router.get(`/logout`,userController.logOut);

module.exports = router;