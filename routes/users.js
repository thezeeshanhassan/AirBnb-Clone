const express = require(`express`);
const router = express.Router({ mergeParams: true });
const Listing = require(`../models/listing`); // Listing Schema
const wrapAsync = require(`../utils/wrapAsync`); // Function that Execute Other Functions If Error then throw Error
const ExpressError = require(`../utils/ExpressError`); // Extends JavaScript Error Class
const User = require(`../models/user.js`);
const passport = require(`passport`); // For Authentication (Main Library)
const localStrategy = require(`passport-local`); // Strategy For Authentication

router.get(`/signup`, (req, res) => {
    res.render(`../views/users/signup.ejs`);
})
router.post("/signup", async (req, res) => {
    let { username, email, password } = req.params;
    let newUser = new User({ username, email });
    let u = await newUser.register(newUser, password);
    req.flash(`success`, "User Successfully Signed Up!");
    res.redirect('/listings');
})

module.exports = router;