const express = require(`express`); // JS Library 
const mongoose = require(`mongoose`); // Database MonoDb
const path = require(`path`); // Connect Path of Directories
const Listing = require(`./models/listing`); // Listing Schema
const methodOverride = require(`method-override`); // To obtain Patch or Put 
const ejsMate = require(`ejs-mate`); // For Layouts Like BoilerPlate 
const wrapAsync = require(`./utils/wrapAsync`); // Function that Execute Other Functions If Error then throw Error
const ExpressError = require(`./utils/ExpressError`); // Extends JavaScript Error Class 
const listeningSchema = require(`./schemaValidation`); // Joi Schema Method to validate Schema (Post/Reqs)
const { error } = require("console");

const app = express();

app.set(`view engine`, 'ejs');
app.set(`views`, path.join(__dirname, `views`));
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public")));
app.use(express.static('public'));
app.use(methodOverride(`_method`));
app.engine(`ejs`, ejsMate);



// Conection Creation Starts
main().then(() => {
    console.log(`Connection Done`);
}).catch((err) => {
    console.log(err);
})

async function main() {
    await mongoose.connect(`mongodb://127.0.0.1:27017/wanderLust`);
}
// Conection Creation Ends

const validateSchema = (req, res, next) => {
    let { error } = listeningSchema.validate(req.body);
    if (error) {
        // If Error Send Error to User 
        let { details } = error;
        let errMsg = details[0].message;
        throw new ExpressError(400, errMsg);
    }
    else {
        next();
    }
}

app.get(`/`, (req, res) => {
    res.send(`Working on the PORT ${port}`)
})

//// Route for Show All Listings

app.get(`/listings`, wrapAsync(async (req, res, next) => {
    let allListing = await Listing.find({});
    res.render(`listings/index.ejs`, { allListing });
}))

//// Route to Create New Post

app.get(`/listing/new`, (req, res) => {
    res.render(`listings/new.ejs`);
})

//// Route to See Detail of Each Post
app.get(`/listing/:id`, wrapAsync(async (req, res) => {
    let id = req.params.id;
    let detailByID = await Listing.findById(id);
    res.render(`listings/show.ejs`, { detailByID });
}))

//// Insert New Post To Database From User
app.post(`/listings`, validateSchema, wrapAsync(async (req, res, next) => {
    // Validating Req.Body that Each Parameter Exists and Validated through Joi
    const newListing = new Listing(req.body.listing);
    await newListing.save();
    res.redirect(`/listings`);
}))

//// Updating the Post ////
// Edit Route

app.get("/listings/:id/edit", wrapAsync(async (req, res) => {
    let { id } = req.params;
    let detailByID = await Listing.findById(id);
    res.render(`listings/edit.ejs`, { detailByID });
}))

// Update Route
app.patch("/listings/:id", validateSchema, wrapAsync(async (req, res) => {
    let { id } = req.params;
    // let id = req.params.id;
    console.log(id);
    await Listing.findByIdAndUpdate(id, { ...req.body.listing });
    res.redirect(`/listings`);
}))

//// Delete Route
app.delete(`/listings/:id`, wrapAsync(async (req, res) => {
    let id = req.params.id;
    await Listing.findByIdAndDelete(id);
    res.redirect(`/listings`);
}))

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