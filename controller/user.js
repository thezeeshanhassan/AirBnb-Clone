const User = require(`../models/user.js`); // User Schema

//// Function to Render SignUp Form
module.exports.renderSignUpForm = (req, res) => {
    res.render(`../views/users/signup.ejs`);
}

//// Function to SignUp
module.exports.signUp = async (req, res) => {
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
}

//// Function to Render LogInForm Form
module.exports.renderLogInForm = (req,res) => {
    res.render(`../views/users/login.ejs`);
}

//// Function to LogIn
module.exports.logIn = async(req,res) => {
    req.flash(`success`, `${req.body.username}! You have Successfully Logged In. Welcome!`);
    console.log(res.locals.redirectUrl);
    let redirectUrl = res.locals.redirectUrl || `/listings`;
    res.redirect(redirectUrl);
}

//// Function to LogOut
module.exports.logOut = (req,res,next) => {
    req.logout((err) => {
        if(err) {
            return next();
        }
        req.flash(`success`, `SuccessFully Logged Out!`);
        res.redirect(`/listings`);
    })
    
}