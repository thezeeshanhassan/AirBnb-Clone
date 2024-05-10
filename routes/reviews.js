const express = require(`express`);
const router = express.Router({ mergeParams: true });
const Listing = require(`../models/listing`); // Listing Schema
const wrapAsync = require(`../utils/wrapAsync`); // Function that Execute Other Functions If Error then throw Error
// const ExpressError = require(`../utils/ExpressError`); // Extends JavaScript Error Class 
// const { reviewSchema } = require(`../schemaValidation`); // Joi Schema Method to validate Schema (Post/Reqs)
const Review = require(`../models/review`); // Review Schema
const { validateReviewSchema} = require(`../middlewares.js`);
const {isLoggedIn} = require(`../middlewares.js`) // Middleware LoggedIn Checks that User is LoggedIn to perform CRUD operations

//// MiddleWares For Schema Validation (Server Side Validation)
// const validateReviewSchema = (req, res, next) => {
//     let { error } = reviewSchema.validate(req.body);
//     if (error) {
//         let { details } = error;
//         let errMsg = details[0].message;
//         throw new ExpressError(400, errMsg);
//     }
//     else {
//         return next();
//     }
// }

// Creating Review Route
router.post(`/`, isLoggedIn, validateReviewSchema, wrapAsync(async (req, res) => {
    let { id } = req.params;
    let listing = await Listing.findById(id);
    let newReview = new Review(req.body.review);
    newReview.createdBy = req.user._id;
    // Adding Review to Lisiting
    listing.review.push(newReview);
    listing.save();
    newReview.save();
    req.flash(`success`, "New Review Added Successfully!");
    res.redirect(`/listings/${id}`);
}))

// Delete Review Route

router.delete(`/:reviewId`,isLoggedIn, wrapAsync(async (req, res) => {
    let { id, reviewId } = req.params;
    let listing = await Listing.findById(id);
    let review = await Review.findById(reviewId);

    if(req.user._id.equals(review.createdBy)) 
    {
    await Listing.findByIdAndUpdate(id, { $pull: { review: reviewId } });
    req.flash(`success`, "Review Deleted Successfully!");
    await Review.findByIdAndDelete(reviewId);
    res.redirect(`/listings/${id}`);
    }
    else {
        req.flash(`error`, "You are not the righ owner of this Review");
        res.redirect(`/listings/${id}`);
    }
}))

module.exports = router;