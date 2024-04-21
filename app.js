const express = require(`express`); // JS Library 
const mongoose = require(`mongoose`); // Database MonoDb
const path = require(`path`); // Connect Path of Directories
const methodOverride = require(`method-override`); // To obtain Patch or Put 
const ejsMate = require(`ejs-mate`); // For Layouts Like BoilerPlate 
const ExpressError = require(`./utils/ExpressError`); // Extends JavaScript Error Class 
const listings = require(`./routes/listings.js`); // Listing Route
const reviews = require(`./routes/reviews.js`); // Review Route
const session = require(`express-session`); //Express - Session
const flash = require(`connect-flash`); // To Flash Success or Failure Message

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

app.use((req, res, next) => {
    res.locals.success = req.flash(`success`);
    res.locals.error = req.flash(`error`);
    next();
})


app.use("/listings", listings);
app.use("/listings/:id/reviews", reviews);

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