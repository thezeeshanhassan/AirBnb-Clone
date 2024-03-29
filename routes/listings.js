const express = require(`express`);
const router = express.Router();
const Listing = require(`../models/listing`); // Listing Schema
const wrapAsync = require(`../utils/wrapAsync`); // Function that Execute Other Functions If Error then throw Error
const { listeningSchema } = require(`../schemaValidation.js`); // Joi Schema Method to validate Schema (Post/Reqs)
const ExpressError = require(`../utils/ExpressError`); // Extends JavaScript Error Class 


//// MiddleWares For Schema Validation (Server Side Validation)

const validateListingSchema = (req, res, next) => {
    let { error } = listeningSchema.validate(req.body);
    if (error) {
        // let { details } = error;
        // let errMsg = details[0].message;
        // throw new ExpressError(400, error);
        res.send(error);
    }
    else {
        return next();
    }
}

//// Route for Show All Listings
router.get(`/`, wrapAsync(async (req, res, next) => {
    let allListing = await Listing.find({});
    res.render(`listings/index.ejs`, { allListing });
}))

//// Route to Create New Post

router.get(`/new`, (req, res) => {
    res.render(`listings/new.ejs`);
})

//// Route to See Detail of Each Post (Show Route)
router.get(`/:id`, wrapAsync(async (req, res) => {
    let id = req.params.id;
    let detailByID = await Listing.findById(id).populate(`review`);
    res.render(`listings/show.ejs`, { detailByID });
}))

//// Insert New Post To Database From User
// validateListingSchema MiddleWare Called while Server Side Validation
router.post(`/`, validateListingSchema, wrapAsync(async (req, res, next) => {

    // Validating Req.Body that Each Parameter Exists and Validated through Joi
    const newListing = new Listing(req.body.listing);
    await newListing.save();
    res.redirect(`/listings`);
}))

//// Updating the Post ////


// Edit Route
router.get("/:id/edit", wrapAsync(async (req, res) => {
    let { id } = req.params;
    let detailByID = await Listing.findById(id);
    res.render(`listings/edit.ejs`, { detailByID });
}))

// Update Route
// validateListingSchema MiddleWare Called while Server Side Validation
router.patch("/:id", validateListingSchema, wrapAsync(async (req, res) => {
    let { id } = req.params;
    console.log(id);
    await Listing.findByIdAndUpdate(id, { ...req.body.listing });
    res.redirect(`/listings`);
}))

//// Delete Route
router.delete(`/:id`, wrapAsync(async (req, res) => {
    let id = req.params.id;
    await Listing.findByIdAndDelete(id);
    res.redirect(`/listings`);
}))

module.exports = router;