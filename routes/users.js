const express = require(`express`);
const router = express.Router({ mergeParams: true }); 
const User = require(`../models/user.js`); // User Schema
const passport = require(`passport`); // For Authentication (Main Library)
const wrapAsync = require("../utils/wrapAsync.js");
const {saveRedirectUrl} = require(`../middlewares.js`); //To get Redirecting Url (Path)
const userController = require(`../controller/user.js`); // Contain All User Function

//// User Sign Up Route
router.get(`/signup`, userController.renderSignUpForm);
router.post("/signup", wrapAsync(userController.signUp));

//// User LogIn Route
router.get(`/login`, userController.renderLogInForm);

//// PassPort.authenticate() is used for authentication is User Enter correct Credentials
//// FailureFlash throw Flash
//Save Redirect Url
router.post(`/login`,saveRedirectUrl, passport.authenticate(`local`, {failureRedirect : `/login`, failureFlash : true}),wrapAsync(userController.logIn));

// Logging Out From System
router.get(`/logout`,userController.logOut);

module.exports = router;