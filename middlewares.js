const Listing = require(`./models/listing.js`); // Listing Schema
const ExpressError = require(`./utils/ExpressError`); // Extends JavaScript Error Class 
const { listeningSchema } = require(`./schemaValidation.js`); // Joi Schema Method to validate Schema (Post/Reqs) 
const { reviewSchema } = require(`./schemaValidation`); // Joi Schema Method to validate Schema (Post/Reqs)

module.exports.isLoggedIn =  (req, res ,next) =>
{
    if(!req.isAuthenticated()) // req.authenticated() checks that User is authenticated or not
    {
        // Redirects URL Redirect the User Where he want to Go Before LogIn, After LogIn he Will 
        // Go there With Help of Redirect URl
        req.session.redirectUrl = req.originalUrl;
        req.flash(`error`, `You must be Logged In to Proceede this Operation!`);
        return res.redirect(`/login`);
    }
    next();
}

module.exports.saveRedirectUrl = (req, res, next) => {
    if(req.session.redirectUrl)
    {
        res.locals.redirectUrl = req.session.redirectUrl;
    }
    next();
}

// Authentication for Listing
module.exports.isRightUserForListing = async (req,res,next) => {
    let {id} = req.params;
    let listing = await Listing.findById(id);
    if(!res.locals.currUser._id.equals(listing.owner))
    {
        req.flash(`error` , `You are not the right Owner of this Post`);
        return res.redirect(`/listings/${id}`);
    }
    next();
}

// Authentication for Reviwew
// module.exports.isRightUserForReview = async (req,res,next) => {
//     let {reviewId , id} = req.params;
//     let review = await Listing.findById(reviewId);
//     console.log(review);
//     // if(!res.locals.currUser._id.equals(review.createdBy))
//     // {
//     //     req.flash(`error` , `You are not the right Owner of this Post`);
//     //     return res.redirect(`/listings/${id}`);
//     // }
//     next();
// }

module.exports.validateListingSchema = (req, res, next) => {
    let { error } = listeningSchema.validate(req.body);
    if (error) {
        let { details } = error;
        let errMsg = details[0].message;
        throw new ExpressError(400, error);
        res.send(error);
    }
    else {
        return next();
    }
}

module.exports.validateReviewSchema = (req, res, next) => {
    let { error } = reviewSchema.validate(req.body);
    if (error) {
        let { details } = error;
        let errMsg = details[0].message;
        throw new ExpressError(400, errMsg);
    }
    else {
        return next();
    }
}