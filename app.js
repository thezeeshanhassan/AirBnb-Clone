const express = require(`express`); // JS Library 
const mongoose = require(`mongoose`); // Database MonoDb
const path = require(`path`); // Connect Path of Directories
const methodOverride = require(`method-override`); // To obtain Patch or Put 
const ejsMate = require(`ejs-mate`); // For Layouts Like BoilerPlate 
const ExpressError = require(`./utils/ExpressError`); // Extends JavaScript Error Class 
const listingRoute = require(`./routes/listings.js`); // Listing Route
const reviewRoute = require(`./routes/reviews.js`); // Review Route
const session = require(`express-session`); //Express - Session
const flash = require(`connect-flash`); // To Flash Success or Failure Message
const passport = require(`passport`); // For Authentication (Main Library)
const localStrategy = require(`passport-local`); // Strategy For Authentication
const User = require(`./models/user.js`); //User Schema
const userRoute = require(`./routes/users.js`);

// Conection Creation Starts
main().then(() => {
    console.log(`Connection Done`);
}).catch((err) => {
    console.log(err);
})

async function main() {
    await mongoose.connect(`mongodb://127.0.0.1:27017/wanderLust`);
}

const app = express();

app.set(`view engine`, 'ejs');
app.set(`views`, path.join(__dirname, `views`));
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public")));
app.use(express.static('public'));
app.use(methodOverride(`_method`));
app.engine(`ejs`, ejsMate);

const sessionOptions = {
    secret: "MySuperSecret",
    resave: false,
    saveUninitialized: true,
    cookie: {
        expires: Date.now() + 7 * 24 * 3600 * 1000,
        maxAge: 7 * 24 * 3600 * 1000,
        httpOnly: true
    }
}

app.use(session(sessionOptions));
app.use(flash());

////// Authentication With Passport Start

app.use(passport.initialize()); //Initilize Passport Library
app.use(passport.session()); //Checks Requests and Response and Session Details that Which User is getting Responses and doing Requests

passport.use(new localStrategy(User.authenticate())); //Authenticate Every User with Local Stratgery
passport.serializeUser(User.serializeUser()); // Store User Information in Session (Serialization)
passport.deserializeUser(User.deserializeUser()); // UnStore User Information in Session (DeSerialization)

////// Authentication With Passport Ends

app.use((req, res, next) => {
    res.locals.success = req.flash(`success`);
    res.locals.error = req.flash(`error`);
    next();
})


app.use("/listings", listingRoute);
app.use("/listings/:id/reviews", reviewRoute);
app.use("/", userRoute);

// Conection Creation Ends
app.get(`/`, (req, res) => {
    res.send(`Working on the PORT ${port}`)
})

///// Error Handling
app.all(`*`, (req, res, next) => {
    next(new ExpressError(404, "Page Not Found"))
})

app.use((err, req, res, next) => {
    let { statusCode = 500, message = "Something Went Wrong" } = err;
    res.status(statusCode).render(`listings/error.ejs`, { err });
})

//// Defining Port
let port = 8080;
app.listen(port, () => {
    console.log(`App is Listening on the Port : ${port}`);
})